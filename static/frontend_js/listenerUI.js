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


socket.on("textTranscriptionError", ()=>{listenerTurn=false})
socket.on("authError", ()=>{listenerTurn=false})


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
			reiteratedMsg = $("#txtFieldComprehension").val();
			replyMsg = $("#txtFieldReply").val()
			updateConsole("You: <span class='orthography'>"+replyMsg+"</span>");
	    	socket.emit("response", {"response":reiteratedMsg, 
	    							 "response_time":difference,
	    							 "n_plays":nPlays,
	    							 "play_again_times":playAgains,
	    							 "reply":replyMsg
	    							});
	    	socket.emit("readyForNextPhrase", $("#txtFieldReply").val());
	    	$("#txtFieldComprehension").val("");
	    	$("#txtFieldReply").val("");
	    	nPlays = 0;
	    	playAgains = []
	    	listenerTurn = false;
	    	updateConsole("awaiting next message...")
		}
	})
})