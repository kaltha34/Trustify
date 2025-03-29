const mongoose = require("mongoose");

const InsightsSchema = new mongoose.Schema({
  verifiedUsers: { type: Number, default: 0 },
  fraudAlerts: { type: Number, default: 0 },
});

module.exports = mongoose.model("Insights", InsightsSchema);
