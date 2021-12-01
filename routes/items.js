const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const Category = require('../models/category');

// Multer
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

//items routes
router.get('/', function(req, res, next) {

  Item.find({}).populate('category').exec(function(err, items) {
    if(err) {
    console.error(err);
    } else {
      res.render('items', { items: items });
    }
});

});

router.get('/create', function(req, res, next) {

  Category.find({}).exec(function(err, categories){
    if(err) {
      console.error(err)
    } else {
      res.render('item-create', { categories: categories });
    }
  })
});

router.post('/create', upload.single('file'), (req, res, next) => {

  if(req.file) {
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      url: req.file.filename
    });
    newItem.save(function(err, user) {
      if(err) console.log(err);
      return res.redirect('/');
    });
  } else {
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
    });
    newItem.save(function(err, user) {
      if(err) console.log(err);
      return res.redirect('/');
    });
  }
});


router.get('/:id/delete', function(req, res, next) {
  const id = req.params.id;
 res.render('admin', {id: id, route: "items" });
});


router.post('/:id/delete', async (req, res, next) => {
  if(req.body.admincode === 'delete'){
    
    const foundItem = await Item.findByIdAndDelete(req.params.id);
    const filepath = `./public/images/${foundItem.url}`;

    fs.unlink(filepath, err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`\nDeleted file: ${foundItem.url}`);
      }})

    res.redirect("/");
  } else {
    res.redirect(`items/${req.params.id}/delete`)
  }
  
});

/* Adding a password page - requires a new route and moving code to deeper route level  */

router.get('/:id/update', async function(req, res, next) {
  /*
  const item = req.params.id;
  
  await Category.find({}).exec(function(err, categories) { 
    if(err) {
    console.error(err);
    } else {
      res.render('update', {route: "items", item: item, categories: categories })
    }
});
*/
  res.render('admin-update', {route: "items", item: req.params.id})
});

router.post('/:id/update', async function(req, res, next) {
    /*
    const updatedItem = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      _id: req.params.id
    }) 

    Item.findByIdAndUpdate(req.params.id, updatedItem, {}, function(err,item){
      if(err) {
        console.error(err)
      }
      res.redirect('/')
    })
    */
    
    if(req.body.admincode === 'update'){
      await Category.find({}).exec(function(err, categories) { 
        if(err) {
        console.error(err);
        } else {
          res.render('update', {route: "items", item: req.params.id, categories: categories })
        }
    });

    }else {
      res.redirect(`/items`)
    }
    
});

/* change update view route to match below */

router.post('/:id/update/valid', async function (req, res, next) {

  // Since default image is set, have to get and save original image
  const previousItem = await Item.findById(req.params.id);
  //console.log(previousItem.url) save to new Item
  
  const updatedItem = new Item({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category,
    _id: req.params.id,
    url: previousItem.url
  }) 

  Item.findByIdAndUpdate(req.params.id, updatedItem, {}, function(err,item){
    if(err) {
      console.error(err)
    }
    res.redirect('/')
  })
})


router.get('/:id', (req, res, next) => {

  Item.findById(req.params.id).populate('category').exec(function(err, item) { 
    if(err) {
    console.error(err);
    } else {
      res.render('item', { item: item });
    }

  })
});

module.exports = router;