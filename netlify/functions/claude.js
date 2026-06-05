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

  // Lista de modelos a intentar en orden
  const MODELS = [
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
  ];

  const systemPrompt = body.system || '';
  const messages = body.messages || [];

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

  const geminiBody = {
    contents: [{ role: 'user', parts: userParts }],
    generationConfig: { maxOutputTokens: body.max_tokens || 1000, temperature: 0.1 }
  };
  if (systemPrompt) {
    geminiBody.system_instruction = { parts: [{ text: systemPrompt }] };
  }

  // Intentar cada modelo hasta que uno funcione
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    console.log('Trying model:', model);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody)
      });

      const data = await response.json();

      if (response.status === 404) {
        console.log('Model not found, trying next:', model);
        continue; // Probar siguiente modelo
      }

      if (!response.ok) {
        console.error('Gemini error with', model, ':', JSON.stringify(data));
        return {
          statusCode: response.status,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: data.error?.message || 'Gemini error' })
        };
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('Success with model:', model, '- response length:', text.length);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ content: [{ type: 'text', text }] })
      };

    } catch (err) {
      console.error('Fetch error with', model, ':', err.message);
      continue;
    }
  }

  // Si ningún modelo funcionó
  return {
    statusCode: 503,
    body: JSON.stringify({ error: 'No hay modelos de IA disponibles. Inténtalo más tarde.' })
  };
};
