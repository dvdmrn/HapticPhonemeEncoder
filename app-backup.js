const express = require('express');
const socket = require('socket.io');
const words = require('cmu-pronouncing-dictionary');
const bodyParser = require('body-parser');
const fs = require('fs')

// BIG TODOS: 2019-12-12
// - can we just use Speech to Phoneme instead of STT? Can help with words like "hella"
// - press button on frontend --> call fn in backend. 


const app = express();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use(express.static("static"))


app.get("/transcription/:orthography", (req,res) => {
	let wordOrtho = req.params.orthography
	console.log("transcribing:",req.params.orthography,"->", words[wordOrtho])
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




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))