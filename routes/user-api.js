const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Workflow = require('../models/workflow-model');
const User = require('../models/user-model');

router.get('/user/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }


  User.findById(req.params.id, (err, theUser) => {
      if (err) {
        res.json(err);
        return;
      }
       res.json(theUser);

      })


});

router.get('/profile', (req, res) => {

  User.findById(req.user._id, (err, theUser) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(theUser);
    });
});


module.exports = router;