// pages/index.js
import React, { useState, useRef } from 'react';

export default function ShoppingPersonaGenerator() {
  const [step, setStep] = useState('quiz');
  const [formData, setFormData] = useState({
    cartBehavior: '',
    paymentStyle: '',
    shoppingSpeed: '',
    photo: null
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const questions = [
    {
      id: 'cartBehavior',
      question: '🛒 What\'s your shopping cart vibe?',
      options: [
        { value: 'ghost', label: '👻 I ghost my cart like bad dates', emoji: '💔' },
        { value: 'decisive', label: '⚡ Add to cart = instant checkout', emoji: '🚀' },
        { value: 'collector', label: '🗂️ I curate carts like art galleries', emoji: '🎨' }
      ]
    },
    {
      id: 'paymentStyle',
      question: '💳 How do you pay?',
      options: [
        { value: 'prepaid', label: '💰 Prepaid = Discounts baby!', emoji: '🤑' },
        { value: 'cod', label: '📦 Cash on Delivery or nothing', emoji: '🏠' },
        { value: 'bnpl', label: '⏰ Buy Now, Pay Later (YOLO)', emoji: '😎' }
      ]
    },
    {
      id: 'shoppingSpeed',
      question: '⏱️ Your shopping speed is...',
      options: [
        { value: 'lightning', label: '⚡ In and out in 5 minutes', emoji: '💨' },
        { value: 'planner', label: '📋 I plan everything the night before', emoji: '🌙' },
        { value: 'zen', label: '🧘 I take my sweet time, no rush', emoji: '☕' }
      ]
    }
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, photo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!formData.cartBehavior || !formData.paymentStyle || !formData.shoppingSpeed) {
      setError('Please answer all questions!');
      return;
    }
    if (!formData.photo) {
      setError('Please upload your photo!');
      return;
    }

    setError('');
    setLoading(true);
    setStep('generating');

    try {
      const response = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: {
            cartBehavior: formData.cartBehavior,
            paymentStyle: formData.paymentStyle,
            shoppingSpeed: formData.shoppingSpeed
          },
          photo: formData.photo
        })
      });

      if (!response.ok) throw new Error('Failed to generate persona');

      const data = await response.json();
      setResult(data);
      setStep('result');
      
      setTimeout(() => generateIDCard(data), 500);
    } catch (err) {
      setError('Something went wrong. Please try again!');
      setStep('quiz');
    } finally {
      setLoading(false);
    }
  };

  const generateIDCard = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, data.cardColor.start);
    gradient.addColorStop(1, data.cardColor.end);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎭 OFFICIAL SHOPPING PERSONA ID 🎭', width / 2, 60);

    ctx.font = 'bold 42px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(data.personaTitle, width / 2, 120);

    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    avatarImg.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(150, 250, 100, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImg, 50, 150, 200, 200);
      ctx.restore();

      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(150, 250, 100, 0, Math.PI * 2);
      ctx.stroke();
    };
    avatarImg.src = data.avatarUrl;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    
    const details = [data.trait1, data.trait2, data.trait3];
    details.forEach((detail, i) => {
      ctx.fillText(detail, 300, 200 + (i * 40));
    });

    ctx.fillStyle = '#FFD700';
    ctx.font = 'italic 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`"${data.tagline}"`, width / 2, height - 50);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`ID: ${Date.now().toString(36).toUpperCase()}`, width - 40, height - 30);
  };

  const downloadCard = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${result.personaTitle.replace(/\s/g, '-')}-ID.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (step === 'quiz') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🎪 Discover Your Shopping Persona!</h1>
          <p style={styles.subtitle}>Answer 3 quick questions & upload your photo</p>

          {error && <div style={styles.error}>{error}</div>}

          {questions.map((q) => (
            <div key={q.id} style={styles.questionBlock}>
              <h3 style={styles.questionText}>{q.question}</h3>
              <div style={styles.optionsGrid}>
                {q.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, [q.id]: option.value })}
                    style={{
                      ...styles.optionButton,
                      ...(formData[q.id] === option.value ? styles.optionButtonSelected : {})
                    }}
                  >
                    <span style={styles.optionEmoji}>{option.emoji}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={styles.uploadSection}>
            <h3 style={styles.questionText}>📸 Upload Your Photo</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              style={styles.uploadButton}
            >
              {formData.photo ? '✅ Photo Uploaded!' : '📷 Choose Photo'}
            </button>
            {formData.photo && (
              <img src={formData.photo} alt="Preview" style={styles.photoPreview} />
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={styles.generateButton}
          >
            {loading ? '✨ Creating Your Persona...' : '🎨 Generate My Shopping ID!'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loader}>
            <div style={styles.spinnerContainer}>
              <div style={styles.spinner}></div>
            </div>
            <h2 style={styles.loadingText}>✨ Creating Your Persona...</h2>
            <p style={styles.loadingSubtext}>Analyzing your shopping DNA 🧬</p>
            <p style={styles.loadingSubtext}>Generating your Disney-style avatar 🎨</p>
            <p style={styles.loadingSubtext}>Designing your exclusive ID card 🎭</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.resultCard}>
        <h1 style={styles.resultTitle}>🎉 Meet Your Shopping Persona!</h1>
        
        <canvas ref={canvasRef} style={styles.canvas}></canvas>

        <div style={styles.buttonGroup}>
          <button onClick={downloadCard} style={styles.downloadButton}>
            📥 Download My ID Card
          </button>
          <button onClick={() => setStep('quiz')} style={styles.retryButton}>
            🔄 Create Another One
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  title: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px'
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  questionBlock: {
    marginBottom: '30px'
  },
  questionText: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#333'
  },
  optionsGrid: {
    display: 'grid',
    gap: '10px'
  },
  optionButton: {
    background: '#f5f5f5',
    border: '2px solid #ddd',
    borderRadius: '12px',
    padding: '15px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  optionButtonSelected: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderColor: '#667eea',
    transform: 'scale(1.02)'
  },
  optionEmoji: {
    fontSize: '24px'
  },
  uploadSection: {
    marginTop: '30px',
    textAlign: 'center'
  },
  uploadButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  photoPreview: {
    marginTop: '15px',
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '12px',
    objectFit: 'cover'
  },
  generateButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '30px',
    transition: 'all 0.3s'
  },
  loader: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '6px solid #f3f3f3',
    borderTop: '6px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#667eea'
  },
  loadingSubtext: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '10px'
  },
  resultCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '900px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  resultTitle: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  canvas: {
    width: '100%',
    maxWidth: '800px',
    border: '3px solid #667eea',
    borderRadius: '15px',
    display: 'block',
    margin: '0 auto 30px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '30px'
  },
  downloadButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  retryButton: {
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '12px',
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};
