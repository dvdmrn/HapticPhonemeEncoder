import helpers


from corpustools.corpus import io
from corpustools.symbolsim import phono_edit_distance

'''
MUST RUN SUDO

 :I

'''





#downloads a Hayes feature matrix
try:
	io.binary.download_binary("ipa2hayes", "/matrix", call_back=None)

	ipa2hayes = io.binary.load_binary("/matrix")
	io.binary.save_binary(ipa2hayes, "/matrix")
except:
	print("error in loading matrix, did you run as sudo?")
	exit()


# myCorpus = io.csv.load_corpus_csv(
# 	"corpusA", 
# 	"corpusA.csv", 
# 	",", 
# 	".", 
# 	annotation_types=None, 
# 	feature_system_path=None, 
# 	stop_check=None, 
# 	call_back=None
# 	)

io.csv.load_corpus_csv('corpusA',"tiered.txt",delimiter=',')

# myCorpus = io.csv.load_corpus_csv(
# 	"dummy_corpus", 
# 	"dummy_corpus.csv", 
# 	",", 
# 	".")

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

