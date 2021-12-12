// Getting All Required Modules

const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const fs = require("fs");
const os = require("os");
const path = require("path");
const mongoose = require("mongoose");
const { Http2ServerRequest } = require("http2");
const { dirname } = require("path");
const { StringDecoder } = require("string_decoder");
const { isNull } = require("util");
const server = require("http").createServer(app);
const port = 2000;
const io = require("socket.io")(server);
app.use(express.urlencoded( {extended:true} ));
mongoose.connect('mongodb://localhost:27017/whatsapp', {useNewUrlParser : true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, "error"));
db.once('open', ()=> {
    console.log("Database Is Connected");
});

// Getting Schema For Database

var signupStructure = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

var signup = mongoose.model("whatsappSigns", signupStructure);

// Handling request

app.use(express.static(__dirname+"/Static"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/entry.html')
});

app.get("/index.html",(req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.get("/signup.html", (req, res) => {
    res.sendFile(__dirname+"/signup.html");
})

app.get("/inc.mp3", (req, res) => {
    res.sendFile(__dirname + "/inc.mp3");
});

app.post("/signup.html", (req, res) => {
    var em;
    signup.findOne( {email: req.body.email}, (err, user)=> {
        console.log("user = "+user);
        if(user===null) {
            var inputs = new signup(req.body);
    inputs.save();
    res.redirect("http://127.0.0.1:2000/login.html");
    // console.log(inputs);
        }
        else {
            res.end(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    *{
                        padding:0px;
                        margin:0px;
                        box-sizing: border-box;
                    }
                    #signup-form{
                        width: 350px;
                        position:absolute;
                        top:50%;
                        left:50%;
                        transform: translate(-50%, -50%);
                        box-shadow: 1px 1px 6px #202020;
                        height:450px;
                        background: #d9d9d9;
                    }
            #head{
                font-size:35px;
                position: absolute;
                top:30px;
                left: 50%;
                white-space: nowrap;
                transform: translate(-50%);
            }
            #name{
                height: 45px;
                width:80%;
                border: 5px solid #d9d9d9;
                outline:none;
                box-shadow: 1px 1px 7px #202020;
                position:absolute;
                top:120px;
                left:10%;
                padding: 10px;
            }
            #email{
                height: 45px;
                width:80%;
                border: 5px solid #d9d9d9;
                outline:none;
                box-shadow: 1px 1px 7px #202020;
                position:absolute;
                top:205px;
                left:10%;
                padding: 10px;
            }
            #password{
                height: 45px;
                width:80%;
                border: 5px solid #d9d9d9;
                outline:none;
                box-shadow: 1px 1px 7px #202020;
                position:absolute;
                top:290px;
                left:10%;
                padding: 10px;
            }
            input{
                font-size:20px;
            }
            #btn{
                width:220px;
                height:50px;
                border-radius: 10px;
                background: #d9d9d9;
                position:absolute;
                top: 370px;
                left: 50%;
                font-weight: bold;
                font-size: 25px;
                border:none;
                box-shadow: 2px 2px 8px #202020;
                background:green;
                color:#202020;
                text-shadow: 3px 3px 6px #202020;
                color:white;
                transform: translate(-50%);
            }
            #container{
                width: 100%;
                height:100vh;
                background: #0052D4;  /* fallback for old browsers */
            background: -webkit-linear-gradient(to bottom, #6FB1FC, #4364F7, #0052D4);  /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to bottom, #6FB1FC, #4364F7, #0052D4); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            }
                </style>
            </head>
            <body>
                <div id="container">
                <form id="signup-form" action="" method="post">
                    <span id="head">Sign-Up Now</span>
                    <input id="name" name="name" type="text" placeholder="Your Name" required>
                    <input id="email" name="email" type="email" placeholder="Your Email" required>
                    <input id="password" name="password" type="password" placeholder="Your Password" minlength="6" required>
                    <button id="btn" type="submit">Sign-Up</button>
                </form>
                </div>
                <script>alert("User Already Exist With The Provided Email, Please Login");</script>
            </body>
            </html>`);
        }
    });
});

app.get("/login.html", (req, res) => {
    res.sendFile(__dirname+"/login.html");
});

app.post("/login.html", (req, res) => {
    var logEmail =  req.body.email;
    var logPassword =  req.body.password;
    signup.find( {email : logEmail, password : logPassword}, (err, user) =>{
        var a = user[0];
        try{
        var b = a['name'];
        }catch(err) {
            b = "";
        }
        // console.log(b);
        if(b!="") {
            var da = new Date();
            var dat = da.getDate();
            var date = ""+dat;
            console.log("b = "+typeof(b));
            fs.writeFileSync("login.txt", date);
            fs.writeFileSync("name.txt", b);
            res.end("<script>window.location.href='index.html'</script>");
        }
        else{
            // console.log(user);
            res.end(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    *{
                        padding:0px;
                        margin:0px;
                        box-sizing: border-box;
                    }
                    #signup-form{
                        width: 350px;
                        position:absolute;
                        top:50%;
                        left:50%;
                        transform: translate(-50%, -50%);
                        box-shadow: 1px 1px 6px #202020;
                        height:400px;
                        background: #d9d9d9;
                    }
            #head{
                font-size:35px;
                position: absolute;
                top:30px;
                left: 50%;
                white-space: nowrap;
                transform: translate(-50%);
            }
            #name{
                height: 45px;
                width:80%;
                border: 5px solid #d9d9d9;
                outline:none;
                box-shadow: 1px 1px 7px #202020;
                position:absolute;
                top:120px;
                left:10%;
                padding: 10px;
            }
            #email{
                height: 45px;
                width:80%;
                border: 5px solid #d9d9d9;
                outline:none;
                box-shadow: 1px 1px 7px #202020;
                position:absolute;
                top:205px;
                left:10%;
                padding: 10px;
            }
            
            input{
                font-size:20px;
            }
            #btn{
                width:220px;
                height:50px;
                border-radius: 10px;
                background: #d9d9d9;
                position:absolute;
                top: 300px;
                left: 50%;
                font-weight: bold;
                font-size: 25px;
                border:none;
                box-shadow: 2px 2px 8px #202020;
                background:green;
                color:#202020;
                text-shadow: 3px 3px 6px #202020;
                color:white;
                transform: translate(-50%);
            }
            #container{
                width: 100%;
                height:100vh;
                background: #0052D4;  /* fallback for old browsers */
            background: -webkit-linear-gradient(to bottom, #6FB1FC, #4364F7, #0052D4);  /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to bottom, #6FB1FC, #4364F7, #0052D4); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            }
                </style>
            </head>
            <body>
                <div id="container">
                <form id="signup-form" action="" method="post">
                    <span id="head">Login Now</span>
                    <input id="name" name="email" type="email" placeholder="Your Email" required>
                    <input id="email" name="password" type="password" placeholder="Your Password" required>
                    <button id="btn" type="submit">Login</button>
                </form>
                </div>
                <script>alert("No User Found With This Email!");</script>
            </body>
            </html>`);
        }
    });
});

app.get("/login.txt", (req, res) => {
    res.sendFile(__dirname+"/login.txt");
});

app.get("/name.txt", (req, res) => {
    res.sendFile(__dirname+"/name.txt");
})

// Starting Server

server.listen(port, ()=>{
    console.log("Server is started");
});

// Handling Socket.io events

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        console.log(msg);
        socket.broadcast.emit('message', msg);
    });
});
