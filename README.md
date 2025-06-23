# 🚀 FundingPips Stock Tracker

A modern, real-time stock tracking application built with Next.js 15, React 19, and TypeScript. Features live price updates, interactive charts, and personalized watchlists.



## ✨ Features

### Core Features
- 🔍 **Smart Stock Search** - Search stocks by symbol or company name with debounced input
- 📈 **Real-time Price Updates** - Live price tracking with 30-second polling intervals
- ⭐ **Personal Watchlist** - Add/remove stocks with persistent local storage
- 📊 **Interactive Charts** - Historical price data with multiple timeframes (1D, 1W, 1M, 3M, 1Y)
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 
### Advanced Features
- 🏗️ **Server-Side Rendering** - SEO-optimized with Next.js RSC
- ⚡ **Real-time Updates** - Automatic price refreshing for watchlist stocks
- 🎯 **Market Overview** - Major indices (S&P 500, NASDAQ, Dow Jones) on homepage
- 🔄 **Graceful Fallbacks** - Mock data system when API is unavailable
- 🚀 **Performance Optimized** - ISR, caching, and code splitting
- 🛡️ **Error Handling** - Comprehensive error boundaries and retry logic

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **UI Components:** shadcn/ui
- **Icons:** Lucide React

### State Management
- **Global State:** Zustand with persistence
- **Server State:** Custom hooks with caching
- **Local Storage:** Automatic watchlist persistence

### API & Data
- **Stock API:** Alpha Vantage (with mock fallback)
- **Caching:** Next.js built-in caching (5-minute revalidation)
- **Real-time:** Polling-based updates (30-second intervals)

### Development
- **Package Manager:** npm
- **Linting:** ESLint with Next.js config
- **Type Checking:** Strict TypeScript
- **Testing:** Jest + React Testing Library (optional)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Alpha Vantage API key (optional - app works with mock data)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/fundingpips-stock-tracker.git
   cd fundingpips-stock-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit \`.env.local\` and add your Alpha Vantage API key:
   \`\`\`
   NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)


## 🔐 Environment Variables


\`\`\`env
# Alpha Vantage API Key (optional)
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_api_key_here



**Note:** The app includes a comprehensive mock data system, so it works fully without an API key for development and testing.

## 🌐 API Integration

### Alpha Vantage Integration
The app integrates with Alpha Vantage API for real stock data:

- **Stock Quotes:** Real-time price data
- **Search:** Company and symbol search
- **Historical Data:** Price history for charts
- **Rate Limiting:** Built-in retry logic with exponential backoff

### Mock Data System
Comprehensive fallback system provides:
- Realistic stock prices with volatility
- Popular stock symbols (AAPL, GOOGL, MSFT, etc.)
- Historical data generation
- Search functionality


## 📊 Key Features Demo

### 1. Stock Search
- Type "AAPL" or "Apple" in the search bar
- See real-time search suggestions
- Click to navigate to stock details

### 2. Watchlist Management
- Add stocks to your personal watchlist
- See real-time price updates every 30 seconds
- Remove stocks with one click

### 3. Stock Details
- View comprehensive stock information
- Interactive charts with multiple timeframes
- Add/remove from watchlist

### 4. Market Overview
- Major indices on homepage
- Real-time price updates
- Trend indicators


## 🐛 Known Issues

- **Rate Limiting:** Alpha Vantage free tier has 5 calls/minute limit
- **Real-time Data:** 15-20 minute delay on free tier
- **Historical Data:** Limited to daily resolution on free tier

**Workarounds:** The app includes comprehensive mock data that provides full functionality for development and testing.


## 🙏 Acknowledgments

- **Alpha Vantage** for providing stock market API
- **Vercel** for hosting and deployment platform
- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **Next.js Team** for the amazing framework


