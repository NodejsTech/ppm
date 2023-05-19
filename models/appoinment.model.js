const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: {
    type: String,
    // type: Date,
     // required: true,
    },
    time: {
      type: String,
      // required: true,
    },
    flatNo: {
      type: String,
      // required: true,
    },
    tower: {
      type: String,
      // required: true,
    },
  });
  
  module.exports = mongoose.model('Appointment', appointmentSchema);    