'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const userSchema = new Schema({
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
  links: [
    { github: String },
    { twitter: String },
    { google: String }

  ],
  role: { //HAY QUE HACER UN SISTEMA DE ADMIN
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  workflows: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Workflow', 
      default:null 
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
