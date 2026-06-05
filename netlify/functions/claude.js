exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GEMINI_KEY not configured' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  try {
    // Convertir formato Anthropic → formato Gemini
    const systemPrompt = body.system || '';
    const messages = body.messages || [];

    // Construir parts de Gemini
    const parts = [];

    // Añadir system prompt como primer texto
    if (systemPrompt) {
      parts.push({ text: systemPrompt + '\n\n' });
    }

    // Procesar mensajes
    for (const msg of messages) {
      if (typeof msg.content === 'string') {
        parts.push({ text: msg.content });
      } else if (Array.isArray(msg.content)) {
        for (const block of msg.content) {
          if (block.type === 'text') {
            parts.push({ text: block.text });
          } else if (block.type === 'image' && block.source?.data) {
            parts.push({
              inlineData: {
                mimeType: block.source.media_type || 'image/jpeg',
                data: block.source.data
              }
            });
          }
        }
      }
    }

    const geminiBody = {
      contents: [{ parts }],
      generationConfig: {
        maxOutputTokens: body.max_tokens || 1000,
        temperature: 0.1
      }
    };

    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini error:', response.status, JSON.stringify(data));
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: data.error?.message || 'Gemini error' })
      };
    }

    // Convertir respuesta Gemini → formato Anthropic (para no cambiar el frontend)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const anthropicFormat = {
      content: [{ type: 'text', text }],
      usage: { input_tokens: 0, output_tokens: 0 }
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(anthropicFormat)
    };

  } catch (err) {
    console.error('Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
 
