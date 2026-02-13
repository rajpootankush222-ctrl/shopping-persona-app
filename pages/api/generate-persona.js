// pages/api/generate-persona.js

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { answers, photo } = req.body;

    if (!photo) {
      return res.status(400).json({ error: "Photo is required" });
    }

    const personaData = generatePersonaLocally(answers);

    const avatarUrl = await generateSuperhero(personaData, photo);

    return res.status(200).json({
      personaTitle: personaData.title,
      trait1: personaData.traits[0],
      trait2: personaData.traits[1],
      trait3: personaData.traits[2],
      tagline: personaData.tagline,
      cardColor: personaData.cardColor,
      avatarUrl,
      superheroName: personaData.superheroName,
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Superhero generation failed",
      details: error.message,
    });
  }
}

/* -------------------------
   IMAGE GENERATION
------------------------- */

async function generateSuperhero(personaData, base64Photo) {
  const prompt = `
Transform this real person into a 3D Pixar-style superhero.
Keep the exact facial structure and proportions.
Do NOT change eye shape, nose, or skin tone.
Only add superhero costume.

COSTUME:
${personaData.costume}

POSE:
${personaData.pose}

POWERS:
${personaData.powers}

BACKGROUND:
${personaData.background}

No text. No watermark.
`;

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      image: base64Photo
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI error:", errorText);
    throw new Error("Image edit failed");
  }

  const da
