const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController.js");

router.get("/", (req, res) => {
  res.redirect("/bookings");
});

router.get("/bookings", bookingController.getBookings);

router.get("/book-room", bookingController.showBookRoomForm);
router.post("/book-room", bookingController.createBooking);

router.get("/update-booking/:id", bookingController.showUpdateBookingForm);
router.post("/update-booking/:id", bookingController.updateBooking);

router.post("/delete-booking/:id", bookingController.deleteBooking);

module.exports = router;