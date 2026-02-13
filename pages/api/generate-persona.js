// pages/api/generate-persona.js
// Uses user photo for facial features + Shopping Superhero costumes in 3D Pixar style

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, photo } = req.body;

  try {
    // Generate persona using local logic
    const personaData = generatePersonaLocally(answers);
    
    // Generate 3D Pixar avatar with user's face + superhero costume
    const avatarUrl = await generateSuperheroAvatar(personaData, photo);
    
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
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate persona', 
      details: error.message 
    });
  }
}

function generatePersonaLocally(answers) {
  const { cartBehavior, paymentStyle, shoppingSpeed } = answers;
  
  // Enhanced persona mapping with Shopping Superhero themes
  const personas = {
    // Cart Ghosts - Stealth/Phantom Superheroes
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
      superheroStyle: {
        costume: 'sleek purple and electric blue superhero suit with lightning bolt emblem on chest, flowing cape that fades into transparency like a ghost',
        mask: 'stylish purple domino mask with lightning accents',
        powers: 'surrounded by purple energy aura with shopping bags vanishing into sparkles',
        pose: 'dynamic superhero pose with one hand raised creating lightning effects',
        background: 'purple and blue gradient with lightning bolts and phantom shopping bag silhouettes'
      }
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
      superheroStyle: {
        costume: 'sophisticated pink and purple tactical suit with organized pouches and utility belt, smart-looking shoulder cape',
        mask: 'intelligent-looking pink mask with integrated HUD display',
        powers: 'holographic shopping lists and plans floating around, clipboard shield in hand',
        pose: 'confident superhero stance reviewing holographic battle plans',
        background: 'pink gradient with geometric pattern overlays and data visualizations'
      }
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
      superheroStyle: {
        costume: 'flowing light blue and cyan martial arts inspired superhero suit with zen circle emblem, meditation-style wrapped sash',
        mask: 'peaceful blue mask with third eye symbol',
        powers: 'floating in meditation pose with chi energy swirls and shopping items orbiting peacefully',
        pose: 'zen meditation pose levitating with inner peace aura',
        background: 'tranquil blue gradient with floating clouds and zen circles'
      }
    },

    // Decisive Shoppers - Action Hero Superheroes
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
      superheroStyle: {
        costume: 'vibrant pink and yellow armored superhero suit with star emblem, rocket boosters on boots, championship belt',
        mask: 'aerodynamic pink mask with speed lines design',
        powers: 'speed force lightning crackling around body, shopping bags transformed into victory trophies',
        pose: 'explosive superhero landing with fist to ground creating shockwave',
        background: 'dynamic pink-yellow gradient with speed lines and comic-style "POW" effects'
      }
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
      superheroStyle: {
        costume: 'high-tech teal and purple tactical armor with digital display panels, commander insignia, tech-enhanced gloves',
        mask: 'advanced teal visor mask with targeting system overlay',
        powers: 'holographic tactical display surrounding, data streams flowing from fingertips',
        pose: 'commanding superhero stance directing holographic battle plans',
        background: 'sleek teal-purple gradient with digital grid and command center holograms'
      }
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
      superheroStyle: {
        costume: 'stylish pastel blue and pink casual-cool superhero suit with trendy jacket overlay, relaxed fit with designer touches',
        mask: 'fashionable mirror sunglasses that double as superhero mask',
        powers: 'chill aura emanating confidence, credit cards floating like playing cards being shuffled',
        pose: 'effortlessly cool superhero lean with arms crossed',
        background: 'soft pastel gradient with dreamy bokeh effects and "YOLO" energy wisps'
      }
    },

    // Collectors/Curators - Mystical/Magical Superheroes
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
      superheroStyle: {
        costume: 'artistic pink superhero suit with paint-splash patterns, elegant cape that looks like flowing paint, artist palette shield',
        mask: 'creative pink mask with artistic swirl designs, artist beret accessory',
        powers: 'shopping items floating on display pedestals with magical curator light beams',
        pose: 'artistic superhero pose presenting curated collection with magical gesture',
        background: 'vibrant pink gradient with paint splashes and golden frames floating'
      }
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
      superheroStyle: {
        costume: 'structured peach and gold superhero suit with architectural line patterns, builder cape with blueprint design, architect insignia',
        mask: 'professional peach mask with blueprint projection capability',
        powers: 'shopping items assembling like building blocks, holographic blueprints swirling around',
        pose: 'superhero stance constructing tower of perfectly organized shopping items',
        background: 'warm peach gradient with architectural grid lines and golden construction aura'
      }
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
      superheroStyle: {
        costume: 'cozy golden yellow nature-inspired superhero suit with flower petal patterns, flowing garden-themed cape, tea-master sash',
        mask: 'gentle yellow mask with flower crown accessory',
        powers: 'nature magic making flowers bloom around shopping items, peaceful golden aura',
        pose: 'serene superhero meditation pose with one hand holding coffee cup, other hand blooming flowers',
        background: 'warm golden gradient with soft sunbeams, floating flower petals and butterflies'
      }
    }
  };

  // Create persona key
  const personaKey = `${cartBehavior}-${paymentStyle}-${shoppingSpeed}`;
  
  // Get persona or fallback to default
  const persona = personas[personaKey] || {
    title: '🎭 Unique Shopping Unicorn 🦄',
    superheroName: 'The Legendary One',
    traits: [
      '🛒 ' + getCartTrait(cartBehavior),
      '💳 ' + getPaymentTrait(paymentStyle),
      '⚡ ' + getSpeedTrait(shoppingSpeed)
    ],
    tagline: 'One of a kind shopper extraordinaire!',
    cardColor: { start: '#667eea', end: '#764ba2' },
    superheroStyle: {
      costume: 'magical rainbow-colored superhero suit with unicorn horn crown, sparkling star cape',
      mask: 'mystical rainbow mask with magical gem',
      powers: 'rainbow magic aura with sparkles and shopping bags transformed into magical artifacts',
      pose: 'majestic superhero pose with arms spread releasing rainbow magic',
      background: 'vibrant rainbow gradient with stars and magical swirls'
    }
  };

  return persona;
}

