var recording = false;
var processingSpeech = false;


var updateTranscription = (transcription, word) => {
	transcription+=word;
	return transcription
}


var AntiAjaxAjaxClub = (i, maxCalls, phrase, phraseArr) => {
	// this fn is to make ajax calls sequential by using recursion
	// int i = iterator that desc. recursion depth
	// int maxCalls = max recursion depth
	// Object phrase = phrase object which we are editing
	//                 we use an object as a roundabout way of doing pass-by-ref (which doesn't exist in JS)
	// string[] phraseArr = an array of words @ orthography level 
	console.log("in the AntiAjaxAjaxClub\nIteration: ",i);
	if(i > maxCalls){
		console.log("entered base case with: ",phrase.transcription.toString())
		// updateConsole("found transcription: "+phrase.transcription.toString())
		return 
	}
	return $.ajax({
				url: "transcription/"+phraseArr[i],
				type: "GET",
				dataType: "text",
				success: (data) => {
					console.log("transcription: ",phraseArr[i],"-->",data)
					phrase.transcription.push(data.toString())
					// console.log("var: ",transcription)
				}
			}).then(()=>{
					return AntiAjaxAjaxClub(i + 1, maxCalls,phrase,phraseArr)
				}
			)

}



$(document).ready( () =>{
	console.log("henlo")

	socket.on('notifySpeaker', ()=>{
		updateConsole("👍 response logged. Please proceed with the next phrase.");
	});

    socket.on('updateConsole', function(msg){
      if (msg==""){
      	updateConsole("Sorry, I don't understand. Try recording again.")
      }
      else{
      	processingSpeech = false;
      	updateConsole("I think you said:<br><div class='tab'>↪ &lt;<span class='orthography'>"+msg+"</span>&gt;<br>↪ if that looks correct, press <b>send</b></div>");
      }
    });

    socket.on("authError" , ()=>updateConsole("⚠️ authentication error :( Check environment variables."))

    socket.on("textTranscriptionError", ()=>updateConsole("Transcription Error: I'm not sure how to transcribe your text."))

    $("#sendTxt").click( () =>{
    	if(!recording && !sendingPhonemes){
    		msg = $("#textField").val();
    		updateConsole("input text: "+$("#textField").val())
    		socket.emit("newText", msg);
    		socket.emit("newStimuli");
    	}
    })
    $('#send').click( () =>{
    		socket.emit("newStimuli");  	
    })
	$("#recordButton").click( () =>{
		if(recording){
			// set to not recording
			recording = !recording
			$("#recordButton")[0].classList.toggle("rec")
			$("#send")[0].classList.toggle("disabled")
			updateConsole("recording stopped! Processing speech...")
			processingSpeech = true;
			stopRecording(); // in recorder-scripts.js
		}
		else if (!sendingPhonemes){
			// set to recording
			console.log("toggling rec button",$("#recordButton")[0].classList)
			recording = !recording
			$("#recordButton")[0].classList.toggle("rec")
			$("#send")[0].classList.toggle("disabled")
			updateConsole("now recording...")
			startRecording(); // in recorder-scripts.js

		}

	})

})


