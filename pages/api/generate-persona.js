// pages/api/generate-persona.js
// 100% FREE VERSION - No paid APIs needed!

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, photo } = req.body;

  try {
    // Generate persona using local logic (no Claude API)
    const personaData = generatePersonaLocally(answers);
    
    // Use the user's photo directly (no AI generation)
    const avatarUrl = photo; // Just use their uploaded photo
    
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

function generatePersonaLocally(answers) {
  const { cartBehavior, paymentStyle, shoppingSpeed } = answers;
  
  // Persona mapping logic
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
      cardColor: { start: '#667eea', end: '#764ba2' }
    },
    'ghost-cod-planner': {
      title: '📋 Calculated Cart Ghost 👻',
      traits: [
        '🛒 Plans to ghost the cart the night before',
        '💳 Cash on Delivery for peace of mind',
        '⚡ Slow and steady abandonment'
      ],
      tagline: 'I ghost with intention, not impulse',
      cardColor: { start: '#f093fb', end: '#f5576c' }
    },
    'ghost-bnpl-zen': {
      title: '🧘 Zen Cart Ghost 👻',
      traits: [
        '🛒 Takes time to ghost the perfect cart',
        '💳 Buy Now, Ghost Later philosophy',
        '⚡ Mindful abandonment is an art'
      ],
      tagline: 'Ghosting carts is my meditation',
      cardColor: { start: '#4facfe', end: '#00f2fe' }
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
      cardColor: { start: '#fa709a', end: '#fee140' }
    },
    'decisive-cod-planner': {
      title: '📊 Strategic Instant Buyer 💼',
      traits: [
        '🛒 Plans purchases, executes instantly',
        '💳 COD for maximum control',
        '⚡ Calculated but decisive'
      ],
      tagline: 'Plan fast, buy faster',
      cardColor: { start: '#30cfd0', end: '#330867' }
    },
    'decisive-bnpl-zen': {
      title: '😎 Chill YOLO Spender 🎯',
      traits: [
        '🛒 Decisive when the vibe is right',
        '💳 BNPL because why stress?',
        '⚡ Relaxed but committed'
      ],
      tagline: 'I decide now, pay whenever',
      cardColor: { start: '#a8edea', end: '#fed6e3' }
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
      cardColor: { start: '#ff9a9e', end: '#fecfef' }
    },
    'collector-cod-planner': {
      title: '🗂️ Wishlist Architect 📋',
      traits: [
        '🛒 Each item carefully selected',
        '💳 Cash on Delivery, no risks',
        '⚡ Patience is part of the process'
      ],
      tagline: 'Rome wasn\'t built in a day, neither is my cart',
      cardColor: { start: '#ffecd2', end: '#fcb69f' }
    },
    'collector-bnpl-zen': {
      title: '☕ Slow Glow Collector 🌸',
      traits: [
        '🛒 Curating is a journey, not a race',
        '💳 BNPL for flexible collecting',
        '⚡ Time is just a construct'
      ],
      tagline: 'Good things come to those who browse',
      cardColor: { start: '#ffeaa7', end: '#fdcb6e' }
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
    cardColor: { start: '#667eea', end: '#764ba2' }
  };

  return persona;
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
