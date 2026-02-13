// pages/api/generate-persona.js
// Uses OpenAI DALL-E 3 for avatar generation

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, photo } = req.body;

  try {
    // Generate persona using local logic (no Claude API needed)
    const personaData = generatePersonaLocally(answers);
    
    // Generate avatar using OpenAI DALL-E
    const avatarUrl = await generateAvatarWithOpenAI(personaData);
    
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
    return res.status(500).json({ 
      error: 'Failed to generate persona', 
      details: error.message 
    });
  }
}

function generatePersonaLocally(answers) {
  const { cartBehavior, paymentStyle, shoppingSpeed } = answers;
  
  // Persona mapping logic with avatar descriptions
  const personas = {
    // Cart Ghosts
    'ghost-prepaid-lightning': {
      title: '⚡ Lightning Cart Ghost 👻',
      traits: [
        '🛒 Ghosts carts faster than light',
        '💳 Only pays when feeling generous',
        '⚡ In and out like a ninja'
      ],
      tagline: 'If it takes longer than 5 mins, it\'s abandoned',
      cardColor: { start: '#667eea', end: '#764ba2' },
      avatarDescription: 'A playful cartoon character with a mischievous smile, surrounded by fading shopping bags and sparkles, purple and blue color scheme, Disney Pixar 3D animation style, professional studio lighting'
    },
    'ghost-cod-planner': {
      title: '📋 Calculated Cart Ghost 👻',
      traits: [
        '🛒 Plans to ghost the cart the night before',
        '💳 Cash on Delivery for peace of mind',
        '⚡ Slow and steady abandonment'
      ],
      tagline: 'I ghost with intention, not impulse',
      cardColor: { start: '#f093fb', end: '#f5576c' },
      avatarDescription: 'A thoughtful cartoon character holding a planner and checklist, with organized shopping bags floating around, pink and purple gradient background, Disney Pixar 3D animation style'
    },
    'ghost-bnpl-zen': {
      title: '🧘 Zen Cart Ghost 👻',
      traits: [
        '🛒 Takes time to ghost the perfect cart',
        '💳 Buy Now, Ghost Later philosophy',
        '⚡ Mindful abandonment is an art'
      ],
      tagline: 'Ghosting carts is my meditation',
      cardColor: { start: '#4facfe', end: '#00f2fe' },
      avatarDescription: 'A calm and peaceful cartoon character meditating with shopping items floating around in a zen-like atmosphere, blue gradient background, Disney Pixar 3D animation style'
    },

    // Decisive Shoppers
    'decisive-prepaid-lightning': {
      title: '🚀 Rocket Checkout Champion ⚡',
      traits: [
        '🛒 Cart to checkout in 3 seconds flat',
        '💳 Prepaid discount hunter supreme',
        '⚡ Speed shopping is my superpower'
      ],
      tagline: 'I see it, I buy it, I own it',
      cardColor: { start: '#fa709a', end: '#fee140' },
      avatarDescription: 'An energetic cartoon character in a superhero pose with lightning bolts and shopping bags, dynamic action pose, pink and yellow gradient background, Disney Pixar 3D animation style'
    },
    'decisive-cod-planner': {
      title: '📊 Strategic Instant Buyer 💼',
      traits: [
        '🛒 Plans purchases, executes instantly',
        '💳 COD for maximum control',
        '⚡ Calculated but decisive'
      ],
      tagline: 'Plan fast, buy faster',
      cardColor: { start: '#30cfd0', end: '#330867' },
      avatarDescription: 'A professional-looking cartoon character with glasses holding a tablet and credit card, surrounded by organized shopping lists, teal and purple gradient, Disney Pixar 3D animation style'
    },
    'decisive-bnpl-zen': {
      title: '😎 Chill YOLO Spender 🎯',
      traits: [
        '🛒 Decisive when the vibe is right',
        '💳 BNPL because why stress?',
        '⚡ Relaxed but committed'
      ],
      tagline: 'I decide now, pay whenever',
      cardColor: { start: '#a8edea', end: '#fed6e3' },
      avatarDescription: 'A cool and confident cartoon character wearing sunglasses, relaxed pose with shopping bags, pastel blue and pink gradient background, Disney Pixar 3D animation style'
    },

    // Collectors/Curators
    'collector-prepaid-lightning': {
      title: '🎨 Flash Art Curator ⚡',
      traits: [
        '🛒 Curates carts like museum exhibits',
        '💳 Hunts discounts like treasure',
        '⚡ Quick eye for the perfect piece'
      ],
      tagline: 'My cart is a masterpiece in 5 minutes',
      cardColor: { start: '#ff9a9e', end: '#fecfef' },
      avatarDescription: 'An artistic cartoon character with a painter\'s beret, surrounded by colorful shopping items arranged like art pieces, pink gradient background, Disney Pixar 3D animation style'
    },
    'collector-cod-planner': {
      title: '🗂️ Wishlist Architect 📋',
      traits: [
        '🛒 Each item carefully selected',
        '💳 Cash on Delivery, no risks',
        '⚡ Patience is part of the process'
      ],
      tagline: 'Rome wasn\'t built in a day, neither is my cart',
      cardColor: { start: '#ffecd2', end: '#fcb69f' },
      avatarDescription: 'An organized cartoon character with a clipboard and blueprints, carefully arranging shopping items like building blocks, warm peach gradient background, Disney Pixar 3D animation style'
    },
    'collector-bnpl-zen': {
      title: '☕ Slow Glow Collector 🌸',
      traits: [
        '🛒 Curating is a journey, not a race',
        '💳 BNPL for flexible collecting',
        '⚡ Time is just a construct'
      ],
      tagline: 'Good things come to those who browse',
      cardColor: { start: '#ffeaa7', end: '#fdcb6e' },
      avatarDescription: 'A serene cartoon character sipping coffee, surrounded by carefully curated shopping items and flowers, warm yellow gradient background, Disney Pixar 3D animation style'
    }
  };

  // Create persona key
  const personaKey = `${cartBehavior}-${paymentStyle}-${shoppingSpeed}`;
  
  // Get persona or fallback to default
  const persona = personas[personaKey] || {
    title: '🎭 Unique Shopping Unicorn 🦄',
    traits: [
      '🛒 ' + getCartTrait(cartBehavior),
      '💳 ' + getPaymentTrait(paymentStyle),
      '⚡ ' + getSpeedTrait(shoppingSpeed)
    ],
    tagline: 'One of a kind shopper extraordinaire!',
    cardColor: { start: '#667eea', end: '#764ba2' },
    avatarDescription: 'A unique and magical cartoon character with a unicorn horn, surrounded by sparkles and shopping bags, rainbow gradient background, Disney Pixar 3D animation style'
  };

  return persona;
}

async function generateAvatarWithOpenAI(personaData) {
  try {
    // Create the prompt for DALL-E
    const prompt = `Create a vibrant 3D cartoon avatar in Disney Pixar animation style. ${personaData.avatarDescription}. The character should be cute, expressive, and professional quality with smooth rendering, bright colors, and studio lighting. Square composition, centered character portrait.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',  // Use DALL-E 3 for best quality
        prompt: prompt,
        n: 1,
        size: '1024x1024',  // Square format, good quality
        quality: 'standard', // 'standard' or 'hd' (hd costs more)
        style: 'vivid'       // 'vivid' for more hyper-real, 'natural' for more subtle
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('No image URL in OpenAI response');
    }

    // Return the generated image URL
    return data.data[0].url;

  } catch (error) {
    console.error('OpenAI DALL-E Error:', error);
    
    // Fallback: Return a placeholder image if generation fails
    return 'https://via.placeholder.com/1024x1024/E91E63/FFFFFF?text=Avatar';
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
