import mongoose from "mongoose";

// src/lib/db/models/Session.ts
const SessionSchema = new mongoose.Schema(
  {
    // IDs
    appSessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    borrowerAddress: {
      type: String,
      required: true,
      index: true, // Find all sessions by user
    },
    apiKeyId: {
      type: String,
      required: true,
      index: true, // Find all sessions using a specific key
    },
    lenderAddress: String, // Denormalized for faster queries
    signature: { require: true, type: String },
    lender_apiKey:{type: String,require: true},

    // 💰 FINANCIAL TRACKING
    // financial: {
    //   budgetAllocated: { type: Number, required: true },  // How much user put in ($10)
    //   amountSpent: { type: Number, default: 0 },          // How much used so far ($3.50)
    //   platformFee: { type: Number, default: 0 },          // Our cut (10% = $0.35)
    //   lenderEarnings: { type: Number, default: 0 },       // What lender gets ($3.15)
    //   remainingBalance: { type: Number, required: true }   // What's left ($6.50)
    // },
    keyAuth:{
      privateKey: {type: String},
      jwt_auth:{type:String},
      proxyAddress:{type:String},
      exp_time:{type:String},
      isBlackList:{type: Boolean,default:false}
    },

    // 📊 USAGE TRACKING
    usage: {
      totalCalls: { type: Number, default: 0 },
      successfulCalls: { type: Number, default: 0 },
      failedCalls: { type: Number, default: 0 },
      totalTokensUsed: { type: Number, default: 0 },

      // 📈 PERFORMANCE METRICS
      averageResponseTime: { type: Number, default: 0 },
      fastestResponse: { type: Number, default: 0 },
      slowestResponse: { type: Number, default: 0 },


      // 📝 CALL LOG (For analytics)
      callHistory: [
        {
          timestamp: Date,
          cost: Number,
          tokens: Number,
          responseTime: Number,
          success: Boolean,
          errorCode: String,
        },
      ],
    },
    ratePerCall: { type: String, required: true },


    // ⏰ TIME TRACKING
    timeline: {
      createdAt: { type: Date, default: Date.now },
      startedAt: Date,
      lastActivity: { type: Date, default: Date.now },
      endedAt: Date,
      durationMinutes: { type: Number, default: 0 },
    },

    // 📱 STATUS & METADATA
    status: {
      type: String,
      enum: ["pending", "active", "paused", "ended", "expired", "cancelled"],
      default: "pending",
      index: true, // Filter active sessions quickly
    },

    provider: String, // Denormalized: 'openai', 'claude'
    model: String, // Denormalized: 'gpt-4', 'claude-3'
    proxyKey: { type: String, required: true },

    // ⚙️ SESSION SETTINGS
    settings: {
      maxDuration: { type: Number, default: 240 }, // 4 hours max
      maxCalls: { type: Number, default: 1000 }, // Call limit
      autoEndOnZeroBalance: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// 🔍 COMPOUND INDEXES FOR COMPLEX QUERIES
SessionSchema.index({ borrowerAddress: 1, status: 1, createdAt: -1 });
SessionSchema.index({ apiKeyId: 1, status: 1 });
SessionSchema.index({ lenderAddress: 1, status: 1, createdAt: -1 });

export default mongoose.models.Session ||
  mongoose.model("Session", SessionSchema);
