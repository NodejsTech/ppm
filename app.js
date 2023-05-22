const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const ejs = require("ejs");
const app = express();
const port = 3000;
const socket = require("socket.io");

// const { MongoClient } = require('mongodb');

const db = require("./config/db");
// const client = new MongoClient('mongodb+srv://api:mohiuddin@cluster0.fbd4k.mongodb.net/api?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

db();

const Appointment = require("./models/appoinment.model");

app.use(morgan('dev'))
app.use(express.static(__dirname + "/public"));

// Set up EJS as the view engine
app.set("view engine", "ejs");

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

const expressServer = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const io = socket(expressServer, {
  cors: {
    origin: "*", // Replace with the appropriate origins or use a list of allowed origins
    methods: ["GET", "POST"], // Allow the desired HTTP methods
    allowedHeaders: ["Content-Type"], // Allow the desired headers
    credentials: true, // Allow credentials (e.g., cookies)
  },
});
// Socket.io connection
io.of("/appointment").on("connection", (socket) => {
  console.log("A client connected......", socket.id);

  // Listen for the 'formData' event
  socket.on("formData", async (data) => {
    try {
      await Appointment.create(data);
    } catch (error) {
      console.error("Error inserting form data:", error);
    }
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  // Handle delete event
  socket.on('delete', (itemId) => {
    // Implement your delete logic here
    // itemId contains the ID of the item to be deleted

    

    // Emit a confirmation event to all connected clients
    io.emit('deleteConfirmation', itemId);
  });
});

 


// Function to monitor database changes
function monitorDatabaseChanges() {
  try {
    const changeStream = Appointment.watch();
    // Listen for change events
    changeStream.on("change", (change) => {
      console.log("Change event:", change);
      // Play notification sound
      // Play the audio file
      io.emit("changeEvent", change);
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

monitorDatabaseChanges();

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log("A client connected mobile", socket.id );

  // Handle client disconnection
  // socket.on('disconnect', () => {
  //   console.log('A client disconnected');
  // });
});

app.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.render("home", { appointments });
  } catch (err) {
    console.error("Error retrieving appointments", err);
    res.status(500).send("Internal Server Error");
  }
});

// get the appoinment route submittions for the tenant
app.get("/appointment", (req, res) => {
  res.render("appointment");
});

// submitting the appointments to ugem
// app.post("/appointments", async (req, res) => {
//   try {
//     const { date, time, name } = req.body;
//     const appointment = new Appointment({ date, time, name });
//     await appointment.save();
//     res.redirect("/appointment");
//   } catch (err) {
//     console.error("Error creating appointment", err);
//     res.status(500).send("Internal Server Error");
//   }
// });



