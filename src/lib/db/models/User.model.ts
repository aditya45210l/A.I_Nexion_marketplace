// src/lib/db/models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Basic Info
  walletAddress: { 
    type: String, 
    required: true, 
    unique: true,
    index: true  // For fast queries
  },
  
  // Profile Info
  username: String,
  avatar: String,
  joinedAt: { type: Date, default: Date.now },
  
  // 📊 ANALYTICS FIELDS (For Dashboard Charts)
  analytics: {
    // For Lenders
    totalKeysListed: { type: Number, default: 0 },        // How many keys they've added
    activeKeysCount: { type: Number, default: 0 },        // Keys currently active
    totalEarningsAllTime: { type: Number, default: 0 },   // Total money earned
    thisMonthEarnings: { type: Number, default: 0 },      // This month's earnings
    averageKeyRating: { type: Number, default: 0 },       // Avg rating of their keys
    
    // For Borrowers  
    totalSessionsCreated: { type: Number, default: 0 },   // How many times they rented
    activeSessionsCount: { type: Number, default: 0 },    // Currently active rentals
    totalSpentAllTime: { type: Number, default: 0 },      // Total money spent
    thisMonthSpent: { type: Number, default: 0 },         // This month's spending
    favoriteProvider: String,                             // Most used AI provider
    
    // Combined Stats
    totalTransactions: { type: Number, default: 0 },
    successfulTransactions: { type: Number, default: 0 },
    userRating: { type: Number, default: 5.0 },           // Their reputation
    
    // 📈 MONTHLY BREAKDOWN (For Charts)
    monthlyData: [{
      month: String,        // "2024-01"
      earned: Number,       // Money earned this month
      spent: Number,        // Money spent this month
      sessions: Number,     // Sessions this month
      newKeys: Number       // New keys added this month
    }]
  }
}, { 
  timestamps: true  // Adds createdAt and updatedAt automatically
});

export default mongoose.models.User || mongoose.model('User', UserSchema);