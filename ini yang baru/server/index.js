const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");


const app = express();

mongoose.set('strictQuery', true);
// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Error Middleware
app.use(errorHandler);

// Setup socket io
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('USER HAS BEEN CONNECTED', socket.id)

  socket.on('disconnect', () => {
    console.log('USER HAS BEEN DISCONNECTED')
  })

  socket.emit('connectionData', { username: socket.id })

  socket.on('message', (data) => {
    // Broadcast message to all connected user
    io.emit('messageReceived', data)
  })

})

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // app.listen(PORT, () => {
    //   console.log(`Server Running on port ${PORT}`);
    // });
    httpServer.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
