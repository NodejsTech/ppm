const express = require("express");
const mongoose = require("mongoose");
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
  console.log("A client connected.", socket.id);

  // Listen for the 'formData' event
  socket.on("formData", async (data) => {
    try {
      await Appointment.create(data);
    } catch (error) {
      console.error("Error inserting form data:", error);
    }
  });
});
// Read the WAV file
// const file = fs.readFileSync("./public/sound/noti.wav");



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
  console.log("A client connected");

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
app.post("/appointments", async (req, res) => {
  try {
    const { date, time, name } = req.body;
    const appointment = new Appointment({ date, time, name });
    await appointment.save();
    res.redirect("/appointment");
  } catch (err) {
    console.error("Error creating appointment", err);
    res.status(500).send("Internal Server Error");
  }
});

// const { MongoClient } = require("mongodb");

// const uri = "mongodb://localhost:27017"; // Your MongoDB connection URI
// const client = new MongoClient(uri);

// async function watchDatabaseChanges() {
//   await client.connect();
//   console.log("Connected to MongoDB");

//   const db = client.db("yourDatabaseName"); // Your database name
//   const collection = db.collection("yourCollectionName"); // Your collection name

//   const changeStream = collection.watch();

//   changeStream.on("change", (change) => {
//     console.log("Change event:", change);

//     // Process the change event and access the updated document
//     const updatedDocument = change.fullDocument;
//     console.log("Updated document:", updatedDocument);

//     // Perform any specific actions with the updated document
//     // For example, send a notification or update UI
//   });
// }

// watchDatabaseChanges().catch(console.error);
