const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bioinfo');

const Category = require('../models/category-model');

const categories = [
  {
    name:  'Computational-System-Biology',
    path: "/Computational-System-Biology",
    parent:"/",
    children:true,

},
{
    name:  'Gene-networks',
    path:"/Computational-System-Biology/Gene-networks",
    parent:"Computational-System-Biology",
    children:false,
  
},
{
    name:  'Complex Networks',
    path:"/Computational-System-Biology/Complex-networks",
    parent:"Computational-System-Biology",
    children:false,

},
 {
    name:  'Transcriptomics',
    path: "/Transcriptomics",
    parent:"/",
    children:true,


},
{
    name:  'RNA-seq',
    path:"/Transcriptomics/RNA-seq",
    parent:"Transcriptomics",
    children:false,
 
},
{
    name:  'Microarrays',
    path:"/Transcriptomics/Microarray",
    parent:"Transcriptomics",
    children:true,
},
{
    name:  'SNP-microarray',
    path:"/Transcriptomics/Microarrays/SNP-microarray",
    parent:"Microarrays",
    children:false,


},
{
    name:  'Gene-expression-microarray',
    path:"/Transcriptomics/Microarrays/Gene-expression-microarray",
    parent:"Microarrays",
    children:true,


}
]

Category.create(categories, (err, docs) => {
  if (err) {
    throw err;
  }

  docs.forEach((category) => {
    console.log(category.name)
  });
  mongoose.connection.close();
});