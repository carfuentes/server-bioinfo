const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user-model');
const Conversation = require('../models/conversation-model');


router.post('/workflow/:id/send', (req, res) => {
  let user=req.body.creatorId
  let admin=req.user._id

  let message={
            creator: { id:admin, username:req.user.username},
            date: new Date(),
            title:req.body.title,
            text:req.body.text
          }

  let newConver= new Conversation({
      user: user,
      admin: admin,
      workflow:req.params.id,
      messages: [message]

  })

    Conversation.findOne({workflow:req.params.id}, (err,conver)=> {
         if (err) {
            res.json(err);
            return;
        }

        if(conver===null) {
              newConver.save((err,newConver) => {
                    if (err) {
                    res.json(err);
                    return;
                    }

                    User.findByIdAndUpdate(user, {$push: {conversations: newConver._id}},{ 'new': true}, (err, user) => {
                        if (err) {
                            res.json(err);
                            return;
                        }
                            User.findByIdAndUpdate(admin, {$push: {conversations: newConver._id}},{ 'new': true}, (err, admin) => {
                                if (err) {
                                    res.json(err);
                                    return;
                                }

                                res.json({message:`${admin.username} and ${user.username} have started a conver `});
                            });
                        })
                });

            
        
            return
            }
        conver.messages.push(message);
        conver.save((err=> {
            if(err) return res.josn(err);
            res.json(conver);
        }))
    })
  
 
});

router.get('/conversations', (req, res) => {
   Conversation.find({user:req.user._id}, (err, converList) => {
        if (err) {
            res.json(err);
            return;
        }
       res.json(converList)
    });
});

router.get('/admin/conversations', (req, res) => {
    Conversation.find({admin:req.user._id}, (err, converList) => {
        if (err) {
            res.json(err);
            return;
        }
       res.json(converList)
    });
});

router.get('/conversations/:id', (req, res) => {
    Conversation.findById(req.params.id)
                .populate({ path: 'workflow', select: 'title' })
                .populate({ path: 'user', select: 'username' })
                .populate({ path: 'admin', select: 'username' }) 
                .exec((err, conver) => {
                    if (err) {
                        res.json(err);
                        return;
                    }
                    res.json(conver)
    });
});


router.post('/conversations/:id/reply', (req, res) => {
    const newMessage= {
            creator: {
                id: req.user._id,
                username: req.user.username
            },
            date: new Date(),
            title:req.body.title,
            text:req.body.text
      
    }
    Conversation.findByIdAndUpdate(req.params.id, {$push: {messages: newMessage}},{ 'new': true}, (err, conver) => {
        if (err) {
            res.json(err);
            return;
        }
        res.json(conver);
    });
});


module.exports = router;


