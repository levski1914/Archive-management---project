const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  history: [
    {
      status: { type: String },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Request", requestSchema);
