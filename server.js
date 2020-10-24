// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const cors = require('cors')
// our default array of dreams
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI , {useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true})
mongoose.connection.on('connected' , () => {
  console.log("Connected Successfully")
})
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.urlencoded({extended: false})) 
app.use(cors())

//Mongoose Schema 

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  } , 
  exercise: [{
    description: {type: String, required: true} ,
    duration: {type: Number , required: true} ,
    date: {type: Number}
  }]
})

const User = mongoose.model('User' , userSchema);

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user" , (req, res) => {
  const { username } = req.body;
  User.findOne({username} , (err , data) => {
    if(err) {
      return console.log('findOne() error')
    }
    if(data)  {
      return res.json({error: "Username already exists"})
    } 
    else {
      const user = new User({
        username , 
        exercise: []
      })
      
      user.save()
          .then(user => {
        res.json({username: user.username , _id: user._id})
      }).catch(err => { console.log('save error')})
    }
  })
})

app.post('/api/exercise/add' , (req , res) => {
  
  const {userId, description, duration, date } = req.body
  
  User.findOne({_id: userId} , (err , data) => {
    if(err)  {
      return res.json({error: "User Not found"})
    }
  })
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

