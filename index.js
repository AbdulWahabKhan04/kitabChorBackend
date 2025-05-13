const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const instituteRoutes = require("./routes/instituteRoutes");
const orderRoutes = require("./routes/orderRoutes")
const messageRoutes = require("./routes/messageRoutes");
const withdrawls = require("./routes/withdrawls");

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: 'https://www.kitabchor.com', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/institutes", instituteRoutes);
app.use("/api/orders",orderRoutes );
app.use("/api/messages", messageRoutes);
app.use("/api/withdrawls", withdrawls);

// DB & Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => console.log("Server running on port", process.env.PORT));
  })
  .catch(err => console.log(err));
