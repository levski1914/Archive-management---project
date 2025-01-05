const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: String, required: true },
  year: { type: Number, required: true },
  code: { type: String },
  location: {
    shelf: { type: Number, required: true },
    column: { type: Number, required: true },
    row: { type: Number, required: true },
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

module.exports = mongoose.model("Folder", folderSchema);
