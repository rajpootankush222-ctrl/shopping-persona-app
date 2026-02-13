// pages/api/generate-persona.js
// ENHANCED: Ultra-detailed facial analysis + gender detection for accurate superhero conversion

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, photo } = req.body;

  try {
    console.log('=== STARTING SUPERHERO GENERATION ===');
    
    // Step 1: Analyze photo with GPT-4 Vision for ULTRA-DETAILED facial features
    console.log('Step 1: Analyzing uploaded photo...');
    const analysis = await analyzePhotoInDepth(photo);
    console.log('Analysis complete:', analysis);
    
    // Step 2: Generate persona based on answers
    const personaData = generatePersonaLocally(answers, analysis.gender);
    console.log('Persona assigned:', personaData.superheroName);
    
    // Step 3: Generate superhero avatar matching exact facial features
    console.log('Step 2: Generating Pixar superhero avatar...');
    const avatarUrl = await generateSuperheroWithExactFace(personaData, analysis);
    console.log('Avatar URL:', avatarUrl);
    
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
    console.error('ERROR in persona generation:', error);
    return res.status(500).json({ 
      error: 'Failed to generate persona', 
      details: error.message 
    });
  }
}

async function analyzePhotoInDepth(photoBase64) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are a professional character artist. Analyze this person's face with EXTREME PRECISION for creating an EXACT 3D Pixar-style replica.

Describe in vivid detail:

**GENDER**: Male or Female

**FACE STRUCTURE**:
- Overall face shape (round, oval, square, heart, diamond, oblong)
- Facial symmetry and proportions
- Cheekbone placement (high, medium, low) and prominence
- Jawline definition (sharp, soft, angular, rounded)
- Chin shape (pointed, rounded, square, cleft)
- Forehead size and shape

**SKIN**:
- Exact skin tone (use specific descriptors: ivory, beige, tan, brown, deep brown, etc.)
- Undertones (warm, cool, neutral)
- Skin texture details (smooth, some texture, etc.)

**EYES** (CRITICAL - BE VERY SPECIFIC):
- Eye shape (almond, round, hooded, monolid, deep-set, wide-set, close-set, upturned, downturned)
- Eye color (exact shade: light brown, dark brown, hazel, green, blue, grey, etc.)
- Eye size relative to face (large, medium, small)
- Iris characteristics
- Eyelid type and fold
- Eye spacing
- Eyebrow shape (arched, straight, angled, curved, s-shaped)
- Eyebrow thickness (thin, medium, thick, bushy)
- Eyebrow color

**NOSE** (CRITICAL):
- Bridge width (narrow, medium, wide)
- Bridge height (high, medium, low, flat)
- Nose tip shape (pointed, rounded, bulbous, upturned, downturned)
- Nostril shape and size
- Overall nose size relative to face

