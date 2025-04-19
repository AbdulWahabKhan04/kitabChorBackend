const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const instituteRoutes = require("./routes/instituteRoutes");


dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/institutes", instituteRoutes);


// DB & Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(4000, () => console.log("Server running on port", process.env.PORT));
  })
  .catch(err => console.log(err));
