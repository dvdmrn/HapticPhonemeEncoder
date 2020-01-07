//webkitURL is deprecated but nevertheless 
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia() 
var rec;
//Recorder.js object 
var input;
//MediaStreamAudioSourceNode we'll be recording 
// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext;


// functions ========================================
	// converts blob to base64
function blobToBase64(blob, cb) {
	console.log("blob: ",blob)
		var reader = new FileReader();
		reader.onload = function() {
			var dataUrl = reader.result;
			var base64 = dataUrl.split(',')[1];
			console.log("b64: ",base64)
		cb(base64);
	  };
	  reader.readAsDataURL(blob);
	};


function startRecording() {
	/* Simple constraints object, for more advanced audio features see
	https://addpipe.com/blog/audio-constraints-getusermedia/ */
	console.log("start recording called")
	var constraints = {
	    audio: true,
	    video: false
	} 


	/* We're using the standard promise based getUserMedia()
	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia */

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
	    console.log("getUserMedia() success, stream created, initializing Recorder.js ..."); 
	    /* assign to gumStream for later use */
	    gumStream = stream;
	    /* use the stream */
	    input = audioContext.createMediaStreamSource(stream);
	    /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
	    rec = new Recorder(input, {
	        numChannels: 1
	    }) 
	    //start the recording process 
	    rec.record()
	    console.log("Recording started");
	}).catch(function(err) {
	    //enable the record button if getUserMedia() fails 
	    alert("getUserMedia() failed! Some possible reasons: \n- microphone browser permissions have been disabled\n- you didn't type 'HTTPS',\n- this app is only tested on Firefox");
	});
}


function stopRecording() {
    console.log("stopRecording() called");
    //tell the recorder to stop the recording 
    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to pushToBackend 
    // blob doesn't write properly!!!
    rec.exportWAV(pushToBackend);
}


function pushToBackend(blob) {
	console.log("pushing blob: ",blob)
    // var url = URL.createObjectURL(blob);

	blobToBase64(blob, function(base64){ // encode
	  var update = {'blob': base64};


  
    socket.emit('newRecording', update);

	});    


}
