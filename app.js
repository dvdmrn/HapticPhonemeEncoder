const express = require('express')
const app = express()
const basicAuth = require('express-basic-auth')

app.use(basicAuth({
    users: { srl: 'eurohaptics' },
    challenge: true // <--- needed to actually show the login dialog!
}));

const https = require('https')
const fs = require('fs')

const words = require('cmu-pronouncing-dictionary');
const bodyParser = require('body-parser');
const STT = require("./transcribe.js");
const util = require('util');
const wavInfo = require('wav-file-info');
const csv = require('./writeData');


var _targetMsg = "";
const tmpFilePath = "resources/temp.wav"



const port = 4444

// app.get('/static/', (req, res) => {
//   res.send('WORKING!')
// })


app.use(express.static('static'))

const httpsOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert')
}
const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('server running at ' + port)
})

const io = require('socket.io')(server);







function newParticipant(pID) {
  dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour:"2-digit", minute:"2-digit",second:"2-digit"};
  today  = new Date().toLocaleDateString('en-US',dateOptions);
  formatDate = today.replace(/\//g,"-").replace(",","");
  pID = "P"+pID+" "+formatDate+".csv";
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




io.on('connection', (socket) => { 
  console.log("io.on connection event!")

  socket.on("initParticipant", (participant) => {
    fn = newParticipant(participant);
    csv.init(fn)
  })

  socket.on("newStimuli", () =>
  {
    io.emit("newStimuli");
  })

  socket.on("response", (msg) => {
    csv.writeRow([{target_phrase:_targetMsg, 
                   response_phrase:msg["response"], 
                   response_time:msg["response_time"], 
                   n_playAgain:msg["n_plays"], 
                   t_playAgain:msg["play_again_times"]}])
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
                _targetMsg = msg;
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

  socket.on("playForAll", ()=>{
    io.emit("play");
  })

  socket.on("readyForNextPhrase", (msg)=>{
    io.emit("notifySpeaker",msg);
  })

  socket.on("newText", (msg)=>{
    console.log("recieved text: ",msg);
    _targetMsg = msg;
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

// const express = require('express');
// const basicAuth = require('express-basic-auth')
// const app = express()
// app.use(basicAuth({
//     users: { srl: 'eurohaptics' },
//     challenge: true // <--- needed to actually show the login dialog!
// }));
// app.use(express.static("static"))
// // const server = require('https').createServer(app);
// const words = require('cmu-pronouncing-dictionary');
// const bodyParser = require('body-parser');
// const fs = require('fs')
// const STT = require("./transcribe.js");
// const util = require('util');
// const wavInfo = require('wav-file-info');
// const csv = require('./writeData');
// var https = require('https')




// var _targetMsg = "";
// const tmpFilePath = "resources/temp.wav"


// // ====== Setup server ===============================

// // Old port info, uncomment below for that -----------

// var port = process.env.PORT || 8080

// // server.listen(port);
// // console.log("listening on: ",port)

// // ---------------------------------------------------


// var server = https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app)
// .listen(port, function () {
//   console.log('Example app listening on port 3000! Go to https://localhost:3000/')
// })
// const io = require('socket.io')(server);

// // ====================================================


// function newParticipant(pID) {
//   dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour:"2-digit", minute:"2-digit",second:"2-digit"};
//   today  = new Date().toLocaleDateString('en-US',dateOptions);
//   formatDate = today.replace(/\//g,"-").replace(",","");
//   pID = "P"+pID+" "+formatDate+".csv";
//   console.log(pID);
//   return pID;
// }








// function getPhonemicTranscription(orthography){
//   let transcribeMeDaddy = orthography.toLowerCase().split(" ")
//   let wordTranscriptions = []
//   for (var i = 0; i < transcribeMeDaddy.length; i++) {
//     wordTranscriptions.push(words[transcribeMeDaddy[i]]);
//   }
//   return wordTranscriptions;

// }




// io.on('connection', (socket) => { 
//   console.log("io.on connection event!")

//   socket.on("initParticipant", (participant) => {
//     fn = newParticipant(participant);
//     csv.init(fn)
//   })

//   socket.on("newStimuli", () =>
//   {
//     io.emit("newStimuli");
//   })

//   socket.on("response", (msg) => {
//     csv.writeRow([{target_phrase:_targetMsg, 
//                    response_phrase:msg["response"], 
//                    response_time:msg["response_time"], 
//                    n_playAgain:msg["n_plays"], 
//                    t_playAgain:msg["play_again_times"]}])
//   })

//   socket.on("newRecording", (wave)=> {
//     console.log("Received new recording!")


//     let buf = new Buffer(wave.blob, 'base64'); // decode
//     fs.writeFile("resources/temp.wav", buf, function(err) {
//       if(err) {
//         console.log("err", err);
//       } else {
//         console.log("successfuly saved wav file to server");
//         wavInfo.infoByFilename(tmpFilePath, function(err, info){
//             if (err) throw err;
//             else{
//               console.log("found file: ",info);
//               STT.main(tmpFilePath, info["header"]["sample_rate"], (msg) => {
//                 console.log("successfuly transcribed with: ",msg);
//                 _targetMsg = msg;
//                 io.emit("updateConsole", msg);
//                 phonemicTranscription = getPhonemicTranscription(msg);
//                 io.emit("loadPhonemes", {"transcription":phonemicTranscription,"text":false})
//               }).catch((err)=>{
//                       console.log("there's been an error of some kind: ",err);
//                       console.error;
//                       io.emit("authError");
//                     }
//               );
//             }


//           });
//       }
//     });


//   })

//   socket.on("playForAll", ()=>{
//     io.emit("play");
//   })

//   socket.on("readyForNextPhrase", ()=>{
//     io.emit("notifySpeaker");
//   })

//   socket.on("newText", (msg)=>{
//     console.log("recieved text: ",msg);
//     _targetMsg = msg;
//     phonemicTranscription = getPhonemicTranscription(msg);
//     if(phonemicTranscription != false){
//       console.log("phonology: ",phonemicTranscription);
//       io.emit("loadPhonemes", {"transcription":phonemicTranscription,"text":true});
//     }
//     else{
//       console.log("transcription error");
//       io.emit("textTranscriptionError")
//     }
//   })

//  });



// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(bodyParser.json({limit: '50mb', extended: true}));

// app.use(express.static("static"))


// app.get("/transcription/:orthography", (req,res) => {
// 	let wordOrtho = req.params.orthography
// 	res.send(words[wordOrtho])
// 	// console.log("Here be the transcription: ", cmu.words.wordOrtho)
// })


// app.post('/voice/save_recording',function(req,res){

//   var buf = new Buffer(req.body.blob, 'base64'); // decode
//   fs.writeFile("resources/temp.wav", buf, function(err) {
//     if(err) {
//       console.log("err", err);
//     } else {
//       return res.json({'status': 'success'});
//     }
//   }); 

// });