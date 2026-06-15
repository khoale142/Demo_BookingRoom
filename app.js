const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/database.js");
const bookingRoutes = require("./routes/bookingRoutes.js");

dotenv.config();

const app = express();

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", bookingRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});