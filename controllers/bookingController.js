// controllers/bookingController.js
const Booking = require("../models/bookingModel.js");
const Room = require("../models/roomModel.js");

const calculateTotalAmount = (startTime, endTime, pricePerHour) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const diffMs = end - start;
  const hours = Math.ceil(diffMs / (1000 * 60 * 60));

  return hours * pricePerHour;
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ startTime: -1 });

    return res.render("booking", {
      bookings,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.showBookRoomForm = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });

    return res.render("bookRoom", {
      rooms,
      error: null,
      formData: {},
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { customerName, roomNumber, startTime, endTime } = req.body;

    const rooms = await Room.find().sort({ roomNumber: 1 });

    if (!customerName || !roomNumber || !startTime || !endTime) {
      return res.status(400).render("bookRoom", {
        rooms,
        error: "Please fill in all required fields.",
        formData: req.body,
      });
    }

    const room = await Room.findOne({ roomNumber });

    if (!room) {
      return res.status(404).render("bookRoom", {
        rooms,
        error: "Room does not exist in the system.",
        formData: req.body,
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).render("bookRoom", {
        rooms,
        error: "Invalid start time or end time.",
        formData: req.body,
      });
    }

    if (end <= start) {
      return res.status(400).render("bookRoom", {
        rooms,
        error: "End time must be after start time.",
        formData: req.body,
      });
    }

    const totalAmount = calculateTotalAmount(
      startTime,
      endTime,
      room.pricePerHour
    );

    await Booking.create({
      customerName,
      roomNumber,
      startTime,
      endTime,
      totalAmount,
    });

    return res.redirect("/bookings");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.showUpdateBookingForm = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    const rooms = await Room.find().sort({ roomNumber: 1 });

    return res.render("updateRoom", {
      booking,
      rooms,
      error: null,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { customerName, roomNumber, startTime, endTime } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    const rooms = await Room.find().sort({ roomNumber: 1 });

    if (!customerName || !roomNumber || !startTime || !endTime) {
      return res.status(400).render("updateRoom", {
        booking,
        rooms,
        error: "Please fill in all required fields.",
      });
    }

    const room = await Room.findOne({ roomNumber });

    if (!room) {
      return res.status(404).render("updateRoom", {
        booking,
        rooms,
        error: "Room does not exist in the system.",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).render("updateRoom", {
        booking,
        rooms,
        error: "Invalid start time or end time.",
      });
    }

    if (end <= start) {
      return res.status(400).render("updateRoom", {
        booking,
        rooms,
        error: "End time must be after start time.",
      });
    }

    const totalAmount = calculateTotalAmount(
      startTime,
      endTime,
      room.pricePerHour
    );

    booking.customerName = customerName;
    booking.roomNumber = roomNumber;
    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.totalAmount = totalAmount;

    await booking.save();

    return res.redirect("/bookings");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    await Booking.findByIdAndDelete(req.params.id);

    return res.redirect("/bookings");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};