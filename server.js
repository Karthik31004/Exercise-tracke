//Declaration Statements

const express = require("express");
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')

//Connecti
mongoose.connect(process.env.MONGO_URI , {useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true})
mongoose.connection.on('connected' , () => {
  console.log("Connected Successfully")
})
app.use(express.static("public"));
app.use(express.urlencoded({extended: false})) 
app.use(cors())

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

