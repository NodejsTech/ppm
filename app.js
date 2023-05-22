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


io.on('connection', (socket) => {
  console.log('Client Connection established')
  socket.emit('messageFromServer', { data: 'Socket io server is rinning' });

  socket.on('delete', async(id) => {
    await Appointment.findByIdAndDelete(id)
    console.log(id, '---------delete')
    io.emit('deleteRow', id)
  })
})
 




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
 


// Function to monitor database changes
function monitorDatabaseChanges() {
  try {
    const changeStream = Appointment.watch();
    // Listen for change events
    changeStream.on("change", (change) => {
      if (change.operationType === 'insert') {
        console.log("Change event:", change);
        io.emit("changeEvent", change);
      } {
        console.log('Data deleted');
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

monitorDatabaseChanges();

// function deletedataandmonitorchanges() {
  
// } 
// deletedataandmonitorchanges () 

// Socket.IO event handling
// io.on("connection", (socket) => {

//   console.log("A client connected mobile", socket.id);

//   socket.on('delete', async(itemId) => {
//     await Appointment.findByIdAndDelete(itemId)
//     const changeStream = Appointment.watch();
//     changeStream.on('change', (change) => { 
//     console.log("chang0----------e",change)
//       io.emit('deleteConfirmation', itemId);
//     })
//   });
// });



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




