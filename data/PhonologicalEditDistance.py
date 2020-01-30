import helpers
import numpy as np
from corpustools.corpus import io
from corpustools.symbolsim import phono_edit_distance

'''
MUST RUN SUDO

 :I

 ALSO NEEDS PCT V. 1.1.0!

idk why but it crashes on all others...

'''





#downloads a Hayes feature matrix
io.binary.download_binary("ipa2hayes", "/matrix", call_back=None)
ipa2hayes = io.binary.load_binary("/matrix")
io.binary.save_binary(ipa2hayes, "/matrix")
# try:
# except:
# 	print("error in loading matrix, did you run as sudo?")
# 	exit()


myCorpus = io.csv.load_corpus_csv(
	"corpusA", 
	"corpora/corpusA.csv", 
	",")

listenerCorpus = io.csv.load_corpus_csv(
	"corpusB", 
	"corpora/corpusB.csv", 
	",")


headers = ["edit_distance","normalized_edit_distance","accuracy"]
toWrite = []

def punishingfn(x):
	return np.minimum(np.log((3.4*x)+1),1) # a log that approaches 1 at ~x=0.5


print(punishingfn(0))
print(punishingfn(0.2))
print(punishingfn(0.5))
print(punishingfn(1))
print(punishingfn(2))


for word in myCorpus.wordlist:
	print(myCorpus.wordlist.get(word))

	phonoEditDistance = phono_edit_distance.phono_edit_distance(
				myCorpus.wordlist.get(word),
				listenerCorpus.wordlist.get(word),
				"transcription",
				io.binary.load_binary("/matrix")
				)
	
	controlDistance = phono_edit_distance.phono_edit_distance(
			myCorpus.wordlist.get(word),
			listenerCorpus.wordlist.get("control"),
			"transcription",
			io.binary.load_binary("/matrix")
			)

	print("control distance: ",controlDistance)

	normalizedAccuracy = 1-punishingfn(phonoEditDistance/float(controlDistance))
	print(myCorpus.wordlist.get(word).transcription, "vs", listenerCorpus.wordlist.get(word).transcription,"PED:",phonoEditDistance,)
	toWrite.append({"edit_distance":phonoEditDistance,
					"normalized_edit_distance":np.minimum(phonoEditDistance/float(controlDistance,),1),
					"accuracy":normalizedAccuracy})


helpers.writeCSV("edit_distance.csv",headers,toWrite)


	# for compareWord in listenerCorpus.wordlist:

	# 	phonoEditDistance = phono_edit_distance.phono_edit_distance(
	# 			myCorpus.wordlist.get(word),
	# 			listenerCorpus.wordlist.get(compareWord),
	# 			"transcription",
	# 			io.binary.load_binary("/matrix")
	# 			)
	# 	print("comparing giant phono sim list!!: ",
	# 			myCorpus.wordlist.get(word).transcription,
	# 			" to: ",
	# 			listenerCorpus.wordlist.get(compareWord).transcription, 
	# 			": ", 
	# 			phonoEditDistance
	# 			)
	# 	giantPhonoSimList.append(phonoEditDistance)




# for word in myCorpus:
# 	# print(word.transcription)

# 	phonoEditDistance = phono_edit_distance.phono_edit_distance(
# 				myCorpus.wordlist.get(word),
# 				listenerCorpus.wordlist.get(compareWord),
# 				"transcription",
# 				io.binary.load_binary("/matrix")
# 				)
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

