const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const cors = require("cors");
const UserSchema = require('./userSchema');
const TodoSchema = require('./todoSchema');

const session = require('express-session')
const mongoDbSession = require('connect-mongodb-session')(session)

const app = express();

const mongoURI = `mongodb+srv://Prudhvi876:Prudhvi876@cluster0.xa0edpx.mongodb.net/todo?retryWrites=true&w=majority`

const store = new mongoDbSession({
    uri : mongoURI,
    collection : 'sessions'
})


app.use(session({
    secret: 'hello backendjs',
    resave: false,
    saveUninitialized: false,
    store: store,   
    expires: new Date(Date.now() + (15*1000))
}))



app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
mongoose.connect(mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(res => {
    console.log('Connected to db successfully');
}).catch(err => {
    console.log('Failed to connect', err);
})


async function checkAuth(req, res, next) {
    const token = req.body.token
    console.log(req.body)
    if(token) {
        const Schema = mongoose.Schema;
        
        const sessionSchema = new Schema({
            _id : String

        },
        {   
            strict:false
        })
        const sessionmodel = mongoose.model('sessions',sessionSchema,'sessions')

        const userSession = await sessionmodel.findOne({_id : token})

        if(userSession){
            req.session= userSession
            next()
        }else{
            return res.send({
                status: 400,
                message: "You are not logged in. Please try logging in."
            })
        }
    }
    else {
        return res.send({
            status: 400,
            message: "You are not logged in. Please try logging in."
        })
    }
}



function cleanUpAndValidate({ username, email, password}) {
    return new Promise((resolve, reject) => {

        if(typeof(email) !== 'string')  
            reject('Invalid Email');
        if(typeof(username) !== 'string')  
            reject('Invalid Username');
        if(typeof(password) !== 'string')
            reject('Invalid Password');

        // Empty strings evaluate to false
        if(!username || !password || !email)
            reject('Invalid Data');

        if(username.length < 3 || username.length > 100) 
            reject('Username should be 3 to 100 charcters in length');
        
        if(password.length < 5 || password > 300)
            reject('Password should be 5 to 300 charcters in length');

        if(!validator.isEmail(email)) 
            reject('Invalid Email');

        if(phone !== undefined && typeof(phone) !== 'string') 
            reject('Invalid Phone');
        
        if(phone !== undefined && typeof(phone) === 'string') {
            if(phone.length !== 10 && validator.isAlphaNumeric(phone)) 
                reject('Invalid Phone');
        }

        resolve();
    })
}


app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        await cleanUpAndValidate({username, password, email});
    }
    catch(err) {
        return res.send({
            status: 400, 
            message: err
        })
    }

    let userExists;
    try {
        userExists = await UserSchema.findOne({email});
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Internal Server Error. Please try again.",
            error: err  
        })
    }

    if(userExists) 
        return res.send({
            status: 400,
            message: "User with email already exists"
        })

    try {
        userExists = await UserSchema.findOne({username});
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Internal Server Error. Please try again.",
            error: err  
        })
    }

    if(userExists) 
        return res.send({
            status: 400,
            message: "Username already taken"
        })

    const hashedPassword = await bcrypt.hash(password, 13); 
    
    let user = new UserSchema({
        username,
        password: hashedPassword,
        email,
    })

    try {
        const userDb = await user.save(); 
        return res.send({
            status: 200,
            message: "Registration Successful",
            data: {
                _id: userDb._id,
                username: userDb.username,
                email: userDb.email
            }
        });
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Internal Server Error. Please try again.",
            error: err  
        })
    }
})


app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if(typeof(email) !== 'string' || typeof(password) !== 'string' || !email || !password) {
        return res.send({
            status: 400,
            message: "Invalid Data"
        })
    }   

    // find() - May return you multiple objects, Returns empty array if nothing matches, returns an array of objects 
    // findOne() - One object, Returns null if nothing matches, returns an object 
    
    let userDb;
    try {
        if(validator.isEmail(email)) {
            userDb = await UserSchema.findOne({email: email}); 
        }
    }
    catch(err) {
        console.log(err);
        return res.send({
            status: 400,
            message: "Internal server error. Please try again",
            error: err
        })
    }
    

    if(!userDb) {
        return res.send({
            status: 400,
            message: "User not found",
            data: req.body
        });
    }

    // Comparing the password
    const isMatch = await bcrypt.compare(password, userDb.password);

    if(!isMatch) {
        return res.send({
            status: 400,
            message: "Invalid Password",
            data: req.body
        });
    }
 

    req.session.isAuth = true
    req.session.user = { username: userDb.username, email: userDb.email, userId: userDb._id }
    
    console.log(req.session)
    res.send({
        status: 200,
        message: "Logged in successfully",
        user : userDb,
        token : req.session.id
    })
})



app.post('/create-todo', checkAuth, async (req, res) => {
    console.log("Hello")
    const { todo } = req.body;
    if(!todo) {
        return res.send({
            status: 400,
            message: "Invalid Todo"
        })
    }

    if(todo.length > 200) {
        return res.send({
            status: 400,
            message: "Todo text too long. Todo can be max 200 characters in length."
        })
    }

    const userId = req.session.user.userId
    const creation_datetime = new Date();

    const todoCount = await TodoSchema.count({userId: userId});
    
    if(todoCount >= 1000) {
        return res.send({
            status: 400,
            message: "You have already created 1000 todos. Please try creating after deleting your old todos"
        })
    }

    const todoObj = new TodoSchema({
        todo,
        userId,
        creation_datetime
    });

    try {
        const todoDb = await todoObj.save();

        return res.send({
            status: 200,
            message: "Todo created successfully",
            data: todoDb
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: 'Internal server error. Please try again.'
        })
    }
})


app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;

        res.send('Logged out successfully');
    })
})


app.listen(4000, () => {
    console.log('Listening on port 3000');
})