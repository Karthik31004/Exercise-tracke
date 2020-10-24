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

const User= mongoose.model('User' , userSchema);

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user" , (req, res) => {
  
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

