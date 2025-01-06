const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reason: String,
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  history: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  isReturned: { type: Boolean, default: false }, // Ново поле
  reminders: [
    {
      sentAt: { type: Date, default: Date.now }, // Дата на напомнянето
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Кой е изпратил
    },
  ],
});

module.exports = mongoose.model("Request", requestSchema);
