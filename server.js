//Declaration Statements

const express = require("express");
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')

//Connecting to the database
mongoose.connect(process.env.MONGO_URI , {useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true})
mongoose.connection.on('connected' , () => {
  console.log("Connected Successfully")
})

//middlewares
app.use(express.static("public"));
app.use(express.urlencoded({extended: false})) 
app.use(cors())

//Starting page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//mongoose schema 
const exerciseSchema = new mongoose.Schema({
  description: {type: String, required: true} ,
  duration: {type: Number, required: true},
  date: {type: Date, default: Date.now()}
})

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true} ,
  log: [exerciseSchema]
})

const User = mongoose.model('User' , userSchema)
const Exercise = mongoose.model('Exercise' , exerciseSchema)

//api/exercise/new-user

app.post('/api/exercise/new-user' , (req , res) => {
  const { username } = req.body;
  User.find({username} , (err , data) => {
    if(err) {
      console.log(err)
    }
    else
      {
        const user = new User({
          username
        })
        user.save().then(saved => { res.json({username: saved.username , _id: saved._id})})
            .catch(err => { res.json({error: "User Already exists"})})
      }
  })
})

//api/exercise/add
app.post('/api/exercise/add' , (req, res) => {
  const {userId, description, duration, date} = req.body;
    const exercise = new Exercise({
      description ,
      duration
    });
    if(date) {
      exercise.date = new Date(date)
    }
    
  })

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

