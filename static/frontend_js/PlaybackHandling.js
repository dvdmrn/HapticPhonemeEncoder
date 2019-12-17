var timeBetweenPhonemes = 100 // in ms
var timeBetweenWords = 2000 // in ms
let phonemeInventory = ["AA","AY","D", "F", "K","N", "R","UW", "AH","B", "EH","G", "L","OW","S","V", "AW","DH","EY","IY","M","P", "T","Z"]
var sendingPhonemes = false
// let phonemeInventory = ["AA","AE","AH","AO","AW","AX","AXR","AY","EH","ER","EY","IH","IX","IY","OW","OY","UH","UW","UX","B","CH","D","DH","DX","EL","EM","EN","F","G","HH","JH","K","L","M","N","NG","P","Q","R","S","SH","T","TH","V","W","WH","Y","Z","ZH"]
var cleanedPhraseToPlay = []
var greyBois = new Set([])
var rawPhonemes = []
var sounds = 	{
				"AA": new Audio("haptemes/AA.wav"), 
				"AH": new Audio("haptemes/AH.wav"), 
				"AW": new Audio("haptemes/AW.wav"),
				"AY": new Audio("haptemes/AY.wav"),
				"B": new Audio("haptemes/B.wav"),
				"D": new Audio("haptemes/D.wav"),
				"DH": new Audio("haptemes/DH.wav"),
				"EH": new Audio("haptemes/EH.wav"),
				"EY": new Audio("haptemes/EY.wav"),
				"F": new Audio("haptemes/F.wav"),
				"G": new Audio("haptemes/G.wav"),
				"IY": new Audio("haptemes/IY.wav"),
				"K": new Audio("haptemes/K.wav"),
				"L": new Audio("haptemes/L.wav"),
				"M": new Audio("haptemes/M.wav"),
				"N": new Audio("haptemes/N.wav"),
				"OW": new Audio("haptemes/OW.wav"),
				"P": new Audio("haptemes/P.wav"),
				"R": new Audio("haptemes/R.wav"),
				"S": new Audio("haptemes/S.wav"),
				"T": new Audio("haptemes/T.wav"),
				"UW": new Audio("haptemes/UW.wav"),
				"V": new Audio("haptemes/V.wav"),
				"Z": new Audio("haptemes/Z.wav"),
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
					greyBois.add(cleanPhoneme)
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

function playlist(phrase, idx) {
	console.log("playlist invoked @ ",idx, "W phrase: ",phrase)
	if(idx>=phrase.length){
		$("#send")[0].classList.toggle("disabled")
		$("#recordButton")[0].classList.toggle("disabled")

		updateConsole("...complete!");
		sendingPhonemes = false;
		return;
	}
	let next = function() {playlist(phrase, idx+1)}
	let delay = getPlaybackTime(phrase[Math.max(idx-1,0)]) + timeBetweenWords;
	console.log("le delay: ",delay)
	playWord(phrase[idx]);
	setTimeout(next,delay)

}




function getPlaybackTime(word){
	// word = ["W","O","R","D"]
	console.log("le word: ",word)
	let timeToWait = timeBetweenPhonemes*(word.length-1)
	console.log("ttwait: ",timeToWait)

	for (let i = 0; i < word.length; i++) {
		timeToWait += (Math.floor(sounds[word[i]].duration*1000))
		}
	return timeToWait	
}


function playWord(word) {
	console.log("playword invoked")
	for (let i = 0; i < word.length; i++) {
		setTimeout(()=>{
			sounds[word[i]].currentTime = 0;
			sounds[word[i]].play()
		},
			(i*timeBetweenPhonemes)+(Math.ceil(sounds[word[Math.max(i-1,0)]].duration*1000))
		)}
	}



socket.on("loadPhonemes", (phonemes) => {
	console.log("The Phonemes:", phonemes);
	rawPhonemes = [];
	cleanedPhraseToPlay = [];
	console.log("recieved? ",phonemes)
	rawPhonemes = phonemes
	cleanedPhraseToPlay = cleanPhonemes(rawPhonemes); // C.
	console.log("cleand up: ",cleanedPhraseToPlay)
})


$(document).ready( () =>{
	$("#send").click(()=>{
		if (!recording && !sendingPhonemes && !processingSpeech){
			if(rawPhonemes.length>0)
				console.log("got transcription")
			else{
				updateConsole("⚠️ No transcription available. Try pressing record.");
				return
			}
			$("#send")[0].classList.toggle("disabled")
			$("#recordButton")[0].classList.toggle("disabled")

			updateConsole("✨ sending haptic encoding...");
			// let cleanedPhrase = cleanPhonemes(rawPhonemes); U.C.
			// playlist(cleanedPhrase); U.C.
			playlist(cleanedPhraseToPlay,0) // C.
			sendingPhonemes = true;			
		}
		else{
			if(recording) updateConsole("Whoa! You're recording! Finish what you're saying first before sending it.");
			if(processingSpeech) updateConsole("Slow down buddy I'm still processing what you just said...");

		}
	})
})


// TODO: purge phonemes  rec. raw phonemes
// wtf up with really long bois