# 🌿 EvoTree: The Living Digital Organism

**EvoTree** is a high-fidelity, bioluminescent developer reputation platform. It transforms fragmented data from GitHub and competitive programming sites into a unified, 3D interactive "EvoTree"—a digital organism that grows and evolves in real-time as you master your craft.

---

## 🚩 Problem Statement
Traditional resumes are static, easily fabricated, and fail to capture the real-time "living" nature of a developer's growth. Verifiable technical proof is scattered across multiple platforms (GitHub, Codeforces, LeetCode), making it difficult for recruiters to grasp a developer's true potential and consistency in a single glance.

## 💡 The Solution
EvoTree solves this by:
- **Neural Synthesis:** Aggregating real-time data from disparate coding platforms into a single interactive 3D tree.
- **The Crucible:** Authenticating skills through AI-powered testing arenas that generate dynamic challenges based on real-time developer metrics.
- **On-Chain Reputation:** Utilizing Soulbound Tokens (SBTs) on the Polygon network to provide immutable, verifiable proof of achievements and "Relics" earned in The Crucible.

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), Framer Motion, Tailwind CSS
- **3D Visualization:** Spline, Three.js, OGL (Neural Canvas)
- **AI Integration:** Google Gemini 3.1 Flash API (Dynamic Challenge Generation)
- **Web3:** Polygon, Wagmi, RainbowKit, Viem (Soulbound Token Minting)
- **Backend/Storage:** Supabase (User Profiles & Handle Mapping)
- **Icons:** Lucide React

## 🌊 Website Flow
1. **The Gateway:** Landing page showcasing the bioluminescent aesthetic and core mission.
2. **Neural Uplink (Onboarding):** Users connect their Web3 wallet and sync their GitHub/Competitive Programming handles.
3. **The Mirror (Profile):** A high-fidelity "Digital Organism" view where users manage their social links and identity.
4. **The Dashboard:** The heart of the app where the 3D EvoTree visualizes commit frequency, algorithm scores, and specialization.
5. **The Crucible:** An AI-fueled testing arena where developers prove their mastery in 8 specific subjects (React, Solidity, Rust, etc.) to earn on-chain Relics.
6. **Minting:** Successful trials allow users to mint soulbound certificates that permanently attach to their digital tree.

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/NayanG-45/EvoTree.git
cd EvoTree
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in `packages/frontend` (if required for Supabase/API keys):
```env
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_KEY
# Add other keys as found in the project documentation
```

### 4. Run the development server
```bash
# To run the entire workspace
npm run dev

# Or navigate to the frontend specifically
cd packages/frontend
npm run dev
```

### 5. Access the Interface
Open [http://localhost:3000](http://localhost:3000) in your browser to begin your evolution.

---

**Built with 💚 for Hackofiesta 7.0**
*Evolve your identity. Grow your forest.*
