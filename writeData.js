const { Parser } = require('json2csv');
const fs = require('fs');
const fields = ['target_phrase','reiterated_phrase','reply_phrase','response_time','n_playAgain','t_playAgain'];


var fileName = "out.csv";

const json2csvParser = new Parser({ fields });


function init(fn){
	fileName = fn;
	let headers = fields.toString()+"\n"
	fs.appendFile(fileName, headers, function(err) {
		if (err) throw err;
		console.log('file saved');
	});

}

function writeRow(jsonRow){
	// jsonRow := an object in the form: [{car:"sexmobile",price:69,color:"farts"}] 

	const rowStr = json2csvParser.parse(jsonRow, {header: false});
	// this includes the header even though we specify it not to so we need to remove it
	headerlessRow = rowStr.split("\n")[1]
	headerlessRow+="\n"

	fs.appendFile(fileName, headerlessRow, function(err) {
		if (err) throw err;
		console.log('file saved');
	});

}
// init()
// writeRow([{target_phrase:"hello worl", response_phrase:"Henlo World", response_time:69, n_playAgain:6, t_playAgain:[10,444,32,34]}])

exports.fileName = fileName;
exports.init = init;
exports.writeRow = writeRow;