const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Workflow = require('../models/workflow-model');
const User = require('../models/user-model');
const Category = require('../models/category-model');


//GET USER WORKFLOWS
router.get('/workflows', (req, res, next) => {
  Workflow.find({creator:req.user._id},(err, workflowsList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(workflowsList);
  });
});


router.get('/workflows/approved', (req, res, next) => {
  Workflow.find({creator:req.user._id},{state: "Approved"},(err, workflowsList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(workflowsList);
  });
});

router.get('/workflows/notapproved', (req, res, next) => {
  Workflow.find({creator:req.user._id},{state: "In course"},(err, workflowsList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(workflowsList);
  });
});

router.post('/workflows', (req, res, next) => {
  const theWorkFlow = new Workflow({
    title: req.body.title,
    creator: req.user._id,
    languages : req.body.languages,
    file: req.body.file,
    category:req.body.category
  });

  theWorkFlow.save((err,workflow) => {
    if (err) {
      res.json(err);
      return;

    }

    Category.findOneAndUpdate({name:req.body.category}, {$push: {workflows:workflow._id}}, { 'new': true}, (err, user) => {
      if (err) {
        res.json(err);
        return;
      }
        
       User.findByIdAndUpdate({_id:req.user._id}, {$push: {workflows:workflow._id}}, { 'new': true}, (err, user) => {
          if (err) {
              res.json(err);
              return;
          }
        
          res.json({
            message: 'New Workflow added to the user!',
            id: workflow._id
      
            });
      
        });

    

      })
  });
});

router.get('/workflows/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Workflow.findById(req.params.id).
  populate("creator").
  exec((err, theWorkFlow) => {
      if (err) {
        res.json(err);
        return;
      }
      res.json({ workflow:theWorkFlow, user:theWorkFlow.creator});
    });
});

router.put('/workflows/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  //SE TIENEN QUE RELLENAR TODOS SINO SE QUEDA NULL
  const updates = {
    state: "Approved"
  };

  Workflow.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Workflow updated successfully'
    });
  });
})

router.delete('/workflows/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Workflow.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    User.findByIdAndUpdate({_id:req.user._id}, {$pull: {workflows:req.params.id}}, { 'new': true}, (err, user) => {
      if (err) {
        res.json(err);
        return;
      }

    return res.json({
      message: 'Workflow has been removed!'
    });

    });
  })
});

module.exports = router;
