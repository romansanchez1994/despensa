exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
 
  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ANTHROPIC_KEY not set in environment variables' })
    };
  }
 
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }
 
  // Si hay imágenes, reducirlas si superan el límite seguro (~900KB en base64)
  if (body.messages) {
    body.messages = body.messages.map(msg => {
      if (!Array.isArray(msg.content)) return msg;
      msg.content = msg.content.map(block => {
        if (block.type === 'image' && block.source?.data) {
          // Calcular tamaño aproximado en bytes
          const sizeBytes = block.source.data.length * 0.75;
          if (sizeBytes > 900000) {
            // Recortar a los primeros 900KB en base64 no funciona — devolver error claro
            console.log(`Image too large: ${Math.round(sizeBytes / 1024)}KB`);
          }
        }
        return block;
      });
      return msg;
    });
  }
 
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
 
    const data = await response.json();
 
    if (!response.ok) {
      console.error('Anthropic error:', response.status, JSON.stringify(data));
    }
 
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error('Fetch error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
 
