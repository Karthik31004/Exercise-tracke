//Declaration Statements

let express = require("express");
let app = express();
let cors = require('cors')
let mongoose = require('mongoose')

//Connecting to the database
mongoose.connect(process.env.MONGO_URI , {useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true , useFindAndModify: false})
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
let exerciseSchema = new mongoose.Schema({
  description: {type: String, required: true} ,
  duration: {type: Number, required: true},
  date: {type: Date , default: Date.now() }
})

let userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true} ,
  log: [exerciseSchema]
})

let User = mongoose.model('User' , userSchema)
let Exercise = mongoose.model('Exercise' , exerciseSchema)

//api/exercise/new-user

app.post('/api/exercise/new-user' , (req , res) => {
  let { username } = req.body;
  User.find({username} , (err , data) => {
    if(err) {
      console.log(err)
    }
    else
      {
        let user = new User({
          username
        })
        user.save().then(saved => { res.json({username: saved.username , _id: saved._id})})
            .catch(err => { res.json({error: "User Already exists"})})
      }
  })
})

//api/exercise/add
app.post('/api/exercise/add' , (req, res) => {
  let {userId, description, duration , date} = req.body;
    let exercise = new Exercise({
      description ,
      duration: parseInt(duration)
    });
    if(date) {
      exercise.date = new Date(date);
    }
    User.findByIdAndUpdate(userId , {$push: {log: exercise}} ,{new: true}, (err , updated) => {
      if(err)  {
        console.log(err)
      }
      let result = {
        _id:updated._id ,
        username: updated.username ,
        description: exercise.description ,
        duration: exercise.duration , 
        date: exercise.date.toDateString()
      }
      
      res.json(result)
    }).catch(err => { console.log(err)})
  })

app.get('/api/exercise/users' , (req , res) => {
  User.find({} , (err , users) => {
    if(err)
      console.log(err)
    else
      res.json(users)
  })
})

app.get('/api/exercise/log', (req, res) => {
  
  User.findById(req.query.userId, (error, result) => {
    if(!error){
      var { from , to , limit} = req.query;
      var fromDate = new Date(0) , toDate = new Date() 
        if(from)  {
          fromDate = new Date(from)
        }
        if(to)  {
          toDate = new Date(to)
        }
        
        result.log = result.log.filter(data => { return data.date.getTime() >= fromDate.getTime() && data.date.getTime() <= toDate.getTime() });
        
      if(limit)  {
          limit = parseInt(limit)
          result.log = result.log.slice(0 , limit)
        }
      var obj = {}
      obj._id = result._id;
      obj.username = result.username;
      obj.count = result.log.length;
      obj.log = result.log;
      res.json(obj)
    }
    else  {
      res.json({error: "No User Found"})
    }
  }).catch(err => { res.json({error: "No user Found"})})
  
})
// listen for requests :)
let listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

