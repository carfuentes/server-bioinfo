const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const upload = require('../config/multer');

const Workflow = require('../models/workflow-model');
const User = require('../models/user-model');
const Category = require('../models/category-model');


router.get('/workflows', (req, res, next) => {
  Workflow.find({creator:req.user._id},(err, workflowsList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(workflowsList);
  });
});


router.get('/workflows/user/:id/approved', (req, res, next) => {
  Workflow.find({"creator.id":req.params.id, state: "Approved"},(err, workflowsList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(workflowsList);
  });
});

router.get('/workflows/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Workflow.findById(req.params.id).
  populate("creator.id").
  exec((err, theWorkFlow) => {
      if (err) {
        res.json(err);
        return;
      }
      res.json({ workflow:theWorkFlow, user:theWorkFlow.creator});
    });
});

router.get('/workflows/:id/comments', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Workflow.findById(req.params.id).
  populate("comments").
  exec((err, theWorkFlow) => {
      if (err) {
        res.json(err);
        return;
      }
       res.json(theWorkFlow.comments);

      })


});


module.exports = router;