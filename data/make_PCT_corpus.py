import csv
import epitran
import helpers


epi = epitran.Epitran('eng-Latn')

fileName = "dummy_data.csv" 
with open(fileName,"r") as csvFile:
	reader = csv.DictReader(csvFile)
	spelling = []
	transcriptions_speaker = []
	transcriptions_listener = []
	fieldnames = ['spelling', 'transcription', 'frequency']

	for row in reader:
		if row["target_phrase"] != row["reiterated_phrase"]:
			spelling.append(row["reiterated_phrase"]);
		transcriptions_speaker.append({"spelling":row["target_phrase"],
							   		   "transcription":epi.trans_delimiter(row["target_phrase"],"."),
							   		   "frequency":"1"})
		transcriptions_listener.append({"spelling":row["reiterated_phrase"],
							   			"transcription":epi.trans_delimiter(row["reiterated_phrase"],"."),
							   			"frequency":"1"})

	if(spelling):
		print("!!! Check spelling! ",spelling)


	helpers.writeCSV(fileName[:-4]+'_SPEAKER_transcriptions.csv',fieldnames,transcriptions_speaker)
	helpers.writeCSV(fileName[:-4]+'_LISTENER_transcriptions.csv',fieldnames,transcriptions_listener)


