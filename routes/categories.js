const express = require('express');
const router = express.Router();
const Category = require('../models/category');

//categories routes
router.get('/', function(req, res, next) {

  Category.find({}).exec(function(err, categories) {
    if(err) {
    console.error(err);
    } else {
      res.render('categories', { categories: categories });
    }
  });

});

router.get('/create', function(req, res, next) {
  res.render('category-create', { title: 'Create Category' });
});

router.post('/create', (req, res, next) => {
  const newCategory = new Category({
    name: req.body.name,
    description: req.body.description,
  });

  newCategory.save(function(err, user) {
      if(err) console.log(err);
      return res.redirect('/categories');
    });
});

router.get('/:id/delete', function(req, res, next) {
  const id = req.params.id;
 res.render('admin', {id: id, route: "categories" });
});


router.post('/:id/delete', async (req, res, next) => {
  if(req.body.admincode === 'delete'){
    const foundCategory = await Category.findByIdAndDelete(req.params.id);
    res.redirect("/categories");
  } else {
    res.redirect(`categories/${req.params.id}/delete`)
  }
  
});

/* Adding a password page - requires a new route and moving code to deeper route level  */

router.get('/:id/update', async function(req, res, next) {
  /*
  await Category.find({}).exec(function(err, categories) { 
    if(err) {
    console.error(err);
    } else {
      res.render('update-category', {route: "categories", item: req.params.id,  categories: categories })
    }
});
*/
  res.render('admin-update', {route: "categories", item: req.params.id})

});

router.post('/:id/update', function(req, res, next) {
  /*
    const updatedCategory = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    })

    Category.findByIdAndUpdate(req.params.id, updatedCategory, {}, function(err,item){
      if(err) {
        console.error(err)
      }
      res.redirect('/categories')
    })
    */
   if(req.body.admincode === 'update'){
    res.render('update-category', {route: "categories", item: req.params.id})
   } else {
     res.redirect(`/categories/${req.params.id}`)
   }
   
});

router.post('/:id/update/valid', function(req,res,next){
  const updatedCategory = new Category({
    name: req.body.name,
    description: req.body.description,
    _id: req.params.id
  })

  Category.findByIdAndUpdate(req.params.id, updatedCategory, {}, function(err,item){
    if(err) {
      console.error(err)
    }
    res.redirect('/categories')
  })
})

router.get('/:id', async (req, res, next) => {

  Category.findById(req.params.id).exec(function(err, category) { 
    if(err) {
    console.error(err);
    } else {
      res.render('category', { category: category });
    }

  })


});

module.exports = router;