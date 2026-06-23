# 🕵️‍♂️ Unmasked: The Social Experiment Game

**Unmasked** is a premium psychological party game and social experiment built as a modern Single Page Web Application (SPA). The game exposes the gap between a player's **ideal self** (the values they claim to prioritize) and their **shadow self** (how they actually behave when trade-offs and consequences are introduced under pressure).

---

## 🎮 How the Game Works

The game consists of two main phases played by a subject:

### Phase 1: The Ideal Self (Value Bracket)
* Players complete a randomized 8-item tournament bracket.
* They compare abstract, positive values (e.g. *Ambition* vs. *Compassion*) head-to-head.
* This maps the values they *believe* they hold or *want* to project.

### Phase 2: The Crucible (Moral Dilemmas)
* Players enter a series of 4 high-stakes narrative scenarios.
* Each scenario pits their core values directly against each other (e.g., sharing project blame to save a colleague's job vs. staying silent to secure a promotion).
* A built-in timer monitors decision speeds to measure hesitation (cognitive conflict).

### The Handover
* Once complete, the game prompts the player to return the device to the Host.
* The report is kept secret from the player to maintain the social experiment's integrity.

---

## 📊 The Host Dashboard

Hosts can access the profiling panel by clicking the **shield/user gear icon** in the upper-right corner of the header.

* **Passcode:** `host123`
* **Features:**
  * **Authenticity Index:** A score (100% to 0%) reflecting how consistent their dilemma choices were compared to their abstract values ranking.
  * **Archetype Assignment:** Automatically classes players into categories like *The Quiet Saint*, *The Secret Boss*, *The Honest Pragmatist*, or *The Masked Chameleon*.
  * **Trade-Off Discrepancies:** Details where the player contradicted their abstract values.
  * **Timing Diagnostics:** Breaks down average choice speeds and identifies exactly which dilemma caused the most hesitation.
  * **Inquiry Prompts:** Suggests specific, sharp icebreaker questions for the host to "confront" the player with their results.

---

## 🚀 How to Run

Because this game is built entirely with Vanilla Web technologies (HTML5, CSS3, ES6 JS), it runs locally with **zero dependencies** and **zero setup time**. 

### Option 1: Direct Execution (Easiest)
1. Double-click the [index.html](file:///Users/lekshmisyam/Desktop/Ikigai/Play/index.html) file to open it in Google Chrome, Safari, Firefox, or Microsoft Edge.
2. The game will run immediately.

### Option 2: Local Web Server (For testing across a local network)
If you want to run it via a terminal-based dev server, run this command in this directory:
```bash
npx -y serve
```
Then open the displayed address (usually `http://localhost:3000`) in your browser.

---

## 🛠️ Tech Stack & Aesthetics
* **Core:** Standard HTML5 and ES6 Javascript.
* **Styling:** Custom CSS3 with dynamic glassmorphic panels, neon indicators, background moving glowing orbs, and fully responsive layouts.
* **Storage:** Utilizes browser `localStorage` to save all player sessions. Results will persist even after browser refreshes.
