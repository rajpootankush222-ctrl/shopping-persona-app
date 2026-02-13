// pages/api/generate-persona.js
// TWO-STEP PROCESS: 
// 1. GPT-4 Vision analyzes user photo
// 2. DALL-E generates Pixar superhero based on analyzed features

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, photo } = req.body;

  try {
    // Step 1: Generate persona based on answers
    const personaData = generatePersonaLocally(answers);
    
    // Step 2: Use GPT-4 Vision to analyze the user's photo
    console.log('Step 1: Analyzing user photo with GPT-4 Vision...');
    const facialAnalysis = await analyzePhotoWithGPT4Vision(photo);
    console.log('Facial analysis:', facialAnalysis);
    
    // Step 3: Generate Pixar superhero with analyzed facial features
    console.log('Step 2: Generating Pixar superhero avatar...');
    const avatarUrl = await generatePixarSuperheroFromAnalysis(personaData, facialAnalysis);
    console.log('Avatar generated:', avatarUrl);
    
    return res.status(200).json({
      personaTitle: personaData.title,
      trait1: personaData.traits[0],
      trait2: personaData.traits[1],
      trait3: personaData.traits[2],
      tagline: personaData.tagline,
      cardColor: personaData.cardColor,
      avatarUrl: avatarUrl,
      superheroName: personaData.superheroName
    });

  } catch (error) {
    console.error('Error generating persona:', error);
    return res.status(500).json({ 
      error: 'Failed to generate persona', 
      details: error.message 
    });
  }
}

