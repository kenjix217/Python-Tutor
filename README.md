# Python AI Tutor — Web-First Learning Platform

A web-based AI-assisted learning platform that teaches Python from complete beginner to professional level.

**Learn Python entirely from your web browser — no installation required.**

---

## 🎯 Project Goals

- Teach Python to absolute beginners with zero coding experience
- Provide interactive, hands-on learning with immediate feedback
- Use AI as a tutor that guides, not solves (Configurable via Settings)
- Make learning accessible through voice narration and clear explanations
- Track progress and mastery across sessions

---

## 🚀 Features (v2.4.0)

- **Complete Curriculum:** 22 Lessons taking you from "Hello World" to "Full-Stack Deployment".
- **Browser-Based Execution:** Runs real Python 3.11 code entirely in your browser using Pyodide (WASM).
- **AI Tutor:** Integrated AI chat assistant (requires your own API key) to guide learning.
- **Library Support:** Practice with real libraries like `pandas`, `numpy`, `matplotlib`, and `sqlite3` directly in the browser.
- **Reference Implementations:** Includes "Golden Source" examples for advanced topics (Web Apps, APIs, Automation).
- **Zero Install:** Just open the website and start coding.

---

## 📚 Curriculum Overview

### Beginner Level (Lessons 1-5)
1. ✅ What is Programming?
2. ✅ Variables and Data Types
3. ✅ Input and Output
4. ✅ Conditions (if/else)
5. ✅ Loops (for and while)

### Intermediate Level (Lessons 6-10)
6. ✅ Functions
7. ✅ Lists and Dictionaries
8. ✅ File Handling
9. ✅ Error Handling
10. ✅ Introduction to OOP

### Advanced Level (Lessons 11-19)
11. ✅ External Libraries
12. ✅ Working with APIs
13. ✅ Data Processing Basics
14. ✅ Web Development with Flask
15. ✅ Building Web Applications
16. ✅ Building REST APIs
17. ✅ Working with Databases (SQLite)
18. ✅ Data Analysis
19. ✅ Automation and Scripting

### Professional Level (Lessons 20-22)
20. ✅ Testing and Quality
21. ✅ Deployment and Production
22. ✅ Final Capstone Project

---

## 🏗️ Project Structure

```
Python-Learner/
├── frontend/                      # Web application
│   ├── index.html                # Main entry point
│   ├── css/                      # Application styles
│   ├── js/                       # Application logic (App, Editor, AI Tutor)
│   ├── lessons/                  # Curriculum Content (Markdown)
│   └── lib/                      # Third-party libraries
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required!

### Running Locally

1. **Clone or navigate to the project:**
   ```bash
   cd Python-Learner
   ```

2. **Open the web app:**
   - Simply open `frontend/index.html` in your browser.
   - Or use a local server for best performance:
     ```bash
     cd frontend
     python -m http.server 8000
     ```
   - Navigate to `http://localhost:8000`

3. **Start learning!**
   - Go to the **Settings** tab to configure the AI Tutor (optional).
   - Start with Lesson 1!

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript ES6
- **Python Runtime:** Pyodide (WebAssembly)
- **Editor:** Monaco Editor (VS Code in browser)
- **Markdown:** Marked.js
- **AI:** OpenRouter/OpenAI API integration

---

## 🔒 Privacy & Data

- All progress is stored locally in your browser (`localStorage`).
- Your API keys (for AI Tutor) are stored locally and never sent to our servers.
- No personal data collection.

---

**Built with OpenClaw** — Empowering independent learning.
