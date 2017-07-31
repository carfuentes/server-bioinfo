'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'The title is required']
  },

  text: {
    type: String,
    required: [true, 'The text is required']
  },

  creator: {
     type: Schema.Types.ObjectId, 
     ref: 'User', 
     required: [true, 'The creator is required']
  },

  workflow: {
     type: Schema.Types.ObjectId, 
     ref: 'Workflow', 
     required: [true, 'The workflow is required']
  },

},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;