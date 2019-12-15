const express = require('express');
const app = express()
app.use(express.static("static"))
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const words = require('cmu-pronouncing-dictionary');
const bodyParser = require('body-parser');
const fs = require('fs')
const STT = require("./transcribe.js");
const util = require('util')

const tmpFilePath = "resources/temp.wav"


var port = process.env.PORT || 3000

// Todos:
// now that I have the ortho, I need to get the transcription
// then I need to play sounds


function getPhonemicTranscription(orthography){
  let transcribeMeDaddy = orthography.toLowerCase().split(" ")
  let wordTranscriptions = []
  for (var i = 0; i < transcribeMeDaddy.length; i++) {
    wordTranscriptions.push(words[transcribeMeDaddy[i]]);
  }
  return wordTranscriptions;

}


server.listen(3000);
io.on('connection', (socket) => { 
  console.log("io.on connection event!")
  socket.on("newRecording", (wave)=> {
    console.log("Received new recording!")


    let buf = new Buffer(wave.blob, 'base64'); // decode
    fs.writeFile("resources/temp.wav", buf, function(err) {
      if(err) {
        console.log("err", err);
      } else {
        console.log("successfuly saved wav file to server");
        STT.main(tmpFilePath, (msg) => {
          io.emit("updateConsole", msg);
          phonemicTranscription = getPhonemicTranscription(msg);
          io.emit("loadPhonemes", phonemicTranscription)
        }).catch(()=>{
                console.error;
                io.emit("authError");
              }
        );
      }
    });


  })
 });



// const express = require('express');
// const socket = require('socket.io');











app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use(express.static("static"))


app.get("/transcription/:orthography", (req,res) => {
	let wordOrtho = req.params.orthography
	res.send(words[wordOrtho])
	// console.log("Here be the transcription: ", cmu.words.wordOrtho)
})


app.post('/voice/save_recording',function(req,res){

  var buf = new Buffer(req.body.blob, 'base64'); // decode
  fs.writeFile("resources/temp.wav", buf, function(err) {
    if(err) {
      console.log("err", err);
    } else {
      return res.json({'status': 'success'});
    }
  }); 

});


// app.use(express.json());
// app.use(express.static("static_files"));



// const courses = {
// 	1:{id:"1",name:"ass studies"},
// 	2:{id:"2",name:"ass2 studies"},
// 	3: {id:"3",name:"ass3 studies"},
// }


// app.get('/', (req, res) =>{

// 	res.send('hello worl');

// });

// app.get("/api/courses", (req,res)=>{
// 	res.send([1,2,3,4])
// })

// app.get('/api/courses/:id/:ass', (req, res)=> {
// 	res.send(req.query)
// })

// app.post("/api/courses", (req,res)=>{
// 	const course = {
// 		id: courses.length + 1
// 		name: req.body.name
// 	};
// 	courses.push(course);
// 	res.send(course)
// })

// // PORT env var.
// // value is set outside of app
// // set w process obj




