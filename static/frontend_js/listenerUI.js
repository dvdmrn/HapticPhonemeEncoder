var recording = false;
var processingSpeech = false;
var startTime = new Date();
var responseTime = new Date();
var nPlays = 0;
var playAgains = []
var playAgainStart = new Date();
var listenerTurn = false;


socket.on("newStimuli", ()=>{
	console.log("new stims baby")
	startTime = new Date()
	listenerTurn = true;
	// unlock page
})


$(document).ready(() => {

	$("#submitNewParticipant").click(()=>{
			socket.emit("initParticipant",$("#pID").val());
			$("#newParticipant").toggle()
	})

	$("#send").click(()=>{
		if(listenerTurn && !sendingPhonemes && !recording){
			console.log("sendlinkclicked");
			nPlays++;
			playAgainInterval = new Date() - playAgainStart;
			playAgainStart = new Date();
			playAgains.push(playAgainInterval);
			socket.emit("playForAll")
						
		}

	})


	$("#response").click(()=>{
		if(!recording && !sendingPhonemes && listenerTurn){
			responseTime = new Date();
			difference = responseTime - startTime;
			msg = $("#txtFieldResponse").val();
			updateConsole("Recorded response! Awaiting next message...");
	    	socket.emit("response", {"response":msg, 
	    							 "response_time":difference,
	    							 "n_plays":nPlays,
	    							 "play_again_times":playAgains});
	    	$("#txtFieldResponse").val("");
	    	nPlays = 0;
	    	playAgains = []
	    	listenerTurn = false;
	    	socket.emit("readyForNextPhrase");
		}
	})
})