**MOUTH & LIPS**:
- Upper lip fullness (thin, medium, full)
- Lower lip fullness (thin, medium, full)
- Lip color (natural pink, rose, brown, etc.)
- Mouth width (narrow, medium, wide)
- Lip shape (cupid's bow, straight, etc.)
- Teeth visibility when smiling
- Natural mouth position

**HAIR**:
- Hair color (exact shade: jet black, dark brown, light brown, blonde, red, grey, white, dyed color)
- Hair style (short, medium, long, very long)
- Hair texture (straight, wavy, curly, kinky, coily)
- Hair part (center, side, no part)
- Hairline shape
- Hair volume and thickness

**FACIAL FEATURES**:
- Expression in photo (smiling, neutral, serious, etc.)
- Smile type if smiling (closed-mouth, showing teeth, wide, gentle)
- Dimples (present or absent, location)
- Laugh lines or crow's feet
- Any distinctive marks (moles, freckles, scars)
- Facial hair (clean-shaven, stubble, mustache, beard - if present, describe style and color)

**AGE APPEARANCE**: Approximate age range (teens, 20s, 30s, 40s, 50s+)

**OVERALL VIBE**: (friendly, serious, confident, gentle, bold, shy, etc.)

IMPORTANT: Be HYPER-SPECIFIC. Don't use generic descriptions. Describe THIS EXACT PERSON so another artist could recreate their face perfectly.

Format your response as a detailed paragraph that captures their COMPLETE facial likeness.`
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
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GPT-4 Vision Error:', errorData);
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const fullAnalysis = data.choices[0].message.content;
    
    // Extract gender
    const genderMatch = fullAnalysis.match(/\*\*GENDER\*\*:\s*(Male|Female)/i);
    const gender = genderMatch ? genderMatch[1].toLowerCase() : 'female';
    
    console.log('Detected gender:', gender);
    console.log('Full analysis length:', fullAnalysis.length, 'characters');
    
    return {
      gender: gender,
      facialDescription: fullAnalysis
    };

  } catch (error) {
    console.error('Photo analysis failed:', error);
    return {
      gender: 'female',
      facialDescription: 'A person with friendly features and expressive eyes'
    };
  }
}

function generatePersonaLocally(answers, gender) {
  const { cartBehavior, paymentStyle, shoppingSpeed } = answers;
  
  const genderPronouns = gender === 'male' ? 
    { person: 'man', they: 'he', their: 'his' } : 
    { person: 'woman', they: 'she', their: 'her' };
  
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
      costume: `sleek purple and electric blue superhero suit with lightning bolt emblem on chest, flowing translucent cape that fades like a ghost, stylish purple domino mask with lightning accents`,
      pose: `dynamic superhero pose with one hand raised creating lightning effects, confident stance`,
      powers: `purple energy aura crackling around ${genderPronouns.their} body, shopping bags vanishing into sparkles and ghost-like wisps`,
      background: `purple and blue gradient with lightning bolts, phantom shopping bag silhouettes, electric energy`
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
      costume: `sophisticated pink and purple tactical superhero suit with organized utility pouches and belt, smart shoulder cape, intelligent-looking pink mask with holographic HUD display`,
      pose: `confident superhero stance reviewing holographic strategic plans, professional posture`,
      powers: `holographic shopping lists and tactical plans floating around ${genderPronouns.them}, glowing clipboard shield in hand`,
      background: `pink gradient with geometric patterns, data visualization overlays, strategic grid lines`
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
      costume: `flowing light blue and cyan martial arts inspired superhero suit with zen circle emblem, meditation-style wrapped sash, peaceful blue mask with third eye symbol`,
      pose: `serene meditation pose floating slightly above ground, peaceful and centered`,
      powers: `chi energy swirls and blue aura around ${genderPronouns.them}, shopping items orbiting peacefully like planets`,
      background: `tranquil blue gradient with floating clouds, zen circles, peaceful atmosphere`
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
      costume: `vibrant pink and yellow armored superhero suit with star emblem, rocket boosters on boots, championship belt with medals, aerodynamic pink mask with speed lines`,
      pose: `explosive superhero landing with fist to ground creating shockwave, triumphant victory pose`,
      powers: `speed force lightning crackling around ${genderPronouns.their} entire body, shopping bags transformed into golden victory trophies`,
      background: `dynamic pink-to-yellow gradient with speed lines, comic-style "POW" and "BOOM" effects`
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
      costume: `high-tech teal and purple tactical armor with digital display panels and commander insignia, advanced teal visor mask with targeting system, tech-enhanced gloves with LED lights`,
      pose: `commanding superhero stance with arms directing holographic displays, leadership pose`,
      powers: `holographic tactical displays and data streams flowing from ${genderPronouns.their} fingertips, futuristic technology surrounding ${genderPronouns.them}`,
      background: `sleek teal-purple gradient with digital grid, command center holograms, tech interface`
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
      costume: `stylish pastel blue and pink casual-cool superhero suit with trendy jacket overlay, fashionable mirror sunglasses as superhero mask, designer sneakers`,
      pose: `effortlessly cool superhero lean with arms crossed, relaxed confidence`,
      powers: `chill confidence aura emanating from ${genderPronouns.them}, credit cards floating and spinning like playing cards`,
      background: `soft pastel gradient with dreamy bokeh effects, "YOLO" energy wisps, cool vibes`
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
      costume: `artistic pink superhero suit with paint-splash patterns and color swirls, elegant cape that looks like flowing paint, artist palette shield, creative pink mask with artistic swirl designs, stylish artist beret`,
      pose: `artistic superhero pose presenting curated collection with theatrical gesture, creative flair`,
      powers: `shopping items floating on glowing display pedestals with magical curator light beams, artistic sparkles and paint splashes around ${genderPronouns.them}`,
      background: `vibrant pink gradient with paint splashes, golden picture frames floating, art gallery ambiance`
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
      costume: `structured peach and gold superhero suit with architectural line patterns and blueprint designs, builder cape with construction motif, professional peach mask, architect insignia with compass and ruler symbols`,
      pose: `superhero stance constructing tower of organized shopping items with precision, architectural confidence`,
      powers: `shopping items assembling like building blocks with construction effects, holographic blueprints and architectural plans swirling around ${genderPronouns.them}`,
      background: `warm peach gradient with architectural grid lines, golden construction beams, blueprint patterns`
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
      costume: `cozy golden yellow nature-inspired superhero suit with flower petal patterns and garden motifs, flowing garden-themed cape with leaves, gentle yellow mask with flower crown accessory`,
      pose: `serene meditation pose with one hand holding coffee cup and other hand releasing blooming flowers, peaceful contentment`,
      powers: `nature magic making flowers and plants bloom around shopping items, peaceful golden aura and warm glow surrounding ${genderPronouns.them}`,
      background: `warm golden gradient with soft sunbeams, floating flower petals and butterflies, garden paradise`
    }
  };

  const personaKey = `${cartBehavior}-${paymentStyle}-${shoppingSpeed}`;
  
  return personas[personaKey] || {
    title: '🎭 Unique Shopping Unicorn 🦄',
    superheroName: 'The Legendary One',
    traits: [
      '🛒 One-of-a-kind shopping style',
      '💳 Unique payment philosophy',
      '⚡ Legendary shopping speed'
    ],
    tagline: 'One of a kind shopper extraordinaire!',
    cardColor: { start: '#667eea', end: '#764ba2' },
    costume: `magical rainbow-colored superhero suit with unicorn horn crown and rainbow patterns, sparkling star cape with cosmic designs, mystical rainbow mask with magical gem centerpiece`,
    pose: `majestic superhero pose with arms spread wide releasing rainbow magic, legendary stance`,
    powers: `rainbow magic aura with sparkles and magical stars, shopping bags transformed into magical artifacts and treasures surrounding ${genderPronouns.them}`,
    background: `vibrant rainbow gradient with stars, magical swirls, cosmic energy`
  };
}

async function generateSuperheroWithExactFace(personaData, analysis) {
  try {
    // Create ultra-detailed prompt that emphasizes keeping exact facial features
    const superDetailedPrompt = `Create a 3D Pixar-style superhero character in the quality and style of "The Incredibles" movie.

===== CRITICAL: EXACT FACIAL REPLICATION =====
This character MUST have these EXACT facial features:

${analysis.facialDescription}

YOU MUST REPLICATE EVERY DETAIL ABOVE PRECISELY. This is a real person being transformed into a Pixar superhero - their face, eyes, nose, mouth, hair, skin tone, and all features must be EXACTLY as described. Only the costume is added - the face stays THE SAME.

===== SUPERHERO TRANSFORMATION =====

COSTUME & OUTFIT:
${personaData.costume}

POSE & STANCE:
${personaData.pose}

SUPERPOWERS & EFFECTS:
${personaData.powers}

BACKGROUND & SETTING:
${personaData.background}

===== TECHNICAL SPECIFICATIONS =====
- Professional 3D CGI rendering at Pixar Animation Studios quality level
- Photorealistic skin with subsurface scattering (light should penetrate skin realistically)
- Large, expressive Pixar-style eyes that EXACTLY match the eye color, shape, and size described above
- Hair must be the EXACT color and style described - render each strand with proper lighting
- Skin tone must be PRECISELY the shade described - no generic skin tones
- All facial proportions (nose size, lip fullness, face shape, etc.) must match the description EXACTLY
- Volumetric cinematic lighting with dramatic superhero rim lights
- Rich, vibrant superhero costume colors with movie-quality color grading
- Dynamic superhero composition, character centered and filling 70-80% of frame
- Shallow depth of field with cinematic bokeh background blur
- High-resolution masterpiece quality (1024x1024)
- Studio-quality lighting setup with key light, fill light, and rim light

STYLE REFERENCE: Exactly like Pixar's "The Incredibles" - same 3D rendering techniques, same character modeling approach, same lighting and shader quality, same level of detail and polish.

===== ABSOLUTELY CRITICAL =====
The resulting character should look EXACTLY like the person described in the facial analysis, just rendered in beautiful 3D Pixar animation style wearing a superhero costume. Someone who knows this person should recognize them immediately. The face is NOT changed - only costume is added.

DO NOT:
- Change their face shape
- Change their eye color or shape  
- Change their nose shape
- Change their skin tone
- Change their hair color
- Add any text, logos, or watermarks
- Make them look generic

DO:
- Keep every facial feature exactly as described
- Make them look heroic and confident
- Use Pixar-quality 3D rendering
- Add the superhero costume and effects
- Make the lighting cinematic and dramatic`;

    console.log('Sending detailed prompt to DALL-E 3...');
    console.log('Prompt length:', superDetailedPrompt.length, 'characters');
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: superDetailedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DALL-E Error Response:', errorData);
      throw new Error(`DALL-E API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('DALL-E Response received');
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('No image URL in DALL-E response');
    }

    const imageUrl = data.data[0].url;
    console.log('Successfully generated superhero avatar');
    
    return imageUrl;

  } catch (error) {
    console.error('Superhero generation failed:', error);
    throw error;
  }
}