function generatePersonaLocally(answers) {
  const { cartBehavior, paymentStyle, shoppingSpeed } = answers;
  
  const personas = {
    'ghost-prepaid-lightning': {
      title: '⚡ Lightning Cart Ghost 👻',
      superheroName: 'The Phantom Shopper',
      traits: [
        '🛒 Ghosts carts faster than light',
        '💳 Only pays when feeling generous',
        '⚡ In and out like a ninja'
      ],
      tagline: 'If it takes longer than 5 mins, it\'s abandoned',
      cardColor: { start: '#667eea', end: '#764ba2' },
      costume: 'sleek purple and electric blue superhero suit with lightning bolt emblem on chest, flowing translucent cape, stylish purple domino mask with lightning accents',
      powers: 'purple energy aura, shopping bags vanishing into sparkles, lightning effects crackling around hands',
      background: 'purple and blue gradient with lightning bolts and phantom shopping bag silhouettes'
    },
    'ghost-cod-planner': {
      title: '📋 Calculated Cart Ghost 👻',
      superheroName: 'The Strategist',
      traits: [
        '🛒 Plans to ghost the cart the night before',
        '💳 Cash on Delivery for peace of mind',
        '⚡ Slow and steady abandonment'
      ],
      tagline: 'I ghost with intention, not impulse',
      cardColor: { start: '#f093fb', end: '#f5576c' },
      costume: 'sophisticated pink and purple tactical superhero suit with utility pouches, smart shoulder cape, intelligent-looking pink mask with HUD display',
      powers: 'holographic shopping lists and strategic plans floating around, clipboard shield',
      background: 'pink gradient with geometric patterns and data visualizations'
    },
    'ghost-bnpl-zen': {
      title: '🧘 Zen Cart Ghost 👻',
      superheroName: 'The Mindful Warrior',
      traits: [
        '🛒 Takes time to ghost the perfect cart',
        '💳 Buy Now, Ghost Later philosophy',
        '⚡ Mindful abandonment is an art'
      ],
      tagline: 'Ghosting carts is my meditation',
      cardColor: { start: '#4facfe', end: '#00f2fe' },
      costume: 'flowing light blue and cyan martial arts inspired superhero suit with zen circle emblem, meditation-style wrapped sash, peaceful blue mask with third eye symbol',
      powers: 'chi energy swirls, shopping items orbiting peacefully, zen aura',
      background: 'tranquil blue gradient with floating clouds and zen circles'
    },
    'decisive-prepaid-lightning': {
      title: '🚀 Rocket Checkout Champion ⚡',
      superheroName: 'Captain Checkout',
      traits: [
        '🛒 Cart to checkout in 3 seconds flat',
        '💳 Prepaid discount hunter supreme',
        '⚡ Speed shopping is my superpower'
      ],
      tagline: 'I see it, I buy it, I own it',
      cardColor: { start: '#fa709a', end: '#fee140' },
      costume: 'vibrant pink and yellow armored superhero suit with star emblem and rocket boosters on boots, aerodynamic pink mask with speed lines, championship belt',
      powers: 'speed force lightning crackling around body, shopping bags as victory trophies',
      background: 'dynamic pink-yellow gradient with speed lines and comic-style POW effects'
    },
    'decisive-cod-planner': {
      title: '📊 Strategic Instant Buyer 💼',
      superheroName: 'Commander Commerce',
      traits: [
        '🛒 Plans purchases, executes instantly',
        '💳 COD for maximum control',
        '⚡ Calculated but decisive'
      ],
      tagline: 'Plan fast, buy faster',
      cardColor: { start: '#30cfd0', end: '#330867' },
      costume: 'high-tech teal and purple tactical armor with digital display panels and commander insignia, advanced teal visor mask with targeting system, tech-enhanced gloves',
      powers: 'holographic tactical displays surrounding character, data streams flowing from fingertips',
      background: 'sleek teal-purple gradient with digital grid and command center holograms'
    },
    'decisive-bnpl-zen': {
      title: '😎 Chill YOLO Spender 🎯',
      superheroName: 'The Cool Crusader',
      traits: [
        '🛒 Decisive when the vibe is right',
        '💳 BNPL because why stress?',
        '⚡ Relaxed but committed'
      ],
      tagline: 'I decide now, pay whenever',
      cardColor: { start: '#a8edea', end: '#fed6e3' },
      costume: 'stylish pastel blue and pink casual-cool superhero suit with trendy jacket overlay, fashionable mirror sunglasses as superhero mask',
      powers: 'chill confidence aura, credit cards floating like playing cards being shuffled',
      background: 'soft pastel gradient with dreamy bokeh effects and YOLO energy wisps'
    },
    'collector-prepaid-lightning': {
      title: '🎨 Flash Art Curator ⚡',
      superheroName: 'The Artisan',
      traits: [
        '🛒 Curates carts like museum exhibits',
        '💳 Hunts discounts like treasure',
        '⚡ Quick eye for the perfect piece'
      ],
      tagline: 'My cart is a masterpiece in 5 minutes',
      cardColor: { start: '#ff9a9e', end: '#fecfef' },
      costume: 'artistic pink superhero suit with paint-splash patterns, elegant cape like flowing paint, artist beret accessory, creative pink mask with artistic swirls',
      powers: 'shopping items on display pedestals with magical curator light beams, artistic sparkles',
      background: 'vibrant pink gradient with paint splashes and golden picture frames floating'
    },
    'collector-cod-planner': {
      title: '🗂️ Wishlist Architect 📋',
      superheroName: 'The Builder',
      traits: [
        '🛒 Each item carefully selected',
        '💳 Cash on Delivery, no risks',
        '⚡ Patience is part of the process'
      ],
      tagline: 'Rome wasn\'t built in a day, neither is my cart',
      cardColor: { start: '#ffecd2', end: '#fcb69f' },
      costume: 'structured peach and gold superhero suit with architectural line patterns, builder cape with blueprint design, professional peach mask, architect insignia',
      powers: 'shopping items assembling like building blocks, holographic blueprints swirling',
      background: 'warm peach gradient with architectural grid lines and golden construction beams'
    },
    'collector-bnpl-zen': {
      title: '☕ Slow Glow Collector 🌸',
      superheroName: 'The Cultivator',
      traits: [
        '🛒 Curating is a journey, not a race',
        '💳 BNPL for flexible collecting',
        '⚡ Time is just a construct'
      ],
      tagline: 'Good things come to those who browse',
      cardColor: { start: '#ffeaa7', end: '#fdcb6e' },
      costume: 'cozy golden yellow nature-inspired superhero suit with flower petal patterns, flowing garden-themed cape, gentle yellow mask with flower crown accessory',
      powers: 'nature magic making flowers bloom around shopping items, peaceful golden aura',
      background: 'warm golden gradient with soft sunbeams, floating flower petals and butterflies'
    }
  };

  const personaKey = `${cartBehavior}-${paymentStyle}-${shoppingSpeed}`;
  
  const persona = personas[personaKey] || {
    title: '🎭 Unique Shopping Unicorn 🦄',
    superheroName: 'The Legendary One',
    traits: [
      '🛒 One-of-a-kind shopping style',
      '💳 Unique payment philosophy',
      '⚡ Legendary shopping speed'
    ],
    tagline: 'One of a kind shopper extraordinaire!',
    cardColor: { start: '#667eea', end: '#764ba2' },
    costume: 'magical rainbow-colored superhero suit with unicorn horn crown, sparkling star cape, mystical rainbow mask with magical gem',
    powers: 'rainbow magic aura with sparkles, shopping bags as magical artifacts',
    background: 'vibrant rainbow gradient with stars and magical swirls'
  };

  return persona;
}

