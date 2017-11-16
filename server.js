const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/dashboard');
mongoose.Promise = global.Promise;
// mongoose module
var mongoose = require('mongoose');
var AnimalSchema = new mongoose.Schema({
  name: { type: String },
  weight: { type: Number },
  color: { type: String }
}, {timestamps: true});

const Animal = mongoose.model('Animal', AnimalSchema);

// Home Page Render
app.get('/mongooses', function(req, res) {
  res.render('new');
})

// render all animals
app.get('/', function(req, res) {
  Animal.find({}, function(err, allAnimals) {
   if (err) {
     console.log('no animal');
     res.redirect('/');
   }
   else {
     console.log('all animal', allAnimals);
     res.render('index', {allAnimals: allAnimals});
   }
  })
})

// Creat New thing Request
app.post('/mongooses', function(req, res) {
    console.log("POST DATA", req.body);
    var animal = new Animal(req.body);
    animal.save(function(err) {
        console.log("sucessful create an animal", err);
        res.redirect('/');
    })
  })

  // Update route
  app.post('/mongooses/:id', function(req, res) {
    var updateAnimal = req.params.id;
    Animal.update({_id: updateAnimal}, req.body, function(err) {
      if (err) {
        console.log("fail updating", err);
        res.redirect('/mongooses/edit/' + updateAnimal);
      }
      else {
        res.redirect('/');
      }
    })
  })


  // Edit route
  app.get('/mongooses/edit/:id', function(req, res) {
    // console.log("Update DATA", req.params);
    var editAnimal = req.params.id;
    Animal.findOne({_id: editAnimal}, function(err, oneAnimal) {
          // console.log("Update animal by one", err);
          console.log(oneAnimal);
          res.render('edit', {oneAnimal: oneAnimal});
    })
  })




  // delete method
  app.post("/mongooses/destroy/:id", function(req, res) {
      var noAnimal = req.params.id;
      Animal.remove({_id: noAnimal}, function(err) {
          res.redirect("/")
      })
  })




// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
