const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Category = require('../models/category-model');

router.get('/categories', (req, res, next) => {
  Category.find({state: "Approved"},(err, categoryList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(categoryList);
  });
});

router.post('/categories', (req, res, next) => {
  const theCategory = new Category({
    title: req.body.title,
    creator: req.user._id,
    languages : req.body.languages,
    file: req.body.file,
    categories:req.body.categories
  });

  theCategory.save((err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'New Category created!',
      id: theCategory._id
    });
  });
});

router.get('/categories/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Category.findById(req.params.id, (err, theCategory) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(theCategory);
    });
});

router.put('/categories/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  //SE TIENEN QUE RELLENAR TODOS SINO SE QUEDA NULL
  const updates = {
    state: "Approved"
  };

  Category.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Category updated successfully'
    });
  });
})

router.delete('/categories/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Category.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: 'Category has been removed!'
    });
  })
});

module.exports = router;