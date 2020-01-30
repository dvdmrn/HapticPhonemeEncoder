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



# import csv
# import pandas as pd 
# import numpy as np
# import cmudict
# from corpustools.corpus import io
# from corpustools.symbolsim import phono_edit_distance



# df = pd.read_csv('dummy_data.csv')


# print(df.transcription[0])


#downloads a Hayes feature matrix
# io.binary.download_binary("ipa2hayes", "/matrix", call_back=None)

# ipa2hayes = io.binary.load_binary("/matrix")
# io.binary.save_binary(ipa2hayes, "/matrix")

# ed = phono_edit_distance.phono_edit_distance(
# 				{"transcription":"o.w.o"},
# 				{"transcription":"u.w.u"},
# 				"transcription",
# 				io.binary.load_binary("/matrix")
# 				)

# print(ed)
# print("Features: ",ipa2hayes.features)


# print()

# ave_response_time = np.mean(df.response_time)
# ave_play_again_per_turn = np.mean(df.n_playAgain)




# print(cmudict.dict()["hello"][0])

