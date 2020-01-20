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
const util = require('util');
const wavInfo = require('wav-file-info');
const csv = require('./writeData');
// const STT = require("./transcribe.js");


const tmpFilePath = "resources/temp.wav"

var port = process.env.PORT || 8080



function newParticipant(pID) {
  dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour:"2-digit", minute:"2-digit",second:"2-digit"};
  today  = new Date().toLocaleDateString('en-US',dateOptions);
  formatDate = today.replace(/\//g,"-").replace(",","");
  pID = "P"+pID+" "+formatDate;
  console.log(pID);
  return pID;
}








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

  socket.on("initParticipant", (participant) => {
    fn = newParticipant(participant);
    csv.init(fn)
    csv.writeRow([{target_phrase:"hello worl", response_phrase:"Henlo World", response_time:69, n_playAgain:6, t_playAgain:[10,444,32,34]}])

  })

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