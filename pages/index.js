// pages/index.js
// WomanCart Shopping Superhero Generator - Photo-based facial features + Pixar superhero costumes

import React, { useState, useRef } from 'react';

export default function WomanCartSuperheroGenerator() {
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
      question: 'What\'s your shopping cart personality?',
      options: [
        { value: 'ghost', label: 'I save items but rarely checkout', emoji: '👻', color: '#E91E63' },
        { value: 'decisive', label: 'I see it, I love it, I buy it!', emoji: '⚡', color: '#FC5185' },
        { value: 'collector', label: 'I carefully curate my wishlist', emoji: '💎', color: '#FF6B9D' }
      ]
    },
    {
      id: 'paymentStyle',
      question: 'How do you prefer to pay?',
      options: [
        { value: 'prepaid', label: 'Online payment for instant discounts', emoji: '💳', color: '#E91E63' },
        { value: 'cod', label: 'Cash on Delivery for peace of mind', emoji: '💰', color: '#FC5185' },
        { value: 'bnpl', label: 'Buy Now, Pay Later flexibility', emoji: '⏰', color: '#FF6B9D' }
      ]
    },
    {
      id: 'shoppingSpeed',
      question: 'Your shopping style is...',
      options: [
        { value: 'lightning', label: 'Quick & efficient shopper', emoji: '🚀', color: '#E91E63' },
        { value: 'planner', label: 'Thoughtful & organized planner', emoji: '📋', color: '#FC5185' },
        { value: 'zen', label: 'Relaxed & mindful browser', emoji: '🌸', color: '#FF6B9D' }
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
      setError('Please answer all questions to discover your superhero persona!');
      return;
    }
    if (!formData.photo) {
      setError('Please upload your photo to create your personalized superhero avatar!');
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
      setError('Oops! Something went wrong. Please try again.');
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
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ WOMANCART SHOPPING SUPERHERO ⚡', width / 2, 55);

    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(data.personaTitle, width / 2, 100);

    // Superhero name
    ctx.font = 'italic 18px Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`"${data.superheroName}"`, width / 2, 125);

    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    avatarImg.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(150, 260, 100, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImg, 50, 160, 200, 200);
      ctx.restore();

      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(150, 260, 100, 0, Math.PI * 2);
      ctx.stroke();
    };
    avatarImg.onerror = () => {
      ctx.fillStyle = '#FFD700';
      ctx.font = '60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🦸', 150, 270);
    };
    avatarImg.src = data.avatarUrl;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '17px Arial, sans-serif';
    ctx.textAlign = 'left';
    
    const details = [data.trait1, data.trait2, data.trait3];
    details.forEach((detail, i) => {
      ctx.fillText(detail, 300, 205 + (i * 32));
    });

    ctx.fillStyle = '#FFD700';
    ctx.font = 'italic 15px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`"${data.tagline}"`, width / 2, height - 50);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`HERO-ID: WC-${Date.now().toString(36).toUpperCase()}`, width - 40, height - 30);
  };

  const downloadCard = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `WomanCart-${result.superheroName.replace(/\s/g, '-')}-Superhero.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (step === 'quiz') {
    return (
      <>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap');
          
          body { margin: 0; padding: 0; font-family: 'Lato', sans-serif; }
          
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
        
        <div style={styles.container}>
          <header style={styles.header}>
            <div style={styles.headerContent}>
              <div style={styles.logo}>
                <span style={styles.logoText}>WomanCart</span>
              </div>
              <nav style={styles.nav}>
                <a href="#" style={styles.navLink}>Categories</a>
                <a href="#" style={styles.navLink}>Brands</a>
                <a href="#" style={styles.navLink}>New Launches</a>
                <a href="#" style={styles.navLink}>Sale</a>
              </nav>
            </div>
          </header>

          <div style={styles.promoBanner}>
            <div style={styles.promoContent}>
              <span style={styles.promoIcon}>🦸‍♀️</span>
              <span style={styles.promoText}>Transform Into Your Shopping Superhero! AI-Powered 3D Pixar Avatar with YOUR Face!</span>
              <span style={styles.promoIcon}>🦸‍♀️</span>
            </div>
          </div>

          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>Become a Shopping Superhero</h1>
            <p style={styles.heroSubtitle}>Upload your photo & discover your superhero alter-ego in stunning 3D Pixar style!</p>
          </div>

          <div style={styles.mainContent}>
            <div style={styles.quizCard}>
              {error && (
                <div style={styles.errorBanner}>
                  <span style={styles.errorIcon}>⚠️</span>
                  {error}
                </div>
              )}

              {questions.map((q, qIndex) => (
                <div key={q.id} style={{
                  ...styles.questionBlock,
                  animation: `slideInUp 0.6s ease-out ${qIndex * 0.1}s backwards`
                }}>
                  <h3 style={styles.questionTitle}>{q.question}</h3>
                  <div style={styles.optionsGrid}>
                    {q.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFormData({ ...formData, [q.id]: option.value })}
                        style={{
                          ...styles.optionCard,
                          ...(formData[q.id] === option.value ? {
                            ...styles.optionCardSelected,
                            borderColor: option.color,
                            background: `linear-gradient(135deg, ${option.color}15, ${option.color}05)`
                          } : {})
                        }}
                      >
                        <span style={styles.optionEmoji}>{option.emoji}</span>
                        <span style={styles.optionLabel}>{option.label}</span>
                        {formData[q.id] === option.value && (
                          <span style={{...styles.checkmark, backgroundColor: option.color}}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Photo Upload Section */}
              <div style={styles.uploadSection}>
                <h3 style={styles.questionTitle}>📸 Upload Your Photo</h3>
                <p style={styles.uploadSubtext}>We'll transform YOU into a 3D Pixar superhero with your facial features!</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                
                <div style={styles.uploadArea}>
                  {!formData.photo ? (
                    <button
                      onClick={() => fileInputRef.current.click()}
                      style={styles.uploadButton}
                    >
                      <span style={styles.uploadIcon}>📷</span>
                      <span>Choose Your Photo</span>
                    </button>
                  ) : (
                    <div style={styles.photoPreviewContainer}>
                      <img src={formData.photo} alt="Preview" style={styles.photoPreview} />
                      <button
                        onClick={() => fileInputRef.current.click()}
                        style={styles.changePhotoButton}
                      >
                        Change Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.infoBox}>
                <span style={styles.infoIcon}>🦸‍♀️</span>
                <div>
                  <p style={styles.infoText}>
                    <strong>Your Personal Shopping Superhero:</strong>
                  </p>
                  <p style={styles.infoText}>
                    • Uses YOUR facial features and expression<br/>
                    • Dressed in a custom superhero costume<br/>
                    • Professional 3D Pixar animation quality<br/>
                    • Unique powers based on your shopping style
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                style={styles.generateButton}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Creating Your Superhero Avatar...
                  </>
                ) : (
                  <>
                    <span style={styles.buttonIcon}>⚡</span>
                    Transform Into a Shopping Superhero!
                    <span style={styles.buttonIcon}>⚡</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <footer style={styles.footer}>
            <p style={styles.footerText}>© 2024 WomanCart. All rights reserved.</p>
          </footer>
        </div>
      </>
    );
  }

  if (step === 'generating') {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingAnimation}>
            <div style={styles.loadingCircle}></div>
            <div style={{...styles.loadingCircle, animationDelay: '0.15s'}}></div>
            <div style={{...styles.loadingCircle, animationDelay: '0.3s'}}></div>
          </div>
          <h2 style={styles.loadingTitle}>Transforming You Into a Superhero...</h2>
          <p style={styles.loadingText}>🎭 Analyzing your facial features</p>
          <p style={styles.loadingText}>🦸‍♀️ Designing your superhero costume</p>
          <p style={styles.loadingText}>⚡ Adding your superpowers</p>
          <p style={styles.loadingText}>🎬 Rendering in 3D Pixar quality</p>
          <p style={styles.loadingText}>💫 Finalizing your hero ID card</p>
          <p style={styles.loadingSubtext}>(Creating amazing results... 15-20 seconds)</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoText}>WomanCart</span>
          </div>
        </div>
      </header>

      <div style={styles.resultContainer}>
        <div style={styles.resultCard}>
          <h1 style={styles.resultTitle}>Your Shopping Superhero Revealed! 🦸‍♀️</h1>
          <p style={styles.resultSubtitle}>Meet "{result?.superheroName}" - Your AI-Generated 3D Pixar Alter-Ego!</p>
          
          <canvas ref={canvasRef} style={styles.canvas}></canvas>

          <div style={styles.actionButtons}>
            <button onClick={downloadCard} style={styles.downloadButton}>
              📥 Download Superhero ID Card
            </button>
            <button onClick={() => {
              setStep('quiz');
              setFormData({cartBehavior: '', paymentStyle: '', shoppingSpeed: '', photo: null});
            }} style={styles.retryButton}>
              🔄 Create Another Superhero
            </button>
          </div>

          <div style={styles.shareSection}>
            <p style={styles.shareTitle}>Show off your shopping superhero to the world!</p>
            <div style={styles.shareButtons}>
              <button style={styles.shareButton}>📸 Instagram Story</button>
              <button style={styles.shareButton}>👍 Facebook</button>
              <button style={styles.shareButton}>💬 WhatsApp</button>
              <button style={styles.shareButton}>🐦 Twitter</button>
            </div>
          </div>

          <div style={styles.aiNotice}>
            <p style={styles.aiNoticeText}>
              ⚡ Your superhero was created using AI (DALL-E 3) with your facial features transformed into professional 3D Pixar-style superhero character
            </p>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 WomanCart. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Lato', sans-serif" },
  header: { background: '#FFFFFF', borderBottom: '1px solid #E0E0E0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center' },
  logoText: { fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(135deg, #E91E63, #FC5185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Playfair Display', serif" },
  nav: { display: 'flex', gap: '30px' },
  navLink: { color: '#333', textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  promoBanner: { background: 'linear-gradient(135deg, #E91E63, #FC5185)', padding: '12px 20px', textAlign: 'center' },
  promoContent: { color: 'white', fontSize: '14px', fontWeight: '500', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  promoIcon: { fontSize: '20px' },
  promoText: { letterSpacing: '0.5px' },
  hero: { background: 'linear-gradient(135deg, #FFF0F5, #FFE5EC)', padding: '60px 20px', textAlign: 'center' },
  heroTitle: { fontSize: '48px', fontWeight: '700', color: '#E91E63', marginBottom: '15px', fontFamily: "'Playfair Display', serif" },
  heroSubtitle: { fontSize: '18px', color: '#666', maxWidth: '700px', margin: '0 auto' },
  mainContent: { maxWidth: '900px', margin: '40px auto', padding: '0 20px' },
  quizCard: { background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  errorBanner: { background: '#FFF3E0', border: '2px solid #FF9800', borderRadius: '12px', padding: '15px 20px', marginBottom: '30px', color: '#E65100', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' },
  errorIcon: { fontSize: '20px' },
  questionBlock: { marginBottom: '40px' },
  questionTitle: { fontSize: '22px', fontWeight: '600', color: '#333', marginBottom: '20px', fontFamily: "'Playfair Display', serif" },
  optionsGrid: { display: 'grid', gap: '15px' },
  optionCard: { background: 'white', border: '2px solid #E0E0E0', borderRadius: '12px', padding: '20px 24px', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '15px', position: 'relative', fontSize: '16px' },
  optionCardSelected: { borderWidth: '2px', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(233, 30, 99, 0.15)' },
  optionEmoji: { fontSize: '28px' },
  optionLabel: { flex: 1, color: '#333', fontWeight: '500' },
  checkmark: { width: '24px', height: '24px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' },
  uploadSection: { marginTop: '40px', textAlign: 'center' },
  uploadSubtext: { color: '#666', fontSize: '14px', marginTop: '8px', marginBottom: '20px' },
  uploadArea: { border: '2px dashed #E0E0E0', borderRadius: '12px', padding: '40px', background: '#FAFAFA' },
  uploadButton: { background: 'linear-gradient(135deg, #E91E63, #FC5185)', color: 'white', border: 'none', borderRadius: '30px', padding: '16px 40px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' },
  uploadIcon: { fontSize: '24px' },
  photoPreviewContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  photoPreview: { maxWidth: '200px', maxHeight: '200px', borderRadius: '12px', objectFit: 'cover', border: '3px solid #E91E63' },
  changePhotoButton: { background: 'white', color: '#E91E63', border: '2px solid #E91E63', borderRadius: '20px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  infoBox: { background: 'linear-gradient(135deg, #E91E6310, #FC518510)', border: '2px solid #E91E63', borderRadius: '12px', padding: '20px', marginTop: '30px', display: 'flex', gap: '15px', alignItems: 'flex-start' },
  infoIcon: { fontSize: '32px', flexShrink: 0 },
  infoText: { color: '#333', fontSize: '14px', lineHeight: '1.6', margin: '5px 0' },
  generateButton: { width: '100%', background: 'linear-gradient(135deg, #E91E63, #FC5185)', color: 'white', border: 'none', borderRadius: '30px', padding: '20px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(233, 30, 99, 0.3)' },
  buttonIcon: { fontSize: '22px' },
  spinner: { width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingContainer: { minHeight: '100vh', background: 'linear-gradient(135deg, #FFF0F5, #FFE5EC)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  loadingCard: { background: 'white', borderRadius: '20px', padding: '60px 40px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxWidth: '500px' },
  loadingAnimation: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' },
  loadingCircle: { width: '15px', height: '15px', borderRadius: '50%', background: 'linear-gradient(135deg, #E91E63, #FC5185)', animation: 'float 1.5s ease-in-out infinite' },
  loadingTitle: { fontSize: '28px', fontWeight: '700', color: '#E91E63', marginBottom: '20px', fontFamily: "'Playfair Display', serif" },
  loadingText: { color: '#666', fontSize: '16px', marginBottom: '12px' },
  loadingSubtext: { color: '#999', fontSize: '13px', marginTop: '20px', fontStyle: 'italic' },
  resultContainer: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
  resultCard: { background: 'white', borderRadius: '20px', padding: '50px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', textAlign: 'center' },
  resultTitle: { fontSize: '36px', fontWeight: '700', background: 'linear-gradient(135deg, #E91E63, #FC5185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px', fontFamily: "'Playfair Display', serif" },
  resultSubtitle: { fontSize: '16px', color: '#666', marginBottom: '40px' },
  canvas: { width: '100%', maxWidth: '800px', border: '4px solid #E91E63', borderRadius: '16px', boxShadow: '0 10px 30px rgba(233, 30, 99, 0.2)', marginBottom: '40px' },
  actionButtons: { display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' },
  downloadButton: { background: 'linear-gradient(135deg, #E91E63, #FC5185)', color: 'white', border: 'none', borderRadius: '30px', padding: '16px 32px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  retryButton: { background: 'white', color: '#E91E63', border: '2px solid #E91E63', borderRadius: '30px', padding: '16px 32px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  shareSection: { borderTop: '1px solid #E0E0E0', paddingTop: '30px', marginBottom: '30px' },
  shareTitle: { fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '15px' },
  shareButtons: { display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' },
  shareButton: { background: '#F5F5F5', border: 'none', borderRadius: '20px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  aiNotice: { background: '#F5F5F5', borderRadius: '10px', padding: '15px', marginTop: '20px' },
  aiNoticeText: { color: '#666', fontSize: '13px', margin: 0 },
  footer: { background: '#FFFFFF', borderTop: '1px solid #E0E0E0', padding: '30px 20px', textAlign: 'center', marginTop: '60px' },
  footerText: { color: '#666', fontSize: '14px' }
};
