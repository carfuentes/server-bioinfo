'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const categorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'The name is required']
  },
  parent: {
    type: String,
    default:null

  },
  path: {
    type: String,
    default:null
  },
  admin: {
      type: Schema.Types.ObjectId, 
      ref: 'User',
      default:null
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

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;