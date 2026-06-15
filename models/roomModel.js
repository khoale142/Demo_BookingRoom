const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
  roomNumber: { type: String, unique: true, required: true },
  capacity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "occupied", "maintenance"],
    default: "available",
  },
  pricePerHour: { type: Number, required: true },
  features: { type: [String], default: []},
});

module.exports = mongoose.model("Room", roomSchema);
