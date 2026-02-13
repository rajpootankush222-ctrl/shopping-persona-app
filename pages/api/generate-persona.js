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
      avatarUrl: avatarUrl,
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
Keep exact facial structure and proportions.
Do not change eye shape, nose, or skin tone.
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
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024",
      image: base64Photo,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI error:", errorText);
    throw new Error("Image edit failed");
  }

  const data = await response.json();
  return data.data[0].url;
}

/* -------------------------
   PERSONA LOGIC
------------------------- */

function generatePersonaLocally(answers = {}) {
  const { cartBehavior, paymentStyle, shoppingSpeed } = answers;

  const personas = {
    "ghost-prepaid-lightning": {
      title: "⚡ Lightning Cart Ghost 👻",
      superheroName: "The Phantom Shopper",
      traits: [
        "🛒 Ghosts carts faster than light",
        "💳 Pays only when convinced",
        "⚡ In and out instantly",
      ],
      tagline: "Fast decisions. Faster exits.",
      cardColor: { start: "#E91E63", end: "#FC5185" },
      costume: "sleek electric purple superhero suit with glowing lightning emblem",
      pose: "dynamic superhero stance with lightning energy around hands",
      powers: "purple electric aura and disappearing shopping bags turning into sparkles",
      background: "cinematic purple and pink gradient with lightning energy effects",
    },
  };

  const key = `${cartBehavior}-${paymentStyle}-${shoppingSpeed}`;

  return (
    personas[key] || {
      title: "🦄 Unique Shopping Hero",
      superheroName: "The Original",
      traits: [
        "🛒 One-of-a-kind shopping style",
        "💳 Shops their way",
        "⚡ Legendary energy",
      ],
      tagline: "No rules. Just vibes.",
      cardColor: { start: "#E91E63", end: "#FC5185" },
      costume: "modern vibrant superhero outfit with stylish pink gradient accents",
      pose: "confident heroic stance with hands on hips",
      powers: "soft glowing aura with floating shopping icons",
      background: "cinematic pink gradient background with subtle energy glow",
    }
  );
}
