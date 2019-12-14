const util = require('util')

async function test(logMe, callback){
  console.log("log me: ", logMe);
  return callback()
}

var test2 = ()=>{
  console.log("boop")
}

test("hello", () => {
  console.log("got here ;)")
})

test("another one", test2)
// async function main(filePath, callback) {

//   // Imports the Google Cloud client library
//   const speech = require('@google-cloud/speech');
//   const fs = require('fs');

//   // Creates a client
//   const client = new speech.SpeechClient();

//   // Reads a local audio file and converts it to base64
//   const file = fs.readFileSync(filePath);
//   const audioBytes = file.toString('base64');

//   // The audio file's encoding, sample rate in hertz, and BCP-47 language code
//   const audio = {
//     content: audioBytes,
//   };
//   const config = {
//     encoding: 'LINEAR16',
//     sampleRateHertz: 44100,
//     languageCode: 'en-US',
//   };
//   const request = {
//     audio: audio,
//     config: config,
//   };

//   // Detects speech in the audio file
//   const [response] = await client.recognize(request);
//   const transcription = response.results
//     .map(result => result.alternatives[0].transcript)
//     .join('\n');
//   // console.log(`Transcription: ${response}`);
//   console.log(util.inspect(response, {showHidden: false, depth: null}))
//   return callback
//   }

// main("resources/v1.wav").catch(console.error);


