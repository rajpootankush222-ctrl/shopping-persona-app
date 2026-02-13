// pages/index.js
import React, { useState, useRef } from "react";

export default function WomanCartSuperheroGenerator() {
  const [step, setStep] = useState("quiz");
  const [formData, setFormData] = useState({
    cartBehavior: "",
    paymentStyle: "",
    shoppingSpeed: "",
    photo: null,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  /* ----------------------------
     PHOTO UPLOAD WITH VALIDATION
  ----------------------------- */

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, photo: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  /* ----------------------------
     GENERATE
  ----------------------------- */

  const handleGenerate = async () => {
    if (loading) return;

    if (!formData.cartBehavior || !formData.paymentStyle || !formData.shoppingSpeed) {
      setError("Please answer all questions.");
      return;
    }

    if (!formData.photo) {
      setError("Please upload your photo.");
      return;
    }

    setError("");
    setLoading(true);
    setStep("generating");

    try {
      const response = await fetch("/api/generate-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: {
            cartBehavior: formData.cartBehavior,
            paymentStyle: formData.paymentStyle,
            shoppingSpeed: formData.shoppingSpeed,
          },
          photo: formData.photo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || "Generation failed.");
      }

      setResult(data);
      setStep("result");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setStep("quiz");
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setStep("quiz");
    setFormData({
      cartBehavior: "",
      paymentStyle: "",
      shoppingSpeed: "",
      photo: null,
    });
    setResult(null);
    setError("");
  };

  const downloadAvatar = () => {
    if (!result?.avatarUrl) return;

    const link = document.createElement("a");
    link.href = result.avatarUrl;
    link.download = `WomanCart-${result.superheroName.replace(/\s/g, "-")}.png`;
    link.click();
  };

  /* ----------------------------
     QUIZ VIEW
  ----------------------------- */

  if (step === "quiz") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Become Your Shopping Superhero</h1>

          {error && <p style={styles.error}>{error}</p>}

          <select
            value={formData.cartBehavior}
            onChange={(e) => setFormData({ ...formData, cartBehavior: e.target.value })}
            style={styles.select}
          >
            <option value="">Cart Personality</option>
            <option value="ghost">Ghost</option>
            <option value="decisive">Decisive</option>
            <option value="collector">Collector</option>
          </select>

          <select
            value={formData.paymentStyle}
            onChange={(e) => setFormData({ ...formData, paymentStyle: e.target.value })}
            style={styles.select}
          >
            <option value="">Payment Style</option>
            <option value="prepaid">Prepaid</option>
            <option value="cod">Cash on Delivery</option>
            <option value="bnpl">Buy Now Pay Later</option>
          </select>

          <select
            value={formData.shoppingSpeed}
            onChange={(e) => setFormData({ ...formData, shoppingSpeed: e.target.value })}
            style={styles.select}
          >
            <option value="">Shopping Style</option>
            <option value="lightning">Lightning</option>
            <option value="planner">Planner</option>
            <option value="zen">Zen</option>
          </select>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoUpload}
          />

          <button onClick={() => fileInputRef.current.click()} style={styles.uploadBtn}>
            Upload Photo
          </button>

          {formData.photo && (
            <img src={formData.photo} alt="Preview" style={styles.preview} />
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              ...styles.generateBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generating..." : "Transform Into Superhero"}
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------
     LOADING VIEW
  ----------------------------- */

  if (step === "generating") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Creating Your Superhero...</h2>
          <p>Please wait 15–20 seconds.</p>
        </div>
      </div>
    );
  }

  /* ----------------------------
     RESULT VIEW
  ----------------------------- */

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>{result?.superheroName}</h2>

        {result?.avatarUrl && (
          <img
            src={result.avatarUrl}
            alt="Avatar"
            style={styles.avatar}
            onError={() => {
              setError("Image failed to load.");
              resetApp();
            }}
          />
        )}

        <p style={{ marginTop: 10 }}>{result?.personaTitle}</p>
        <p>{result?.tagline}</p>

        <ul style={{ textAlign: "left" }}>
          <li>{result?.trait1}</li>
          <li>{result?.trait2}</li>
          <li>{result?.trait3}</li>
        </ul>

        <button onClick={downloadAvatar} style={styles.downloadBtn}>
          Download Avatar
        </button>

        <button onClick={resetApp} style={styles.resetBtn}>
          Create New
        </button>
      </div>
    </div>
  );
}

/* ----------------------------
   SIMPLE CLEAN STYLES
----------------------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #E91E63, #FC5185)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "white",
    padding: 40,
    borderRadius: 20,
    maxWidth: 450,
    width: "100%",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: 20,
  },
  select: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    border: "1px solid #ddd",
  },
  uploadBtn: {
    padding: 12,
    marginBottom: 15,
    background: "#E91E63",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  preview: {
    width: 150,
    height: 150,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 15,
  },
  generateBtn: {
    width: "100%",
    padding: 14,
    background: "#FC5185",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
  },
  avatar: {
    width: "100%",
    borderRadius: 15,
    marginTop: 15,
  },
  downloadBtn: {
    marginTop: 15,
    padding: 10,
    background: "#E91E63",
    color: "white",
    border: "none",
    borderRadius: 8,
    width: "100%",
  },
  resetBtn: {
    marginTop: 10,
    padding: 10,
    background: "white",
    border: "1px solid #E91E63",
    color: "#E91E63",
    borderRadius: 8,
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
};
