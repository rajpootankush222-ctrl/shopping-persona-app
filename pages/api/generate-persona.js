// pages/api/generate-persona.js
// Optimized for 3D Pixar-style character generation with DALL-E 3

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, photo } = req.body;

  try {
    // Generate persona using local logic
    const personaData = generatePersonaLocally(answers);
    
    // Generate 3D Pixar-style avatar using OpenAI DALL-E
    const avatarUrl = await generatePixarAvatar(personaData);
    
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
  
  // Enhanced persona mapping with detailed 3D Pixar character descriptions
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
      pixarDescription: {
        character: 'A young, energetic woman with expressive eyes and a playful, mischievous smile',
        clothing: 'wearing a trendy purple hoodie with lightning bolt patterns',
        props: 'surrounded by floating, semi-transparent shopping bags that are fading away like ghosts',
        setting: 'purple and electric blue gradient background with sparkles and small lightning bolts',
        mood: 'playful, energetic, slightly mischievous',
        pose: 'dynamic pose, one hand reaching out playfully as if about to disappear'
      }
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
      pixarDescription: {
        character: 'A thoughtful young woman with glasses and an intelligent, knowing expression',
        clothing: 'wearing a cozy pink cardigan and holding a small notebook',
        props: 'floating planner pages and organized shopping lists around her, with some items crossed out',
        setting: 'soft pink gradient background with geometric patterns',
        mood: 'calm, strategic, organized',
        pose: 'sitting cross-legged with a planner, looking satisfied and contemplative'
      }
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
      pixarDescription: {
        character: 'A serene woman with peaceful closed eyes and a gentle smile, radiating calmness',
        clothing: 'wearing a flowing light blue yoga outfit',
        props: 'in meditation pose with shopping items floating peacefully around her like chakras',
        setting: 'tranquil blue gradient background with soft clouds and zen circles',
        mood: 'peaceful, zen-like, completely relaxed',
        pose: 'lotus meditation position, floating slightly above ground'
      }
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
      pixarDescription: {
        character: 'A confident woman with determined eyes and a victorious superhero smile',
        clothing: 'wearing a vibrant pink and yellow athletic outfit with star patterns',
        props: 'holding shopping bags like trophies, with lightning bolts and speed lines around her',
        setting: 'dynamic pink-to-yellow gradient background with comic-style action effects',
        mood: 'powerful, confident, triumphant',
        pose: 'superhero landing pose with one fist raised victoriously'
      }
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
      pixarDescription: {
        character: 'A professional-looking woman with stylish glasses and a confident, smart expression',
        clothing: 'wearing a chic teal blazer and holding a tablet showing graphs',
        props: 'surrounded by holographic shopping data, checkmarks, and organized lists',
        setting: 'sleek teal-to-purple gradient background with digital elements',
        mood: 'professional, decisive, intelligent',
        pose: 'standing confidently with one hand on hip, other holding tablet'
      }
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
      pixarDescription: {
        character: 'A cool, laid-back woman with trendy sunglasses and a carefree smile',
        clothing: 'wearing a stylish pastel outfit with relaxed fit',
        props: 'casually holding shopping bags, with floating credit cards and "YOLO" text effects',
        setting: 'soft pastel gradient background with dreamy, chill vibes',
        mood: 'relaxed, cool, carefree',
        pose: 'leaning casually with one hand in pocket, looking effortlessly cool'
      }
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
      pixarDescription: {
        character: 'An artistic woman with a creative sparkle in her eyes and an excited expression',
        clothing: 'wearing a cute pink beret and a stylish artist smock',
        props: 'surrounded by shopping items arranged like art pieces on floating pedestals',
        setting: 'vibrant pink gradient background with artistic paint splashes and frames',
        mood: 'creative, excited, artistic',
        pose: 'gesturing enthusiastically toward her curated collection'
      }
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
      pixarDescription: {
        character: 'A meticulous woman with focused eyes and a satisfied smile',
        clothing: 'wearing a professional peach-colored outfit with organized pockets',
        props: 'holding blueprints of shopping plans, with items stacked like building blocks',
        setting: 'warm peach gradient background with architectural grid lines',
        mood: 'organized, satisfied, methodical',
        pose: 'reviewing her perfectly organized wishlist with pride'
      }
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
      pixarDescription: {
        character: 'A serene woman with gentle eyes and a warm, content smile',
        clothing: 'wearing a cozy yellow sweater, holding a cup of coffee',
        props: 'surrounded by carefully selected items and blooming flowers',
        setting: 'warm golden gradient background with soft sunbeams and petals',
        mood: 'peaceful, content, unhurried',
        pose: 'sitting comfortably, sipping coffee while admiring her collection'
      }
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
    pixarDescription: {
      character: 'A magical woman with sparkling eyes and a joyful, unique expression',
      clothing: 'wearing a rainbow-colored outfit with unicorn horn accessory',
      props: 'surrounded by magical sparkles and floating shopping items',
      setting: 'colorful rainbow gradient background with stars and magic effects',
      mood: 'magical, joyful, one-of-a-kind',
      pose: 'twirling happily with shopping bags transformed into magical accessories'
    }
  };

  return persona;
}

async function generatePixarAvatar(personaData) {
  try {
    const desc = personaData.pixarDescription;
    
    // Craft the perfect 3D Pixar prompt
    const pixarPrompt = `A high-quality 3D rendered character portrait in the style of Pixar Animation Studios. 

CHARACTER: ${desc.character}
OUTFIT: ${desc.clothing}
PROPS & ELEMENTS: ${desc.props}
BACKGROUND: ${desc.setting}
EXPRESSION & MOOD: ${desc.mood}
POSE: ${desc.pose}

STYLE REQUIREMENTS:
- Professional 3D CGI rendering with Pixar-quality details
- Smooth, polished surfaces with subsurface scattering on skin
- Large expressive eyes with detailed reflections and catchlights
- Soft, volumetric lighting with rim lights for depth
- Rich, vibrant colors with proper color grading
- Clean, crisp rendering at high resolution
- Centered portrait composition, character filling most of frame
- Shallow depth of field with bokeh background blur
- No text, logos, or watermarks

TECHNICAL: Rendered as if from a Pixar movie, photo-realistic 3D CGI with cartoon proportions, masterpiece quality, studio lighting setup.`;

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
        quality: 'hd',      // Use HD quality for best Pixar results
        style: 'vivid'      // Vivid for rich, vibrant colors
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
    return `https://via.placeholder.com/1024x1024/${color}/FFFFFF?text=Shopping+Persona`;
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
