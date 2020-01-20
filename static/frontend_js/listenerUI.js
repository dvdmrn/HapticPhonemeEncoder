var recording = false;
var processingSpeech = false;

$(document).ready(() => {
	$("#response").click(()=>{
	msg = $("#txtFieldResponse").val();
		updateConsole("Recorded response! Awaiting next message...");
    	socket.emit("response", msg);
    	$("#txtFieldResponse").val("");
	})
})