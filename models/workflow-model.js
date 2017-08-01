'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const workFlowSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'The workflow brand is required']
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref:"User",
    required: [true, 'The workflow name is required']
  },

  file: {
    type: String, 
    required: [true, 'The workflow file is required']
  },

  languages: {
    type: Array,
    required: [true, 'The workflow language is required']
  },

  categories: {
    type: Array, 
    required: [true, 'The workflow category is required']

  },

  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],

  state: { //HAY QUE PONERLO POR DEFECTO COMO IN COURSE
    type:String,
    enum:["Approved", "In course"],
    default:"In course"
  }

},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Workflow = mongoose.model('Workflow', workFlowSchema);

module.exports = Workflow;
