'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const conversationSchema = new mongoose.Schema({

   admin: {
    type: Schema.Types.ObjectId,  ref: 'User', required: [true, 'The admin is required']
   }, 
    
    user: {
    type: Schema.Types.ObjectId,  ref: 'User', required: [true, 'The user is required']
   }, 

    workflow: {
    type: Schema.Types.ObjectId,  ref: 'Workflow', required: [true, 'The workflow is required']
   }, 
   
   messages: [{
      creator: {
                  id: {type: Schema.Types.ObjectId,  ref: 'User', required: [true, 'The creator is required']  }, 
                  username: { type:String, required: [true, 'The creator is required']  }
      },
      date: Date,
      title: String,
      text: String
    }] 

},  
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;