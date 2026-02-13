// pages/api/generate-persona.js
// FIXED VERSION - Properly generates and returns AI superhero avatars

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, photo } = req.body;

  try {
    // Generate persona using local logic
    const personaData = generatePersonaLocally(answers);
    
    // CRITICAL: Actually generate the avatar image with DALL-E
    const avatarUrl = await generateSuperheroAvatar(personaData, photo);
    
    // Log for debugging
    console.log('Generated avatar URL:', avatarUrl);
    
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
      superheroStyle: 'A confident woman in a sleek purple and electric blue superhero suit with a lightning bolt emblem on the chest, wearing a stylish purple domino mask, flowing translucent cape, surrounded by purple energy aura with shopping bags vanishing into sparkles, dynamic superhero pose with one hand raised creating lightning effects, purple and blue gradient background with lightning bolts'
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
      superheroStyle: 'A thoughtful woman in a sophisticated pink and purple tactical superhero suit with organized utility pouches and belt, wearing an intelligent-looking pink mask with HUD display, smart shoulder cape, surrounded by holographic shopping lists and plans, confident superhero stance reviewing holographic battle plans, pink gradient background with geometric patterns'
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
      superheroStyle: 'A serene woman in a flowing light blue and cyan martial arts inspired superhero suit with zen circle emblem, wearing a peaceful blue mask with third eye symbol, meditation-style wrapped sash, floating in meditation pose with chi energy swirls and shopping items orbiting peacefully, tranquil blue gradient background with floating clouds and zen circles'
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
      superheroStyle: 'A powerful woman in vibrant pink and yellow armored superhero suit with star emblem, rocket boosters on boots, championship belt, wearing an aerodynamic pink mask, speed force lightning crackling around body, shopping bags transformed into victory trophies, explosive superhero landing pose with fist to ground creating shockwave, dynamic pink-yellow gradient background with speed lines and comic-style action effects'
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
      superheroStyle: 'A professional woman in high-tech teal and purple tactical armor with digital display panels and commander insignia, wearing an advanced teal visor mask with targeting system, tech-enhanced gloves, surrounded by holographic tactical displays and data streams flowing from fingertips, commanding superhero stance directing holographic battle plans, sleek teal-purple gradient background with digital grid'
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
      superheroStyle: 'A cool woman in a stylish pastel blue and pink casual-cool superhero suit with trendy jacket overlay, wearing fashionable mirror sunglasses as superhero mask, chill aura emanating confidence, credit cards floating like playing cards, effortlessly cool superhero lean with arms crossed, soft pastel gradient background with dreamy bokeh effects'
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
      superheroStyle: 'An artistic woman in a pink superhero suit with paint-splash patterns, elegant cape that looks like flowing paint, artist palette shield, wearing a creative pink mask with artistic swirl designs and artist beret, shopping items floating on display pedestals with magical curator light beams, artistic superhero pose presenting curated collection, vibrant pink gradient background with paint splashes and golden frames'
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
      superheroStyle: 'A meticulous woman in a structured peach and gold superhero suit with architectural line patterns, builder cape with blueprint design and architect insignia, wearing a professional peach mask, shopping items assembling like building blocks with holographic blueprints swirling around, superhero stance constructing tower of organized items, warm peach gradient background with architectural grid lines'
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
      superheroStyle: 'A serene woman in a cozy golden yellow nature-inspired superhero suit with flower petal patterns, flowing garden-themed cape and tea-master sash, wearing a gentle yellow mask with flower crown, nature magic making flowers bloom around shopping items with peaceful golden aura, meditation pose with one hand holding coffee cup and other hand blooming flowers, warm golden gradient background with soft sunbeams and floating petals'
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
    superheroStyle: 'A magical woman in a rainbow-colored superhero suit with unicorn horn crown, sparkling star cape, wearing a mystical rainbow mask with magical gem, rainbow magic aura with sparkles and shopping bags transformed into magical artifacts, majestic superhero pose with arms spread releasing rainbow magic, vibrant rainbow gradient background with stars and magical swirls'
  };

  return persona;
}

async function generateSuperheroAvatar(personaData, userPhoto) {
  try {
    // Comprehensive superhero prompt
    const superheroPrompt = `Create a professional 3D character in modern animation style similar to Pixar or Disney movies.

CHARACTER DESCRIPTION: ${personaData.superheroStyle}

TECHNICAL SPECIFICATIONS:
- High-quality 3D CGI rendering with smooth, polished surfaces
- Professional animation quality like Pixar's The Incredibles
- Large expressive eyes with detailed reflections
- Volumetric lighting with dramatic rim lights for depth
- Rich, vibrant colors with cinematic color grading
- Subsurface scattering on skin for realistic look
- Clean, crisp rendering at high resolution
- Centered portrait composition, character filling 70% of frame
- Shallow depth of field with bokeh background blur
- Masterpiece quality studio lighting setup

STYLE: Photo-realistic 3D CGI with stylized proportions, exactly like a character from a Pixar superhero movie. Professional animation studio quality.

IMPORTANT: No text, logos, watermarks, or words anywhere in the image.`;

    console.log('Calling OpenAI DALL-E 3...');
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: superheroPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error Response:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('OpenAI Response:', JSON.stringify(data, null, 2));
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('No data array in OpenAI response');
    }
    
    if (!data.data[0].url) {
      throw new Error('No image URL in OpenAI response');
    }

    const imageUrl = data.data[0].url;
    console.log('Successfully generated image:', imageUrl);
    
    return imageUrl;

  } catch (error) {
    console.error('DALL-E Generation Error:', error);
    console.error('Error details:', error.message);
    
    // Return a placeholder only if image generation fails
    throw error; // Re-throw to let the handler catch it
  }
}

function getCartTrait(behavior) {
  const traits = {
    ghost: 'Professional cart abandoner',
    decisive: 'Instant decision maker',
    collector: 'Wishlist curator supreme'
  };
  return traits[behavior] || 'Mystery shopper';
}

function getPaymentTrait(style) {
  const traits = {
    prepaid: 'Discount hunter extraordinaire',
    cod: 'Cash is king believer',
    bnpl: 'Future-focused spender'
  };
  return traits[style] || 'Payment philosopher';
}

function getSpeedTrait(speed) {
  const traits = {
    lightning: 'Lightning speed champion',
    planner: 'Strategic planning master',
    zen: 'Zen shopping guru'
  };
  return traits[speed] || 'Time traveler';
}