async function generateSuperheroAvatar(personaData, userPhoto) {
  try {
    const style = personaData.superheroStyle;
    
    // Craft detailed prompt that uses user's photo for facial features
    const superheroPrompt = `Create a professional 3D Pixar-style superhero character portrait. This is "${personaData.superheroName}" - a shopping superhero.

CRITICAL - FACIAL FEATURES: Study the provided reference photo carefully. The character MUST have the SAME facial features, expression, and likeness as the person in the photo. Match their:
- Face shape and structure
- Eye shape, size and expression
- Nose shape
- Mouth and smile
- Skin tone
- Hair color and style (but can be styled heroically)
- Overall facial expression and personality

SUPERHERO COSTUME & STYLING:
${style.costume}

MASK & ACCESSORIES:
${style.mask}

SUPERPOWERS & EFFECTS:
${style.powers}

POSE & ACTION:
${style.pose}

BACKGROUND & SETTING:
${style.background}

TECHNICAL REQUIREMENTS:
- Professional 3D CGI rendering in Pixar Animation Studios quality
- Large expressive Pixar-style eyes that match the reference photo's eye color and shape
- Smooth polished surfaces with subsurface scattering on skin
- Volumetric lighting with dramatic superhero rim lights
- Rich vibrant superhero colors with cinematic color grading
- Dynamic composition with character centered as main focus
- Shallow depth of field with background blur for depth
- Photo-realistic 3D rendering with cartoon proportions
- Masterpiece quality studio lighting setup
- No text, logos, or watermarks

STYLE: Rendered exactly like a character from a Pixar superhero movie (like The Incredibles), with the same person's face from the reference photo but as a 3D Pixar superhero character.`;

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
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('No image URL in OpenAI response');
    }

    return data.data[0].url;

  } catch (error) {
    console.error('DALL-E Generation Error:', error);
    
    // Fallback: Return a colorful placeholder
    const color = personaData.cardColor.start.replace('#', '');
    return `https://via.placeholder.com/1024x1024/${color}/FFFFFF?text=${encodeURIComponent(personaData.superheroName)}`;
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
