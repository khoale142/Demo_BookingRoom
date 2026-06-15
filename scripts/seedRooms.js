require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/roomModel');

async function seedRooms() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/appoinment_db');
    const rooms = [
      { roomNumber: '101', capacity: 6, status: 'available', pricePerHour: 120000, features: ['Small room'] },
      { roomNumber: '102', capacity: 10, status: 'available', pricePerHour: 180000, features: ['Medium room'] },
      { roomNumber: 'VIP1', capacity: 20, status: 'available', pricePerHour: 300000, features: ['VIP room', 'Large screen'] },
    ];

    for (const room of rooms) {
      await Room.updateOne({ roomNumber: room.roomNumber }, { $set: room }, { upsert: true });
    }

    console.log('Seed rooms successfully');
  } catch (error) {
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedRooms();
