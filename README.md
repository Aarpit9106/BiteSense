# 🍽️ BiteSense — AI-Powered Food Decision Engine

> Stop guessing what to eat. Let AI decide smarter.

**BiteSense** is an AI-powered web application that analyzes food from images and helps users make healthier, goal-driven eating decisions.

It goes beyond basic calorie detection by combining **computer vision, intelligent scoring, and actionable recommendations** — all wrapped in a modern, premium UI.

---

## 🚀 Live Demo

👉 https://bite-sense-amber.vercel.app/

---

## ✨ Core Features

### 🤖 AI Food Analysis

* Scan or upload food images
* Uses OpenAI Vision (`gpt-4o-mini`)
* Extracts:

  * Calories
  * Protein / Carbs / Fats
  * Overall health score

---

### 🧠 Smart Decision Engine

* Multi-factor scoring system:

  * Nutrition
  * Fitness
  * Longevity
  * Medical
* Clear explanations: **“Why this score?”**
* Suggests **healthier alternatives (smart swaps)**

---

### 📊 Interactive Results Experience

* Animated macro breakdown (Protein / Carbs / Fats)
* Visual score rings for multiple health dimensions
* Expandable dish insights
* Real-time feedback with smooth transitions

---

### 🔐 Authentication System

* Supabase Magic Link (passwordless login)
* Protected routes (dashboard, scan, results, profile)
* Secure session handling
* Dev-mode fallback when auth is not configured

---

### ⚡ Resilient AI Architecture

* Dual-mode system:

  * ✅ Real AI (when API key is present)
  * ✅ Mock fallback (when API key is missing)
* Ensures app **never breaks in demo or production**

---

### 🎨 Custom Design System — *Verdant Air*

* Glassmorphism-inspired UI
* Built using Tailwind CSS + CVA (class-variance-authority)
* Reusable component system:

  * Buttons, Cards, Dialogs, Inputs, Skeletons, Toasts

---

## 🏗️ Tech Stack

**Frontend**

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion

**Backend & Infra**

* Supabase (Authentication + Database)
* OpenAI Vision API

**Architecture**

* API route-based AI processing
* Middleware-based authentication
* Component-driven scalable UI system

---

## 🧪 Local Setup

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key (optional)
```

---

## 🧠 Key Engineering Highlights

* Clean separation of concerns (UI / AI / Backend)
* Fallback-safe architecture (works without APIs)
* CVA-based component system for scalability
* Middleware-driven route protection
* Smooth UX with meaningful micro-interactions

---

## 🎯 Future Scope

* Personalized recommendations based on user history
* Weekly nutrition insights & trends
* Meal comparison system
* Mobile-first optimization

---

## 🏆 Why BiteSense Stands Out

* Not just an analyzer — a **decision-making system**
* Real AI integration with production-ready fallback
* Strong focus on UX + interaction design
* Built like a startup product, not just a demo

---

## 👨‍💻 Author

**Aarpit Jethwa**
B.Tech CSE — Shri Ramdeobaba College of Engineering
Aspiring Software Engineer | AI + Product Enthusiast

---

## ⭐ Support

If you found this interesting, consider giving it a star ⭐
