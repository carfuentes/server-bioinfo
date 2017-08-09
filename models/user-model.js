'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The username is required']
  },
  username: {
    type: String,
    required: [true, 'The username is required']
  },

  password: {
    type: String,
    required: [true, 'The password is required']
  },

  image: {
    type: String,
    default:""
  },

  links: {
    github: { type: String, default:"usergit" },
    twitter: { type: String, default:"usertwitter" },

  },

  role: { //HAY QUE HACER UN SISTEMA DE ADMIN
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  workflows: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Workflow'
    }],

  conversations: [{ 
     type: Schema.Types.ObjectId, ref: 'Conversation' 
    }]
  
},

{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
