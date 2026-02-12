// pages/index.js
import React, { useState, useRef } from "react";

export default function ShoppingPersonaGenerator() {
  const [step, setStep] = useState("quiz");
  const [formData, setFormData] = useState({
    cartBehavior: "",
    paymentStyle: "",
    shoppingSpeed: "",
    photo: null,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // 🎨 WOMANCART THEME
  const theme = {
    primary: "#FF5FA2",
    secondary: "#D946EF",
    darkAccent: "#A21CAF",
    softPink: "#FFE4F1",
    white: "#FFFFFF",
  };

  const questions = [
    {
      id: "cartBehavior",
      question: "🛒 What's your shopping cart vibe?",
      options: [
        { value: "ghost", label: "👻 I ghost my cart like bad dates" },
        { value: "decisive", label: "⚡ Add to cart = instant checkout" },
        { value: "collector", label: "🗂️ I curate carts like art galleries" },
      ],
    },
    {
      id: "paymentStyle",
      question: "💳 How do you pay?",
      options: [
        { value: "prepaid", label: "💰 Prepaid = Discounts baby!" },
        { value: "cod", label: "📦 Cash on Delivery only" },
        { value: "bnpl", label: "⏰ Buy Now, Pay Later" },
      ],
    },
    {
      id: "shoppingSpeed",
      question: "⏱️ Your shopping speed is...",
      options: [
        { value: "lightning", label: "⚡ In and out in 5 minutes" },
        { value: "planner", label: "📋 I plan everything" },
        { value: "zen", label: "🧘 I take my sweet time" },
      ],
    },
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, photo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (
      !formData.cartBehavior ||
      !formData.paymentStyle ||
      !formData.shoppingSpeed ||
      !formData.photo
    ) {
      setError("Please complete all fields & upload your photo 💕");
      return;
    }

    setError("");

    const personaTitle = "Shopping Diva";
    const tagline = "Certified Womancart Queen 👑";
    const trait1 = "• Cart Confidence Level: 100%";
    const trait2 = "• Discount Radar Activated";
    const trait3 = "• Wishlist = Personality";

    const data = { personaTitle, tagline, trait1, trait2, trait3 };
    setResult(data);
    setStep("result");

    setTimeout(() => generateIDCard(data), 300);
  };

  const generateIDCard = (data) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 800;
    const height = 500;

    canvas.width = width;
    canvas.height = height;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, theme.primary);
    gradient.addColorStop(0.5, theme.secondary);
    gradient.addColorStop(1, theme.darkAccent);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // White Card Overlay
    ctx.fillStyle = theme.white;
    ctx.fillRect(40, 100, width - 80, height - 160);

    // Header
    ctx.fillStyle = theme.white;
    ctx.font = "bold 30px Poppins";
    ctx.textAlign = "left";
    ctx.fillText("WOMANCART CLUB", 40, 60);

    ctx.font = "bold 40px Poppins";
    ctx.fillText(data.personaTitle, 60, 150);

    // Traits
    ctx.fillStyle = "#333";
    ctx.font = "20px Poppins";
    ctx.fillText(data.trait1, 60, 220);
    ctx.fillText(data.trait2, 60, 260);
    ctx.fillText(data.trait3, 60, 300);

    ctx.fillStyle = theme.darkAccent;
    ctx.font = "italic 22px Poppins";
    ctx.fillText(`"${data.tagline}"`, 60, 360);

    // Avatar
    const avatar = new Image();
    avatar.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(650, 250, 100, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 550, 150, 200, 200);
      ctx.restore();
    };
    avatar.src = formData.photo;
  };

  const downloadCard = () => {
    const link = document.createElement("a");
    link.download = "womancart-persona.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary}, ${theme.darkAccent})`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      fontFamily: "Poppins, sans-serif",
    },
    card: {
      background: theme.white,
      borderRadius: "24px",
      padding: "40px",
      maxWidth: "700px",
      width: "100%",
      boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
    },
    button: {
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
      border: "none",
      color: "white",
      padding: "15px 25px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "15px",
    },
    optionButton: (selected) => ({
      padding: "12px",
      borderRadius: "12px",
      border: selected ? "2px solid #FF5FA2" : "2px solid #ddd",
      background: selected
        ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
        : "#f9f9f9",
      color: selected ? "white" : "#333",
      cursor: "pointer",
      marginBottom: "10px",
    }),
  };

  if (step === "quiz") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>💖 Discover Your Shopping Persona</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}

          {questions.map((q) => (
            <div key={q.id}>
              <h3>{q.question}</h3>
              {q.options.map((opt) => (
                <div
                  key={opt.value}
                  style={styles.optionButton(
                    formData[q.id] === opt.value
                  )}
                  onClick={() =>
                    setFormData({ ...formData, [q.id]: opt.value })
                  }
                >
                  {opt.label}
                </div>
              ))}
            </div>
          ))}

          <h3>📸 Upload Your Photo</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          <br />
          <button style={styles.button} onClick={handleGenerate}>
            Generate My Womancart ID 💕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Your Womancart Persona 🎀/testing ankush</h2>
        <canvas ref={canvasRef} style={{ width: "100%", marginTop: 20 }} />
        <button style={styles.button} onClick={downloadCard}>
          Download Card
        </button>
      </div>
    </div>
  );
}
