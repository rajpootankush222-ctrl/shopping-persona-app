// pages/api/generate-persona.js
// This is a Vercel serverless function

export default async function handler(req, res) {
  console.log("BODY:", req.body);
  }

  const { answers, photo } = req.body;

  try {
    // Step 1: Get persona from Claude
    const personaData = await getPersonaFromClaude(answers);
    
    // Step 2: Generate avatar with Replicate
    const avatarUrl = await generateAvatar(photo, personaData);
    
    // Step 3: Return complete result
    return res.status(200).json({
      personaTitle: personaData.title,
      trait1: personaData.traits[0],
      trait2: personaData.traits[1],
      trait3: personaData.traits[2],
      tagline: personaData.tagline,
      cardColor: personaData.cardColor,
      avatarUrl: avatarUrl
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to generate persona' });
  }
}

async function getPersonaFromClaude(answers) {
  const prompt = `You are a fun shopping persona generator. Based on these answers, assign a hilarious shopping persona.

Answers:
- Cart behavior: ${answers.cartBehavior}
- Payment style: ${answers.paymentStyle}  
- Shopping speed: ${answers.shoppingSpeed}

Generate a JSON response with:
{
  "title": "A funny persona title (e.g., 'Certified Cart Ghost 👻', 'Last-Minute Glam Goddess ✨')",
  "traits": [
    "🛒 Trait about their shopping style",
    "💳 Trait about their payment behavior",
    "⚡ Trait about their speed/planning"
  ],
  "tagline": "A funny one-liner tagline (max 60 chars)",
  "cardColor": {
    "start": "#HEX_COLOR",
    "end": "#HEX_COLOR"
  },
  "avatarStyle": "Detailed description for image generation"
}

Make it super fun and relatable! Use emojis. The cardColor should match the persona vibe.

For avatarStyle, describe a Disney/Pixar-style 3D character portrait based on the persona. Include mood, props, color scheme, and personality. Example: "Confident character surrounded by shopping bags, mischievous grin, purple-blue gradient background, holding a glowing phone, playful energy"`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  const data = await response.json();
  const content = data.content[0].text;
  
  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');
  
  return JSON.parse(jsonMatch[0]);
}

async function generateAvatar(photoBase64, personaData) {
  // Create the prompt for avatar generation
  const imagePrompt = `3D animated character portrait, modern Pixar-Disney animation style, professional quality render, vibrant colors, studio lighting, shallow depth of field, highly detailed.

Character description: ${personaData.avatarStyle}

Style: Stylized 3D character art with exaggerated features, expressive face, warm lighting, gradient background, cinematic composition. High resolution, centered portrait, no text or logos.`;

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637", // FLUX schnell
      input: {
        prompt: imagePrompt,
        num_inference_steps: 4,
        guidance_scale: 3.5,
        width: 768,
        height: 768,
        num_outputs: 1
      }
    })
  });

  let prediction = await response.json();
  
  // Poll for completion
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const statusResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      }
    );
    prediction = await statusResponse.json();
  }

  if (prediction.status === 'failed') {
    throw new Error('Image generation failed');
  }

  return prediction.output[0]; // URL of generated image
}
