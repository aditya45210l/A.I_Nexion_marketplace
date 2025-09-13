// src/lib/db/models/APIKey.ts
import mongoose from 'mongoose';

const APIKeySchema = new mongoose.Schema({
  // Basic Info
  // id: { type: String, required: true, unique: true },
  // lenderAddress: { 
  //   type: String, 
  //   required: true,
  //   index: true  // To quickly find all keys by a lender
  // },
  provider: { 
    type: String, 
    enum: ['openai', 'claude', 'gemini', 'grok', 'perplexity'],
    required: true,
    index: true  // To filter keys by provider
  },
  model:{ type: String, required:true },// 'gpt-4', 'claude-3-sonnet', etc.
  
  // 🔐 SECURITY
  encryptedKey: { type: String, required: true },  // The encrypted API key
  // keyHash: String,  // Hash for verification (never store plain key)
  
  // 💰 PRICING
  pricing: {
    ratePerCall: { type: Number, required: true },
    // currency: { type: String, default: 'USD' },
    // minimumSpend: { type: Number, default: 1 }  // Minimum session amount
  },
  
  // ⚙️ SETTINGS
  settings: {
    isActive: { type: Boolean, default: true },
    maxDailyUsage: { type: Number, default: 4 },
    // maxConcurrentSessions: { type: Number, default: 5 },
    autoDisableOnLimit: { type: Boolean, default: true }
  },
  
  // 📊 REAL-TIME STATS (Updated with every use)
  currentStats: {
    activeSessions: { type: Number, default: 0 },     // How many people using right now
    todaysCalls: { type: Number, default: 0 },        // Calls made today
    todaysEarnings: { type: Number, default: 0 },     // Earnings today
    lastUsed: Date                                    // When was it last used
  },
  
  // 📈 HISTORICAL ANALYTICS
  analytics: {
    totalCallsAllTime: { type: Number, default: 0 },
    totalEarningsAllTime: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 },  // In milliseconds
    successRate: { type: Number, default: 100 },        // Percentage
    popularModels: [String],                            // Which models used most
    
    // 📊 DAILY BREAKDOWN (For Charts)
    dailyStats: [{
      date: String,         // "2024-01-15"
      calls: Number,        // Calls made this day
      earnings: Number,     // Money earned this day
      avgResponseTime: Number,
      errors: Number        // Failed calls
    }],
    
    // 👥 USER BEHAVIOR
    // uniqueUsers: { type: Number, default: 0 },         // How many different people used it
    // repeatCustomers: { type: Number, default: 0 },     // People who used it multiple times
    // averageSessionLength: { type: Number, default: 0 }  // In minutes
  },
  
  // 🏆 REPUTATION
  // reputation: {
  //   rating: { type: Number, default: 5.0 },
  //   totalReviews: { type: Number, default: 0 },
  //   featured: { type: Boolean, default: false },
  //   verified: { type: Boolean, default: false }
  // }
}, { timestamps: true });

// 🔍 INDEXES FOR FAST QUERIES
// APIKeySchema.index({ lenderAddress: 1, 'settings.isActive': 1 });
// APIKeySchema.index({ provider: 1, 'settings.isActive': 1 });
// APIKeySchema.index({ 'reputation.rating': -1 }); // Sort by best rating

export default mongoose.models.APIKey || mongoose.model('APIKey', APIKeySchema);