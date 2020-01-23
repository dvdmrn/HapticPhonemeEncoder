// the error: numOfClicks%2 == 0 is greyed out forever, but "sent!" accumulates
// what might be happening: multiple event listeners are being attached




var timeBetweenPhonemes = 1000 // in ms
var timeBetweenWords = 3000 // in ms
let phonemeInventory = ["AA", "AO", "AE", "AH", "AW", "AY", "B", "D", "DH", "EH", "EY", "F", "G", "Y", "IH", "IY", "K", "L", "M", "N", "OW", "P", "R", "S", "T", "UH", "UW", "W", "V", "Z"]


var sendingPhonemes = false
// let phonemeInventory = ["AA","AE","AH","AO","AW","AX","AXR","AY","EH","ER","EY","IH","IX","IY","OW","OY","UH","UW","UX","B","CH","D","DH","DX","EL","EM","EN","F","G","HH","JH","K","L","M","N","NG","P","Q","R","S","SH","T","TH","V","W","WH","Y","Z","ZH"]
var cleanedPhraseToPlay = []
var phrasePlaylist = []

var greyBois = new Set([])
var rawPhonemes = []
var conflation = {
				"AA":"AA", 
				"AO":"AA", 
				"AE":"AA", 
				"AH":"AH", 
				"AW":"AW",
				"AY":"AY",
				"B": "B",
				"D": "D",
				"DH":"DH",
				"EH":"EH",
				"EY":"EY",
				"F": "F",
				"G": "G",
				"Y": "IY",
				"IH":"IY",
				"IY":"IY",
				"K": "K",
				"L": "L",
				"M": "M",
				"N": "N",
				"OW":"OW",
				"P": "P",
				"R": "R",
				"S": "S",
				"T": "T",
				"UH":"UW",
				"UW":"UW",
				"W": "UW",
				"V": "V",
				"Z": "Z",
				}

var cleanPhonemes = (phrase) => {
	let cleanedPhrase = [] // multidimensional array [["M","Y"], ["H","E","L","L"]]
	for (var j = 0; j < phrase.length; j++) {
		if (phrase[j]){
			let word = phrase[j].split(" ");
			let cleanedWord = []
			for (i=0;i<word.length;i++){
				cleanPhoneme = word[i].replace(/\d+/g, '')

				// check if we can represent that phoneme in our system
				if(phonemeInventory.indexOf(cleanPhoneme) !== -1) {
		  			cleanedWord.push(cleanPhoneme)
				}
				else{
					

					switch(cleanPhoneme) {
					  case "ER":
					    cleanedWord.push("AH");
					    cleanedWord.push("R");
					    break;
					  case "NG":
					    cleanedWord.push("N");
					    cleanedWord.push("G");
					    break;
					  case "OY":
					    cleanedWord.push("AA");
					    cleanedWord.push("IY");
					    break;
					  default:
					  	console.log("adding to greybois: ",cleanPhoneme)
						greyBois.add(cleanPhoneme)
					}
				}
			}
			cleanedPhrase.push(cleanedWord)}
	}
	if(greyBois.size >= 1){
		greyBoisArr = []
		for(let e of greyBois){greyBoisArr.push("/"+ArpabetToIpaTable[e]+"/")}

		updateConsole("WARNING: the following phonemes will not be rendered in our encoding system: "+greyBoisArr.toString())
	}
	greyBois = new Set([]);
	return cleanedPhrase
}

function getLastPhoneme(phraseArr,idx){
	return phraseArr[Math.min(idx,phraseArr.length-1)][phraseArr[Math.min(idx,phraseArr.length-1)].length-1]
}

function removeEvent(){
	console.log("removed event")
}
	
function playPhrase(phraseArr, idx){
	idx++;
	console.log("calling playPhrase: ",idx, phraseArr[idx]);

	let lastPhoneme = getLastPhoneme(phraseArr,idx);
	
	// remove prev event listener

	if (idx==phraseArr.length){

				// phraseArr[idx-1][phraseArr[idx-1].length-1].removeEventListener("ended", playPhrase)
				sendingPhonemes = false;
				console.log("reached base case")
				$("#send")[0].classList.toggle("disabled")
				$("#recordButton")[0].classList.toggle("disabled")
				if(typeof $("#response")[0] !== 'undefined'){
					$("#response")[0].classList.toggle("disabled")
				}

				updateConsole("...complete!");
				
				// ===================================================\\
				//  the following are defined in listenerUI.js
				// 
				playAgainStart = new Date();
				// ===================================================//

				$("#textField").val("");
		return;

	};

	lastPhoneme.addEventListener('ended', ()=>setTimeout(()=>{
												return playPhrase(phraseArr,idx)},
												timeBetweenWords),{once:true});
	playWord(phraseArr[idx],-1);
}

function playWord(wordArr, idx){
	idx++;
	if (idx==wordArr.length) return;
	wordArr[idx].addEventListener('ended', ()=>setTimeout(()=>{return playWord(wordArr,idx)}, timeBetweenPhonemes));
	try{
		wordArr[idx].play();
	}
	catch(err){
		updateConsole("error: "+err+". Try refreshing the page and clicking on an element in the page before playing")
	}
}


function constructPhraseArr(cleanedPhraseToPlay){
	let phraseArray = []
	for (let j = 0; j<cleanedPhraseToPlay.length; j++) {
		let wordArray = []
		for(let k=0; k<cleanedPhraseToPlay[j].length; k++){
			wordArray.push(new Audio("haptemes/"+conflation[cleanedPhraseToPlay[j][k]]+".wav"))
		}
		phraseArray.push(wordArray)
	}
	return phraseArray;
}



socket.on("loadPhonemes", (phonemes) => {
	console.log("The Phonemes:", phonemes["transcription"]);
	rawPhonemes = [];
	cleanedPhraseToPlay = [];
	console.log("recieved? ",phonemes["transcription"])
	rawPhonemes = phonemes["transcription"]
	cleanedPhraseToPlay = cleanPhonemes(rawPhonemes); // C.
	phrasePlaylist = constructPhraseArr(cleanedPhraseToPlay);
	console.log("cleand up: ",cleanedPhraseToPlay)
	console.log("playlist: ",phrasePlaylist)

	if(phonemes["text"]){
		play();

	}

})

socket.on("play",()=>{

	play();
})

var play = function(){
	if (!recording && !sendingPhonemes && !processingSpeech){
		if(rawPhonemes.length>0)
			console.log("got transcription")
		else{
			updateConsole("⚠️ No transcription available. Try pressing record.");
			return
		}
		$("#send")[0].classList.toggle("disabled")
		$("#recordButton")[0].classList.toggle("disabled")
		if(typeof $("#response")[0] !== 'undefined'){
			$("#response")[0].classList.toggle("disabled")
		}

		updateConsole("✨ sending haptic encoding...");
		// let cleanedPhrase = cleanPhonemes(rawPhonemes); U.C.
		// playlist(cleanedPhrase); U.C.

		playPhrase(phrasePlaylist,-1) // C.
		sendingPhonemes = true;
	}
	else{
		if(recording) updateConsole("Whoa! You're recording! Finish what you're saying first before sending it.");
		if(processingSpeech) updateConsole("Slow down buddy I'm still processing what you just said...");

	}

}

$(document).ready( () =>{
	$("#send").click(()=>{
		// play()
		
	})
})


// TODO: purge phonemes  rec. raw phonemes
// wtf up with really long bois