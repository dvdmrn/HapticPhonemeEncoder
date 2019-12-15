var timeBetweenPhonemes = 500 // in ms
var timeBetweenWords = 1000 // in ms
let phonemeInventory = ["AA","AY","D", "F", "K","N", "R","UW", "AH","B", "EH","G", "L","OW","S","V", "AW","DH","EY","IY","M","P", "T","Z"]

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
		let word = phrase[j].split(" ");
		let cleanedWord = []
		for (i=0;i<word.length;i++){
			console.log("word pre-replace: ")
			cleanPhoneme = word[i].replace(/\d+/g, '')

			// check if we can represent that phoneme in our system
			if(phonemeInventory.indexOf(cleanPhoneme) !== -1) {
	  			cleanedWord.push(cleanPhoneme)
			}
			else{
				greyBois.add(cleanPhoneme)
			}
		}
		cleanedPhrase.push(cleanedWord)
	}
	console.log("the cleaned up phonemes: ",cleanedPhrase)
	if(greyBois.size >= 1){
		greyBoisArr = []
		for(let e of greyBois){greyBoisArr.push("/"+ArpabetToIpaTable[e]+"/")}
		console.log("grey bois: ",greyBoisArr.toString())
		console.log("grey bois: ",greyBois)
		updateConsole("WARNING: the following phonemes will not be rendered in our encoding system: "+"{"+greyBoisArr.toString()}"}")
	}
	greyBois = new Set([]);
	return cleanedPhrase
}

function playlist(phrase) {
	for (let k=0;k<phrase.length;k++){
		playbackTime = ((k-1)<0) ? 0 : getPlaybackTime(phrase[k-1])
		console.log("timeout",i,": ",playbackTime+(timeBetweenWords*k)) 
		setTimeout(()=>{playWord(phrase[k])},playbackTime+(timeBetweenWords*k))
	}
}




function getPlaybackTime(word){
	let timeToWait = 0
	for (let i = 0; i < word.length; i++) {
		timeToWait += (i*timeBetweenPhonemes)+(Math.ceil(sounds[word[i]].duration*1000))
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
	console.log("load phonemes called!");
	console.log("The Phonemes:", phonemes);
	rawPhonemes = phonemes
	cleanedPhraseToPlay = cleanPhonemes(rawPhonemes); // C.
})


$(document).ready( () =>{
	$("#send").click(()=>{
		rawPhonemes.length>0? console.log("got transcription") : updateConsole("⚠️ No transcription available. Try pressing record.")
		
		// let cleanedPhrase = cleanPhonemes(rawPhonemes); U.C.
		// playlist(cleanedPhrase); U.C.
		playlist(cleanedPhraseToPlay) // C.
	})
})