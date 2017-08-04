const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Category = require('../models/category-model');

function convertToHierarchy(arry) { 

    var nodeObjects = createStructure(arry);

    for (var i = nodeObjects.length - 1; i >= 0; i--) {
        var currentNode = nodeObjects[i];

        //Skip over root node.
        if (currentNode.element.parent == "/") {
            continue;
        }

        var parent = getParent(currentNode, nodeObjects);

        if (parent == null) {
            continue;
        }

        parent.children.push(currentNode);
        nodeObjects.splice(i, 1);
    }

    //What remains in nodeObjects will be the root nodes.
    return nodeObjects;
}

function createStructure(nodes) {
    var objects = [];

    for (var i = 0; i < nodes.length; i++) {
        objects.push({ text: nodes[i].name, value: nodes[i].name, element: nodes[i], children: [] });
    }

    return objects;
}

function getParent(child, nodes) {
    var parent = null;

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].element.name == child.element.parent) {
            return nodes[i];
        }
    }

    return parent;
}
//

///GET THE CATEGORIES FOR DISPLAY

router.get('/categories', (req, res, next) => {
 
  Category.find({}, null, {sort: {path: 1}}, function(err, docs) {
    if (err) {
      res.json(err);
      return;
    }
    
    res.json(convertToHierarchy(docs))
      
    })
});

////THE ROOTS
router.get('/categorie/root', (req, res, next) => {
  Category.find({parent:"/"},(err, categoryChildren) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(categoryChildren);
  });
});



////THE SUBTREES
router.get('/categories/:catname', (req, res, next) => {
  const catName=req.params.catname;

  Category.findOne({name:catName},(err, categoryParent) => {
    if (err) {
      res.json(err);
      return;
    }

    Category.find({parent: categoryParent.name},(err, categoryChildren) => {
    if (err) {
      res.json(err);
      return;
    }
   
    res.json(categoryChildren)
    
    
    });
  });
});


///GET THE WORKFLOWS FOR A NODE CATEGORY 
router.get('/categories/:catname/workflows', (req, res) => {

  Category.findOne({name:req.params.catname}).
  populate({
    path:"workflows",
    match:{state: {$eq: "Approved"}}
  }).
  exec((err, theCategory) => {
      if (err) {
        res.json(err);
        return;
      }
      res.json(theCategory.workflows);
    });
});


//MODIFY CATEGORIES (ADMINS)


//SEE CATEGORIES THAT I ADMIN
router.get('/admin/:admin/categories', (req, res, next) => {
  Category.find({admin:req.params.admin, "workflows.0": {$exists: true} },(err, categoryChildren) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(categoryChildren);
  });
});


//ADD A CATEGORY
router.post('/categories', (req, res, next) => {

  let name= req.body.name
  let parent= req.body.parent
  let admin=req.user._id;
 
  Category.findOne({name}, 'name', (err, foundCategory) => {
    if (foundCategory) {
      res.status(400).json({ message: 'The category already exists' });
      return;
    }

    Category.findOne({name:parent}, (err,categoryParent)=> {
      if (err) {
        res.json(err);
        return;
      }

       const theCategory = new Category({
         name: name,
         parent: parent,
         admin:admin,
         path: categoryParent.path+"/"+name
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
    
        })

    });
  });

});


//DELETE A CATEGORY
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


//UPDATE CATEGORY


//SEE WORKFLOWS IN COURSE BY CATEGORY

router.get('/categories/:catname/workflows', (req, res) => {

  Category.findOne({name:req.params.catname}).
  populate({
    path:"workflows",
    match:{state: {$eq: "In course"}}
  }).
  exec((err, theCategory) => {
      if (err) {
        res.json(err);
        return;
      }
      res.json(theCategory.workflows);
    });
});



module.exports = router;