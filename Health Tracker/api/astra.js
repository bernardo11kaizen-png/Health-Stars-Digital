// api/astra.js
export default async function handler(req, res) {
  // 1. Evitar que otras webs usen tu API
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { mensaje } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Clave oculta en Vercel

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key no configurada en el servidor' });
  }

  try {
    // 2. Llamada oficial a la API de Google AI Studio (Gemini 1.5 Flash - rápido y económico)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: mensaje }] }],
        systemInstruction: {
          parts: [{ text: "Eres Astra AI, el asistente clínico conversacional de la app HealthStars en Panamá. Sé empático, claro y asiste a pacientes crónicos con su SFT." }]
        }
      })
    });

    const data = await response.json();
    
    // 3. Extraer el texto de respuesta de Google
    const respuestaAI = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ respuesta: respuestaAI });

  } catch (error) {
    return res.status(500).json({ error: 'Error al conectar con Astra AI' });
  }
}