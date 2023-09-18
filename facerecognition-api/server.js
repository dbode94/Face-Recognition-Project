const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'test', // still no sure if I need a password
      database : 'smart-brain'
    }
  });



const app = express();

app.use(bodyParser.json());
app.use(cors());



// app.get('/',(req,res)=>{
//     res.send(database.users);
// });

//endpoints
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) =>{register.handleRegister(res, req, db, bcrypt)})

app.get('/profile/:id', (req, res) =>{profile.handleProfileGet(req, res, db)})

app.put("/image", (req, res) =>{image.handleImage(req, res, db)} )

app.post("/imageurl", (req, res) =>{image.handleApiCall(req, res)} )






app.listen(3000, ()=>{
    console.log('app running on port 3000');
})


/* 
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/