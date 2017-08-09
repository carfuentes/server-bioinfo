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

// router.post('/send', (req, res) => {
//   let userId= req.body.userId
//   let ContentMessage= {
//     date: new Date(),
//     subject:req.body.subject,
//     text:req.body.text
//   }

//   User.findById(userId).
//   populate("messages").
//   exec((err, theUser) => {
//       if (err) {
//         res.json(err);
//         return;
//       } 

//       theUser.messages.forEach((conversation)=> {
//         console.log(conversation.user)
//         console.log(req.user._id, "rq")
//         if(conversation.user===String(req.user._id)) {
//           console.log("entra");
//           conversation.message.push(ContentMessage)
//           theUser.save((err)=> {
//                         if (err) {
//                             res.json(err);
//                             return;
//                         }
//                         res.json(theUser, conversation)
//                         return;
//                         })
    
//         } 
//         return;
//       })

//       theUser.messages.push( {
//           user:req.user._id,
//           message: ContentMessage
//         })

//         theUser.save((err)=> {
//                         if (err) {
//                             res.json(err);
//                             return;
//                         }
//                         res.json(theUser)
//                         return;
//                         })
    
//         });


// });



module.exports = router;