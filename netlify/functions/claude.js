exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_KEY not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  try {
    const systemPrompt = body.system || '';
    const messages = body.messages || [];

    // Construir parts del mensaje de usuario
    const userParts = [];
    for (const msg of messages) {
      if (typeof msg.content === 'string') {
        userParts.push({ text: msg.content });
      } else if (Array.isArray(msg.content)) {
        for (const block of msg.content) {
          if (block.type === 'text') {
            userParts.push({ text: block.text });
          } else if (block.type === 'image' && block.source?.data) {
            userParts.push({
              inlineData: {
                mimeType: block.source.media_type || 'image/jpeg',
                data: block.source.data
              }
            });
          }
        }
      }
    }

    // Formato correcto de Gemini API v1beta
    const geminiBody = {
      system_instruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
      contents: [{ role: 'user', parts: userParts }],
      generationConfig: {
        maxOutputTokens: body.max_tokens || 1000,
        temperature: 0.1
      }
    };

    // Eliminar system_instruction si está vacío
    if (!systemPrompt) delete geminiBody.system_instruction;

    // v1beta con gemini-1.5-flash es el combo más estable y gratuito
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    console.log('Calling Gemini URL:', url.replace(apiKey, 'HIDDEN'));
    console.log('Parts count:', userParts.length);
    console.log('Has image:', userParts.some(p => p.inlineData));

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    const data = await response.json();
    console.log('Gemini status:', response.status);

    if (!response.ok) {
      console.error('Gemini error:', JSON.stringify(data));
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: data.error?.message || 'Gemini error', details: data })
      };
    }

    // Convertir respuesta Gemini → formato compatible con el frontend
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Response text length:', text.length);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ content: [{ type: 'text', text }] })
    };

  } catch (err) {
    console.error('Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
