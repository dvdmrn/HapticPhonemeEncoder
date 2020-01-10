const express = require('express');
const basicAuth = require('express-basic-auth')
const app = express()
app.use(basicAuth({
    users: { srl: 'eurohaptics' },
    challenge: true // <--- needed to actually show the login dialog!
}));
app.use(express.static("static"))
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const words = require('cmu-pronouncing-dictionary');
const bodyParser = require('body-parser');
const fs = require('fs')
const STT = require("./transcribe.js");
const util = require('util')
const wavInfo = require('wav-file-info')


const tmpFilePath = "resources/temp.wav"

// wavInfo.infoByFilename(tmpFilePath, function(err, info){
//   if (err) throw err;
//   else{
//     console.log(info["header"]["sample_rate"]);
//     console.log("yup")
//   }
// });


var port = process.env.PORT || 8080



function getPhonemicTranscription(orthography){
  let transcribeMeDaddy = orthography.toLowerCase().split(" ")
  let wordTranscriptions = []
  for (var i = 0; i < transcribeMeDaddy.length; i++) {
    wordTranscriptions.push(words[transcribeMeDaddy[i]]);
  }
  return wordTranscriptions;

}


server.listen(port);
console.log("listening on: ",port)
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
        wavInfo.infoByFilename(tmpFilePath, function(err, info){
            if (err) throw err;
            else{
              console.log("found file: ",info);
              STT.main(tmpFilePath, info["header"]["sample_rate"], (msg) => {
                console.log("successfuly transcribed with: ",msg);
                io.emit("updateConsole", msg);
                phonemicTranscription = getPhonemicTranscription(msg);
                io.emit("loadPhonemes", {"transcription":phonemicTranscription,"text":false})
              }).catch((err)=>{
                      console.log("there's been an error of some kind: ",err);
                      console.error;
                      io.emit("authError");
                    }
              );
            }


          });
      }
    });


  })

  socket.on("newText", (msg)=>{
    console.log("recieved text: ",msg);
    phonemicTranscription = getPhonemicTranscription(msg);
    if(phonemicTranscription != false){
      console.log("phonology: ",phonemicTranscription);
      io.emit("loadPhonemes", {"transcription":phonemicTranscription,"text":true});
    }
    else{
      console.log("transcription error");
      io.emit("textTranscriptionError")
    }
  })

 });



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