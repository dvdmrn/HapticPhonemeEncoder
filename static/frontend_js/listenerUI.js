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
			if($("#txtFieldComprehension").val()==""){
				alert("enter the word or phrase you felt");
				return
			}
			if($("#txtFieldReply").val()==""){
				alert("enter a reply to your conversation partner");
				return
			}
			responseTime = new Date();
			difference = responseTime - startTime;
			msg = $("#txtFieldComprehension").val();
			updateConsole("Recorded response: "+msg+"! Awaiting next message...");
	    	socket.emit("response", {"response":msg, 
	    							 "response_time":difference,
	    							 "n_plays":nPlays,
	    							 "play_again_times":playAgains});
	    	$("#txtFieldComprehension").val("");
	    	nPlays = 0;
	    	playAgains = []
	    	listenerTurn = false;
	    	socket.emit("readyForNextPhrase", $("#txtFieldReply").val());
		}
	})
})