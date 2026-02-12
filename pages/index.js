// pages/index.js
import React, { useState, useRef } from "react";
import {
  ShoppingBag,
  CreditCard,
  Timer,
  Crown,
  Sparkle,
  Heart,
  Gift,
  Star,
} from "phosphor-react";

export default function WomancartPersona() {
  const [step, setStep] = useState("quiz");
  const [formData, setFormData] = useState({
    cartBehavior: "",
    paymentStyle: "",
    shoppingSpeed: "",
    photo: null,
  });
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const canvasRef = useRef(null);

  const theme = {
    pink: "#FF3E8D",
    lavender: "#D946EF",
    deep: "#7E22CE",
    blush: "#FFF1F7",
    text: "#1F1F1F",
  };

  const questions = [
    {
      id: "cartBehavior",
      icon: <ShoppingBag size={26} weight="duotone" color={theme.pink} />,
      question: "Your cart personality?",
      options: [
        { value: "ghost", label: "Add… then disappear 💅" },
        { value: "decisive", label: "Checkout queen instantly 👑" },
        { value: "collector", label: "Curated aesthetic moodboard ✨" },
      ],
    },
    {
      id: "paymentStyle",
      icon: <CreditCard size={26} weight="duotone" color={theme.pink} />,
      question: "Payment vibe?",
      options: [
        { value: "prepaid", label: "Prepaid for glam discounts 💖" },
        { value: "cod", label: "COD because trust issues 😌" },
        { value: "bnpl", label: "Buy now. Think later. Period." },
      ],
    },
    {
      id: "shoppingSpeed",
      icon: <Timer size={26} weight="duotone" color={theme.pink} />,
      question: "Shopping energy?",
      options: [
        { value: "lightning", label: "5 mins & done." },
        { value: "planner", label: "Research like a thesis 📚" },
        { value: "zen", label: "Shopping = therapy 🧘‍♀️" },
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
      setError("Complete everything, bestie 💕");
      return;
    }

    setError("");

    const persona = {
      title: "Certified Shopping Diva",
      trait1: "Wishlist > Bank Balance",
      trait2: "Knows every discount code",
      trait3: "Main character energy always",
      tagline: "Womancart Royalty 💖",
    };

    setResult(persona);
    setStep("result");

    setTimeout(() => generateCard(persona), 300);
  };

  const generateCard = (data) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 1080;
    const height = 1350;

    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#FFF1F7");
    gradient.addColorStop(1, "#F3E8FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 40;
    ctx.fillRect(120, 200, width - 240, height - 400);
    ctx.shadowBlur = 0;

    ctx.fillStyle = theme.pink;
    ctx.font = "bold 70px Poppins";
    ctx.textAlign = "center";
    ctx.fillText("WOMANCART CLUB", width / 2, 130);

    ctx.fillStyle = theme.deep;
    ctx.font = "bold 60px Poppins";
    ctx.fillText(data.title, width / 2, 320);

    ctx.fillStyle = "#333";
    ctx.font = "40px Poppins";
    ctx.fillText(`• ${data.trait1}`, width / 2, 420);
    ctx.fillText(`• ${data.trait2}`, width / 2, 490);
    ctx.fillText(
