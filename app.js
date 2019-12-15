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
const tmpFilePath = "resources/temp.wav"


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
          console.log("successfuly transcribed with: ",msg);
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