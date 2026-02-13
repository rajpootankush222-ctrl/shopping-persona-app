// pages/index.js
// Professional result card design like NIVEA campaign

import React, { useState, useRef, useEffect } from 'react';

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
  const [imageLoaded, setImageLoaded] = useState(false);
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
    setImageLoaded(false);

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate');
      }

      const data = await response.json();
      console.log('Received data:', data);
      setResult(data);
      setStep('result');
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('quiz');
    } finally {
      setLoading(false);
    }
  };

  const downloadCard = () => {
    // Create a download link for the avatar image
    if (result && result.avatarUrl) {
      const link = document.createElement('a');
      link.href = result.avatarUrl;
      link.download = `WomanCart-${result.superheroName.replace(/\s/g, '-')}.png`;
      link.click();
    }
  };

  if (step === 'quiz') {
    return (
      <>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700;900&display=swap');
          body { margin: 0; padding: 0; font-family: 'Lato', sans-serif; }
          @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
        
        <div style={styles.container}>
          <header style={styles.header}>
            <div style={styles.headerContent}>
              <div style={styles.logo}><span style={styles.logoText}>WomanCart</span></div>
              <nav style={styles.nav}>
                <a href="#" style={styles.navLink}>Categories</a>
                <a href="#" style={styles.navLink}>Brands</a>
                <a href="#" style={styles.navLink}>Sale</a>
              </nav>
            </div>
          </header>

          <div style={styles.promoBanner}>
            <div style={styles.promoContent}>
              <span style={styles.promoIcon}>🦸‍♀️</span>
              <span style={styles.promoText}>Transform Into Your Shopping Superhero - AI-Powered 3D Avatar!</span>
              <span style={styles.promoIcon}>🦸‍♀️</span>
            </div>
          </div>

          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>Become a Shopping Superhero</h1>
            <p style={styles.heroSubtitle}>Upload your photo & get your personalized 3D Pixar-style superhero avatar!</p>
          </div>

          <div style={styles.mainContent}>
            <div style={styles.quizCard}>
              {error && <div style={styles.errorBanner}><span>⚠️</span> {error}</div>}

              {questions.map((q, qIndex) => (
                <div key={q.id} style={{...styles.questionBlock, animation: `slideInUp 0.6s ease-out ${qIndex * 0.1}s backwards`}}>
                  <h3 style={styles.questionTitle}>{q.question}</h3>
                  <div style={styles.optionsGrid}>
                    {q.options.map((option) => (
                      <button key={option.value} onClick={() => setFormData({ ...formData, [q.id]: option.value })}
                        style={{...styles.optionCard, ...(formData[q.id] === option.value ? {
                          ...styles.optionCardSelected, borderColor: option.color,
                          background: `linear-gradient(135deg, ${option.color}15, ${option.color}05)`
                        } : {})}}>
                        <span style={styles.optionEmoji}>{option.emoji}</span>
                        <span style={styles.optionLabel}>{option.label}</span>
                        {formData[q.id] === option.value && <span style={{...styles.checkmark, backgroundColor: option.color}}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div style={styles.uploadSection}>
                <h3 style={styles.questionTitle}>📸 Upload Your Photo</h3>
                <p style={styles.uploadSubtext}>We'll create YOUR 3D superhero avatar</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                <div style={styles.uploadArea}>
                  {!formData.photo ? (
                    <button onClick={() => fileInputRef.current.click()} style={styles.uploadButton}>
                      <span style={styles.uploadIcon}>📷</span><span>Choose Photo</span>
                    </button>
                  ) : (
                    <div style={styles.photoPreviewContainer}>
                      <img src={formData.photo} alt="Preview" style={styles.photoPreview} />
                      <button onClick={() => fileInputRef.current.click()} style={styles.changePhotoButton}>Change Photo</button>
                    </div>
                  )}
                </div>
              </div>

              <button onClick={handleGenerate} disabled={loading} style={styles.generateButton}>
                {loading ? (<><span style={styles.spinner}></span>Creating...</>) : 
                (<><span>⚡</span> Transform Into Superhero! <span>⚡</span></>)}
              </button>
            </div>
          </div>

          <footer style={styles.footer}><p style={styles.footerText}>© 2024 WomanCart</p></footer>
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
          <h2 style={styles.loadingTitle}>Creating Your Superhero...</h2>
          <p style={styles.loadingText}>🎭 Analyzing your features</p>
          <p style={styles.loadingText}>🦸‍♀️ Designing superhero costume</p>
          <p style={styles.loadingText}>🎬 Rendering 3D Pixar quality</p>
          <p style={styles.loadingSubtext}>(This may take 15-20 seconds)</p>
        </div>
      </div>
    );
  }

  // RESULT VIEW - Professional NIVEA-style card
  return (
    <div style={styles.resultContainer}>
      <div style={styles.professionalCard}>
        {/* Header Badge */}
        <div style={styles.cardHeader}>
          <div style={styles.brandBadge}>
            <span style={styles.brandText}>WomanCart</span>
          </div>
          <h2 style={styles.cardTitle}>{result?.superheroName}</h2>
        </div>

        {/* Avatar Section - Large centered image like NIVEA */}
        <div style={styles.avatarSection}>
          {result?.avatarUrl && (
            <img 
              src={result.avatarUrl} 
              alt={result.superheroName}
              style={styles.heroAvatar}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error('Image failed to load:', result.avatarUrl);
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>

        {/* Persona Info - Like NIVEA's "Gossip Monger" card */}
        <div style={styles.personaInfo}>
          <h1 style={styles.personaName}>{result?.personaTitle}</h1>
          <p style={styles.personaDescription}>
            {result?.tagline}
          </p>
        </div>

        {/* Traits Section */}
        <div style={styles.traitsSection}>
          <h3 style={styles.traitsTitle}>SUPERPOWERS:</h3>
          <div style={styles.traitsList}>
            <p style={styles.trait}>{result?.trait1}</p>
            <p style={styles.trait}>{result?.trait2}</p>
            <p style={styles.trait}>{result?.trait3}</p>
          </div>
        </div>

        {/* Dream Job Section - Like NIVEA */}
        <div style={styles.dreamJobSection}>
          <div style={styles.dreamJobBadge}>
            <p style={styles.dreamJobLabel}>CERTIFIED BY:</p>
            <p style={styles.dreamJobText}>WomanCart AI</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button onClick={downloadCard} style={styles.downloadBtn}>
            📥 Download Avatar
          </button>
          <button onClick={() => {
            setStep('quiz');
            setFormData({cartBehavior: '', paymentStyle: '', shoppingSpeed: '', photo: null});
          }} style={styles.retryBtn}>
            🔄 Create New
          </button>
        </div>

        {/* Share Section */}
        <div style={styles.shareSection}>
          <p style={styles.shareText}>Share your shopping superhero!</p>
          <div style={styles.shareButtons}>
            <button style={styles.shareBtn}>📸 Instagram</button>
            <button style={styles.shareBtn}>💬 WhatsApp</button>
            <button style={styles.shareBtn}>👍 Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Lato', sans-serif" },
  header: { background: '#FFF', borderBottom: '1px solid #E0E0E0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
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
  errorBanner: { background: '#FFF3E0', border: '2px solid #FF9800', borderRadius: '12px', padding: '15px 20px', marginBottom: '30px', color: '#E65100', fontSize: '14px', fontWeight: '500', display: 'flex', gap: '10px' },
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
  generateButton: { width: '100%', background: 'linear-gradient(135deg, #E91E63, #FC5185)', color: 'white', border: 'none', borderRadius: '30px', padding: '20px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(233, 30, 99, 0.3)' },
  spinner: { width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingContainer: { minHeight: '100vh', background: 'linear-gradient(135deg, #FFF0F5, #FFE5EC)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  loadingCard: { background: 'white', borderRadius: '20px', padding: '60px 40px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxWidth: '500px' },
  loadingAnimation: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' },
  loadingCircle: { width: '15px', height: '15px', borderRadius: '50%', background: 'linear-gradient(135deg, #E91E63, #FC5185)', animation: 'float 1.5s ease-in-out infinite' },
  loadingTitle: { fontSize: '28px', fontWeight: '700', color: '#E91E63', marginBottom: '20px', fontFamily: "'Playfair Display', serif" },
  loadingText: { color: '#666', fontSize: '16px', marginBottom: '12px' },
  loadingSubtext: { color: '#999', fontSize: '13px', marginTop: '20px', fontStyle: 'italic' },
  
  // PROFESSIONAL RESULT CARD - NIVEA STYLE
  resultContainer: { minHeight: '100vh', background: 'linear-gradient(135deg, #E91E63, #FC5185)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  professionalCard: { background: 'linear-gradient(135deg, #F0F8FF, #E6F3FF)', maxWidth: '500px', width: '100%', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  cardHeader: { background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '30px 20px 20px', textAlign: 'center', position: 'relative' },
  brandBadge: { background: 'rgba(255,255,255,0.3)', display: 'inline-block', padding: '8px 20px', borderRadius: '20px', marginBottom: '15px' },
  brandText: { color: 'white', fontSize: '14px', fontWeight: '700', letterSpacing: '1px' },
  cardTitle: { color: 'white', fontSize: '28px', fontWeight: '900', margin: '10px 0', fontFamily: "'Playfair Display', serif", textShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  avatarSection: { background: 'white', padding: '30px', textAlign: 'center', position: 'relative' },
  heroAvatar: { width: '100%', maxWidth: '350px', height: 'auto', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', objectFit: 'cover' },
  personaInfo: { background: 'white', padding: '20px 30px', textAlign: 'center' },
  personaName: { fontSize: '32px', fontWeight: '900', background: 'linear-gradient(135deg, #E91E63, #FC5185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px', fontFamily: "'Playfair Display', serif" },
  personaDescription: { fontSize: '16px', color: '#666', fontStyle: 'italic', lineHeight: '1.6' },
  traitsSection: { background: 'rgba(233,30,99,0.05)', padding: '25px 30px', borderTop: '2px solid rgba(233,30,99,0.2)' },
  traitsTitle: { fontSize: '14px', fontWeight: '700', color: '#E91E63', letterSpacing: '1px', marginBottom: '15px' },
  traitsList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  trait: { fontSize: '15px', color: '#333', lineHeight: '1.5', margin: 0 },
  dreamJobSection: { background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '20px 30px', display: 'flex', justifyContent: 'center' },
  dreamJobBadge: { background: 'rgba(255,255,255,0.2)', borderRadius: '15px', padding: '15px 30px', textAlign: 'center', border: '2px solid rgba(255,255,255,0.3)' },
  dreamJobLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', letterSpacing: '1px', margin: '0 0 5px 0' },
  dreamJobText: { fontSize: '18px', color: 'white', fontWeight: '900', margin: 0 },
  actionButtons: { background: 'white', padding: '20px', display: 'flex', gap: '10px', justifyContent: 'center' },
  downloadBtn: { background: 'linear-gradient(135deg, #E91E63, #FC5185)', color: 'white', border: 'none', borderRadius: '25px', padding: '12px 24px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', flex: 1 },
  retryBtn: { background: 'white', color: '#E91E63', border: '2px solid #E91E63', borderRadius: '25px', padding: '12px 24px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', flex: 1 },
  shareSection: { background: 'white', padding: '0 20px 30px', textAlign: 'center' },
  shareText: { fontSize: '14px', color: '#666', marginBottom: '12px' },
  shareButtons: { display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' },
  shareBtn: { background: '#F5F5F5', border: 'none', borderRadius: '18px', padding: '8px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  footer: { background: '#FFF', borderTop: '1px solid #E0E0E0', padding: '30px 20px', textAlign: 'center', marginTop: '60px' },
  footerText: { color: '#666', fontSize: '14px' }
};
