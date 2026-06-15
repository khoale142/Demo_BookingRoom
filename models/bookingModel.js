const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema({
  customerName: { type: String, required: true},
  roomNumber: { type: String, required: true},
  startTime: { type: Date, required: true},
  endTime: { type: Date, default: null},
  totalAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Booking", bookingSchema);
