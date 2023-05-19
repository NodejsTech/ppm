const router = require('express').Router();

const Appointment = require('../models/appoinment.model')
// To go to home ugem
router.get('/', async(req, res) => { 
    try {
        const appointments = await Appointment.find();
        res.render('home', { appointments });
      } catch (err) {
        console.error('Error retrieving appointments', err);
        res.status(500).send('Internal Server Error');
      }
})


// get the appoinment route submittions for the tenant
router.get('/appointment', (req, res) => { 

    res.render('appointment');
})

// submitting the appointments to ugem
router.post('/appointments', async (req, res) => {
    try {
      const { date, time, name } = req.body;
      const appointment = new Appointment({ date, time, name });
      await appointment.save();
      res.redirect('/appointment');
    } catch (err) {
      console.error('Error creating appointment', err);
      res.status(500).send('Internal Server Error');
    }
  });
  

module.exports = router;