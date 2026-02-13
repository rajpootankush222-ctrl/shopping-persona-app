// pages/api/generate-persona.js
import sharp from "sharp";
import FormData from "form-data";

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

    console.log("Starting identity-preserved superhero generation...");

    const personaData = generatePersonaLocally(answers);

    const processedImage = await preprocessImage(photo);

    const avatarUrl = await generateSuperheroWithFaceLock(
      personaData,
      processedImage
    );

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
    console.error("Generation error:", error);
    return res.status(500).json({
      error: "Superhero generation failed",
      details: error.message,
    });
  }
}

/* -------------------------
   IMAGE PREPROCESS
------------------------- */

async function preprocessImage(photoBase64) {
  const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const processed = await sharp(buffer)
    .resize(1024, 1024, { fit: "cover" })
    .toFormat("png")
    .toBuffer();

  return processed;
}

/* -------------------------
   IMAGE EDIT (FACE LOCK)
------------------------- */

async function generateSuperheroWithFaceLock(personaData, imageBuffer) {
  const prompt = `
Transform this real person into a 3D Pixar-style superhero.

CRITICAL:
- Keep their exact facial structure.
- Do NOT alter face proportions, eye spacing, nose shape, or skin tone.
- Only change clothing into superhero costume.
- Maintain recognizability.

STYLE:
- Pixar-level 3D rendering like The Incredibles
- Cinematic lighting
- High-detail shading
- Keep original face geometry

COSTUME:
${personaData.costume}

POSE:
${personaData.pose}

POWERS:
${personaData.powers}

BACKGROUND:
${personaData.background}

No text, no watermark.
`;

  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append("prompt", prompt);
  form.append("size", "1024x1024");
  form.append("image", imageBuffer, {
    filename: "input.png",
    contentType: "image/png",
  });

  const response = await fetch(
    "https://api.openai.com/v1/images/edits",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
      body: form,
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error(err);
    throw new Error("Image edit failed");
  }

  const data = await response.json();
  return data.data[0].url;
}

/* -------------------------
   PERSONA GENERATOR
------------------------- */

function generatePersonaLocally(answers) {
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
      tagline: "Fast decisions, faster exits",
      cardColor: { start: "#667eea", end: "#764ba2" },
      costume:
        "sleek purple electric superhero suit with lightning emblem and glowing accents",
      pose: "dynamic superhero stance with lightning crackling around hands",
      powers:
        "purple electric aura and disappearing shopping bags turning into sparkles",
      background:
        "purple and blue gradient with lightning energy effects",
    },
  };

  const key = `${cartBehavior}-${paymentStyle}-${shoppingSpeed}`;

  return (
    personas[key] || {
      title: "🦄 Unique Shopping Hero",
      superheroName: "The Original",
      traits: [
        "🛒 One of a kind",
        "💳 Shops their way",
        "⚡ Legendary energy",
      ],
      tagline: "No rules. Just vibes.",
      cardColor: { start: "#ff9a9e", end: "#fad0c4" },
      costume:
        "stylish modern superhero outfit with vibrant gradient accents",
      pose: "confident heroic stance",
      powers: "glowing aura and floating shopping elements",
      background: "soft cinematic gradient background",
    }
  );
}
