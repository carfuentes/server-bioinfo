const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const upload = require('../config/multer');

const Workflow = require('../models/workflow-model');
const User = require('../models/user-model');
const Category = require('../models/category-model');


//GET USER WORKFLOWS


router.get('/workflows/user/:id/notapproved', (req, res, next) => {
  Workflow.find({"creator.id":req.params.id, state: "In course"},(err, workflowsList) => {
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
    description:req.body.description,
    creator: {
      id:req.user._id,
      username:req.user.username 
    },
    
    languages : req.body.languages,
    file: req.body.file,
    category:req.body.category
  });

  theWorkFlow.save((err,workflow) => {
    if (err) {
      res.json(err);
      return;

    }

    Category.findOneAndUpdate({name:req.body.category}, {$push: {workflows:workflow._id}}, { 'new': true}, (err, category) => {
      if (err) {
        res.json(err);
        return;
      }
      console.log(category)
        
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

router.put('/workflows/:id/update', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  //SE TIENEN QUE RELLENAR TODOS SINO SE QUEDA NULL
  const updates ={
    title: req.body.title,
    description:req.body.description,
    languages : req.body.languages,
    file: req.body.file,
    category:req.body.category
  };

  console.log(req.params.id)
  Workflow.findByIdAndUpdate(req.params.id, updates, (err, workflow) => {
    if (err) {
      res.json(err);
      return;
    } 
    Category.findOneAndUpdate({name:workflow.category}, {$pull: {workflows:workflow._id}}, { 'new': true}, (err, category) => {
      if (err) {
        res.json(err);
        return;
      }

      Category.findOneAndUpdate({name:req.body.category}, {$push: {workflows:workflow._id}}, { 'new': true}, (err, category) => {
      if (err) {
        res.json(err);
        return;
      }
  
        res.json({
          message: 'Workflow updated successfully',
          workflow:workflow
        });
        });
      });
  });
})

router.put('/workflows/:id/approve', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  Workflow.findByIdAndUpdate(req.params.id, {$set: {state:"Approved"}}, {'new':true},(err, workflow) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Workflow updated successfully',
      workflow:workflow
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
