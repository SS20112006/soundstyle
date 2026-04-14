<div align="center">
  <br />
  <h1>🎵👔 SoundStyle</h1>
  <p><strong>Transform your Spotify music taste into fashion recommendations</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#demo">Demo</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-integrations">APIs</a> •
    <a href="#contributing">Contributing</a>
  </p>
  <br />
</div>

---

## 🎯 About

**SoundStyle** is an AI-powered platform that analyzes your Spotify listening habits and translates them into personalized fashion recommendations. It bridges the gap between music identity and personal style.

### How it works:
1. **Connect your Spotify** - We analyze your top artists, tracks, and genres
2. **AI Style Analysis** - Your music's energy, valence, and danceability are mapped to fashion aesthetics
3. **Get Recommendations** - Receive complete outfit suggestions with direct links to buy

---

## ✨ Features

### 🎵 Spotify Integration
- OAuth2 secure login
- Top Artists, Tracks, and Recently Played analysis
- Deep audio metadata (Energy, Valence, Danceability, Acousticness)
- Playlist-specific style generation

### 🤖 AI Fashion Engine
- **Style Mapper**: Converts music mood → fashion aesthetic (10+ styles)
- **GPT-4o Integration**: Generates personalized outfit recommendations
- **Gemini Vision**: Analyzes photos of your own clothes
- **Mix & Match**: Suggests pieces that combine with your existing wardrobe

### 👔 Virtual Closet
- Upload photos of your clothes
- AI auto-tags style, colors, and category
- Smart matching with recommended looks

### 🎨 Visual Features
- Dynamic color palettes generated from your music mood
- Style tags (aesthetic, mood, era, cultural)
- Album & Artist-inspired look exploration
- Shareable "My Spotify Style" cards for Instagram

### 🛒 E-Commerce Ready
- Affiliate links to 11+ stores (Zara, H&M, Nike, ASOS, etc.)
- Budget-aware recommendations (€ / €€ / €€€)
- Style-to-store matching
- Deep links for mobile apps

---

## 🚀 Demo

### Landing Page
![Landing Page](https://placeholder-for-screenshot.png)

### Dashboard
![Dashboard](https://placeholder-for-screenshot.png)

### Style Card
![Style Card](https://placeholder-for-screenshot.png)

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **State** | Zustand |
| **Database** | Supabase / PostgreSQL |
| **Image Storage** | Cloudinary |
| **AI - Style** | OpenAI GPT-4o |
| **AI - Vision** | Google Gemini 1.5 Flash |
| **Music API** | Spotify Web API |
| **Deployment** | Vercel |

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Spotify Developer Account
- OpenAI API Key
- Google Gemini API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/SS20112006/soundstyle.git
cd soundstyle

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Spotify API
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/spotify/callback

# OpenAI
OPENAI_API_KEY=sk-your-key

# Google Gemini
GEMINI_API_KEY=your-key

# Supabase (optional - for persistence)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Cloudinary (optional - for image storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Integrations

### Spotify Web API
- **Auth**: OAuth2 with PKCE
- **Scopes**: `user-read-private`, `user-top-read`, `user-read-recently-played`, `playlist-read-private`
- **Data**: Top artists, tracks, audio features, playlists

### OpenAI GPT-4o
- Style reasoning and outfit generation
- Shareable description generation
- Closet item matching

### Google Gemini 1.5 Flash
- Clothing image recognition
- Color extraction
- Style tag generation
- Image validation

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/spotify/      # OAuth flow
│   │   ├── spotify/           # Spotify data endpoints
│   │   └── style/             # AI style generation
│   ├── dashboard/             # Main app page
│   └── page.tsx               # Landing page
├── components/
│   ├── AlbumView.tsx          # Album-based exploration
│   ├── ArtistView.tsx         # Artist-based exploration
│   ├── ClosetUpload.tsx       # Photo upload + AI analysis
│   ├── ColorPaletteDisplay.tsx
│   ├── MoodDisplay.tsx        # Audio feature visualization
│   ├── OutfitCard.tsx         # Outfit recommendation card
│   ├── ProductCard.tsx        # E-commerce product card
│   ├── SocialShare.tsx        # Social sharing modal
│   ├── StyleCardDownload.tsx  # Instagram-style card generator
│   └── ...
├── lib/
│   ├── spotify.ts             # Spotify API helpers
│   ├── styleMapper.ts         # Music → Fashion mapping
│   ├── fashionAI.ts           # OpenAI integration
│   ├── visionAI.ts            # Gemini Vision integration
│   └── affiliateLinks.ts      # Store links & pricing
├── stores/
│   ├── appStore.ts            # Global app state
│   └── closetStore.ts         # Virtual closet state
└── types/
    └── index.ts               # TypeScript definitions
```

---

## 🗺 Roadmap

### ✅ Phase 1: Setup & Data
- [x] Next.js project setup
- [x] Spotify OAuth2 with PKCE
- [x] Audio feature extraction

### ✅ Phase 2: AI Fashion Brain
- [x] Style Mapper (10+ aesthetics)
- [x] GPT-4o outfit generation
- [x] Gemini Vision for closet
- [x] Style tag system

### ✅ Phase 3: Visual & E-commerce
- [x] Product cards with pricing
- [x] Album/Artist views
- [x] Affiliate link system
- [x] Social sharing

### ✅ Phase 4: Polish & Launch
- [x] Mobile optimization
- [x] Style card generator
- [x] Vercel deployment ready

### 🔮 Future Features
- [ ] Supabase integration for user persistence
- [ ] Cloudinary for closet image storage
- [ ] Community looks & trending styles
- [ ] Spotify Wrapped-style yearly report
- [ ] AR try-on feature
- [ ] Multi-platform music (Apple Music, YouTube Music)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Simão Sousa**
- GitHub: [@SS20112006](https://github.com/SS20112006)

---

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [OpenAI](https://openai.com/)
- [Google Gemini](https://ai.google.dev/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">
  <p>Made with 🎵 and 👔</p>
  <p>SoundStyle © 2024</p>
</div>
