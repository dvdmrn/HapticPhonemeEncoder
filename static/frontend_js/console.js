var newLineSymbol = "♢ "

// var updateConsole = function(text){
// 	consoleTxt += newLineSymbol+text+"<p></p>"
// 	$("#console").html(consoleTxt);
// }

var updateConsole = function(text){
	consoleTxt = newLineSymbol+text+"<p></p>"
	$("#console").append(consoleTxt)
	
	$("#console").stop().animate({
			scrollTop: $("#console")[0].scrollHeight
		}, 800);
	// $("#console").html(consoleTxt);
}	
$(document).ready( () => {
	updateConsole("Welcome! Press <b>record</b> to record your speech. Press <b>send</b> to send it to an interlocutor.<p> ")
	})

