# Kinetix AI - Hackathon Demo Video Script

**Objective:** Create a ~2:45 minute video that hooks the judges, clearly demonstrates the core "magic" of the app, and explicitly details the innovative use of the Gemini API.

**Video Style:** Fast-paced, clean, and professional. Use on-screen text to emphasize key points. Use screen recordings of the actual application.

---

### **Part 1: The Problem & The Solution (0:00 - 0:30)**

**(0:00 - 0:15) - The Hook (Addresses: Potential Impact)**

*   **Visual:** Fast cuts of people exercising with poor form in a gym (stock footage or self-shot). Knees caving on squats, backs rounding on deadlifts.
*   **Narrator (Voiceover):** "Every single day, millions of people risk injury in the gym. Why? Because good form is hard, and personal trainers are a luxury most of us can't afford."
*   **Visual:** Cut to a shot of someone looking frustrated or confused while trying to follow a workout video.
*   **Narrator (Voiceover):** "What if you could have an expert coach, watching every single rep, correcting your form in real-time?"

**(0:15 - 0:30) - The Solution Intro (Addresses: Presentation)**

*   **Visual:** Cut to the newly designed Kinetix AI idle screen. The logo and name are clean and centered. Animate a mouse cursor clicking "START SESSION".
*   **Narrator (Voiceover):** "This is Kinetix AI. Your personal trainer, powered by Google's Gemini."
*   **On-Screen Text:** KINETIX AI: Your AI Personal Trainer

---

### **Part 2: The Live Demo (0:30 - 1:30)**

**(0:30 - 0:50) - Perfect Form & Gentle Correction (Addresses: Technical Execution)**

*   **Visual:** Full-screen recording of the `ActiveSession`. A person is doing squats with good form. The skeleton overlay is calm and green. The "Coach Log" shows messages like "Perfect!" and "Great depth!".
*   **Narrator (Voiceover):** "Kinetix uses your webcam to analyze your movement. When your form is good, the AI gives you positive reinforcement."
*   **Visual:** The person on screen makes a minor mistake (e.g., doesn't go deep enough). The skeleton highlights the legs in yellow, and the Coach Log says "A little deeper!". An audio cue plays.
*   **Narrator (Voiceover):** "If you make a small mistake, the AI gives you a gentle nudge, both visually and with an audio cue, to get you back on track."

**(0:50 - 1:10) - Critical Correction & The "Wow Factor" (Addresses: Innovation)**

*   **Visual:** The person on screen makes a dangerous mistake (e.g., knees caving in). The screen flashes red. The skeleton becomes thick and red, pulsing over the knees. The Coach Log urgently says "Stop! Push your knees out!"
*   **Narrator (Voiceover):** "But for dangerous movements, Kinetix intervenes immediately to prevent injury. This is where the real innovation lies."
*   **Visual:** Transition focus to the right sidebar. Toggle from the "Coach Log" to the "Pro Log" view.
*   **Narrator (Voiceover):** "What you're seeing is Gemini's dual-persona analysis. The 'Coach Log' is simple... but the 'Pro Log' reveals the AI's internal monologue."
*   **On-Screen Text:** (pointing to Pro Log) → Technical Analysis: `Valgus collapse detected on eccentric phase.`
*   **On-Screen Text:** (pointing to Coach Log) → Simple Translation: `Push your knees out sideways!`

**(1:10 - 1:30) - The Session Summary (Addresses: Technical Execution, Innovation)**

*   **Visual:** The user clicks "END SESSION". The screen shows the "Generating Summary" loading state briefly, then transitions to the beautiful `SessionSummary` screen.
*   **Narrator (Voiceover):** "When your workout is done, Kinetix doesn't just stop. It provides a complete breakdown of your performance."
*   **Visual:** Pan across the summary screen, highlighting the form score, strengths, and areas for improvement.
*   **Narrator (Voiceover):** "It shows you what you did well, what you need to work on, and even gives you personalized recommendations for corrective exercises, creating a full feedback loop."

---

### **Part 3: The Gemini Integration (1:30 - 2:30)**

**(1:30 - 2:00) - How It's Built: Multimodality & Reasoning (Addresses: Technical Execution, Presentation)**

*   **Visual:** A simple, clean animated diagram appears.
    *   `Webcam Feed` → `Gemini 1.5 Pro` → `JSON Output (Status, Thought, Speech)` → `UI & Audio`
*   **Narrator (Voiceover):** "So how does it work? Kinetix is a Next.js application with a Python backend that streams video frames to the Gemini 1.5 Pro model."
*   **Narrator (Voiceover):** "We use a sophisticated system prompt that instructs Gemini to act as both a technical analyst and an encouraging coach. It uses its advanced **multimodal reasoning** to interpret the video frames and output a structured JSON object containing its technical thought process AND the simple, user-friendly speech text, all in a single pass."

**(2:00 - 2:30) - How It's Built: Large Context & TTS (Addresses: Technical Execution, Innovation)**

*   **Visual:** Show the session summary screen again, but this time, highlight the "Areas for Improvement" and "Recommended Exercises" sections.
*   **Narrator (Voiceover):** "This is where Gemini's **large context window** is a game-changer. At the end of the session, all the analysis from every single frame is sent back to Gemini. It uses this complete history to generate a deeply insightful and personalized summary that understands the nuances of your entire workout."
*   **Narrator (Voiceover):** "Finally, all the coach's real-time feedback is converted to audio using Gemini's **Text-to-Speech model**, ensuring you can focus on your form, not the screen."
*   **On-Screen Text:** Multimodal Reasoning + Large Context Window + TTS = A True AI Coach

---

### **Part 4: The Vision (2:30 - 2:45)**

*   **Visual:** Clean, final shot of the Kinetix logo.
*   **Narrator (Voiceover):** "Kinetix is more than a form-checker; it's a complete, continuous feedback loop for improvement. We're just getting started, with plans to add more exercises and long-term progress tracking."
*   **On-Screen Text:** Kinetix: Perfect Form. Every Rep.
*   **Visual:** End screen with your name/Devpost username.

---