async function analyzePhotoWithGPT4Vision(photoBase64) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // GPT-4 with vision
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this person's facial features in extreme detail for creating a 3D Pixar-style character. Describe:

1. FACE SHAPE: (round, oval, square, heart-shaped, diamond, etc.)
2. SKIN TONE: (exact color description - fair, tan, brown, dark, etc. with undertones)
3. EYES: 
   - Shape (almond, round, hooded, upturned, downturned)
   - Color (exact shade)
   - Size (large, medium, small relative to face)
   - Eyebrow shape and thickness
4. NOSE:
   - Shape (button, straight, wide, narrow, pointed, rounded)
   - Size relative to face
5. MOUTH & LIPS:
   - Lip fullness (thin, medium, full)
   - Mouth width
   - Natural expression
6. HAIR:
   - Color (exact shade)
   - Style (straight, wavy, curly, length)
   - Texture
7. FACIAL STRUCTURE:
   - Cheekbone prominence
   - Jawline shape
   - Chin shape
8. EXPRESSION:
   - Natural facial expression
   - Smile style
   - Overall vibe (friendly, serious, playful, etc.)
9. AGE RANGE: (approximate)
10. DISTINCTIVE FEATURES: (dimples, freckles, facial hair, glasses, etc.)

Provide a detailed paragraph that captures their exact likeness for 3D character creation.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: photoBase64
                }
              }
            ]
          }
        ],
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GPT-4 Vision Error:', errorData);
      throw new Error(`GPT-4 Vision failed: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    return analysis;

  } catch (error) {
    console.error('Photo analysis error:', error);
    // Fallback to generic description if analysis fails
    return "A person with friendly features, expressive eyes, and a warm smile";
  }
}

async function generatePixarSuperheroFromAnalysis(personaData, facialAnalysis) {
  try {
    // Craft comprehensive prompt combining facial analysis + superhero costume
    const pixarPrompt = `Create a professional 3D Pixar-style superhero character portrait in the animation quality of "The Incredibles" movie.

CRITICAL - EXACT FACIAL FEATURES (THIS IS THE MOST IMPORTANT PART):
${facialAnalysis}

Transform this person into a superhero while KEEPING ALL their facial features, expressions, and likeness EXACTLY as described above.

SUPERHERO COSTUME & STYLING:
${personaData.costume}

SUPERPOWERS & EFFECTS:
${personaData.powers}

BACKGROUND:
${personaData.background}

TECHNICAL SPECIFICATIONS FOR PIXAR QUALITY:
- Professional 3D CGI rendering with Pixar Animation Studios quality
- Large, expressive Pixar-style eyes that MATCH the person's actual eye color and shape from the analysis
- Smooth, polished surfaces with subsurface scattering on skin
- Skin tone MUST match exactly as described in the facial analysis
- Volumetric lighting with dramatic superhero rim lights
- Rich, vibrant superhero colors with cinematic color grading
- Dynamic superhero pose - confident and powerful
- Centered composition, character filling 75% of frame
- Shallow depth of field with background blur
- Photo-realistic 3D rendering with stylized Pixar proportions
- Masterpiece quality studio lighting
- The character should look EXACTLY like the person described, just in Pixar 3D style with superhero costume

STYLE REFERENCE: Exactly like characters from Pixar's "The Incredibles" - same 3D rendering quality, same character design approach, same lighting and materials.

CRITICAL: Keep the person's EXACT facial features, hair color, skin tone, eye color, face shape, and expression as described. Only add the superhero costume and effects. The face should be recognizably the same person, just rendered in beautiful 3D Pixar style.

NO text, logos, or watermarks anywhere in the image.`;

    console.log('Sending prompt to DALL-E 3...');
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: pixarPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DALL-E Error:', errorData);
      throw new Error(`DALL-E failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('No image URL in response');
    }

    return data.data[0].url;

  } catch (error) {
    console.error('Avatar generation error:', error);
    throw error;
  }
}
