

# 🩺 HealthOnIt – AI-Powered Symptom Checker & Diet Planner

HealthOnIt is an intelligent **health assistant** built with **Next.js**, designed to analyze user symptoms, provide a potential diagnosis, and generate **personalized diet plans** – all in real-time.  
It’s fast, intuitive, and aims to make healthcare guidance accessible to everyone.

## 🚀 Features
- 🤖 **AI Symptom Analysis** – Enter your symptoms and get an instant AI-driven health assessment.
- 🍎 **Personalized Diet Plans** – Tailored 7-day meal recommendations based on your condition.
- 🎙 **Voice Input Support** – Use speech-to-text to quickly describe your symptoms.
- 📄 **Downloadable Reports** – Get your diagnosis and meal plan as a clean PDF.
- 💬 **Interactive Chat UI** – Conversational design for a smooth, human-like experience.
- 🗄 **Database Integration** – Save and retrieve user data securely.
- ⚡ **Fast & Responsive** – Works seamlessly on desktop and mobile.

## 🛠️ Tech Stack
**Frontend:**
- [Next.js 15](https://nextjs.org/) – React framework for production-grade apps
- [TypeScript](https://www.typescriptlang.org/) – Type-safe development
- TailwindCSS – Rapid UI styling
- ShadCN/UI – Beautiful UI components

**Backend & APIs:**
- OpenAI API – Natural language understanding & diet plan generation
- Custom REST API Routes – For processing and storing data
- MongoDB / Firebase (if used) – For persistent data storage

**Other Tools & Utilities:**
- SpeechRecognition API – Voice-to-text
- pdfmake / jsPDF – PDF generation
- Vercel – Hosting & deployment

## 📦 Installation & Setup
Clone the repository and install dependencies:
```bash
git clone https://github.com/Tech-No-Phile/healthonit.git
cd healthonit
npm install
````

Run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## 🌐 Live Demo

🔗 **[Try HealthOnIt Here](https://healthonit.vercel.app/)**

## 📷 Screenshots

| Symptom Input                      | Diagnosis Result                 | Diet Plan                   |
| ---------------------------------- | -------------------------------- | --------------------------- |
| ![symptom](docs/symptom-input.png) | ![diagnosis](docs/diagnosis.png) | ![diet](docs/diet-plan.png) |

## 📚 How It Works

1. **Input Symptoms** – Users type or speak their symptoms.
2. **AI Analysis** – Backend sends data to OpenAI for diagnosis generation.
3. **Diet Plan Offer** – If applicable, the bot offers a customized 7-day meal plan.
4. **PDF Download** – Users can download results for offline use.

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo, make changes, and submit a PR.

## 📄 License

MIT License – feel free to use, modify, and share.

---

**💡 Built in a 10-hour hackathon with ❤️ by Team AVIDUS.**

---