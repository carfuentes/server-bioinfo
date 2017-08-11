const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Workflow = require('../models/workflow-model');
const Comment = require('../models/comment-model');


router.post('/workflows/:id/comments', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const theComment = new Comment({
    title: req.body.title,
    creator: {
      id:req.user._id,
      username:req.user.username
    },
    text : req.body.text,
    workflow:req.params.id
  });


  theComment.save((err, comment) => {
    if (err) {
      res.json(err);
      return;
    }

    Workflow.findById(req.params.id, (err, theWorkFlow) => {
      if (err) {
        res.json(err);
        return;
      }
            
      theWorkFlow.comments.push(comment);
    
      theWorkFlow.save((err)=> {
       if (err) {
          res.json(err);
          return;
          }
       
       res.json({
        message: 'New Comment added to the workflow!',
        id: comment._id
      
        });

      })
    
    });
  });
});

router.get('/comments', (req, res) => {

  Comment.find({"creator.id": req.user._id}, (err, commentList) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(commentList);
    });
});

//BORRAR COMENTARIO

//UPDATE COMENTARIO

module.exports = router;