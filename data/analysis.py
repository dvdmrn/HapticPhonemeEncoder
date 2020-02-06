import csv
import pandas as pd 
import numpy as np
import cmudict


df = pd.read_csv('ALL_PARTICIPANTS.csv')

ave_response_time = np.mean(df.response_time)
ave_play_again_per_turn = np.mean(df.n_playAgain)


print((ave_response_time/float(1000))/float(60))
print((np.std(df.response_time)/float(1000))/float(60))
print(ave_play_again_per_turn)
print(np.std(df.n_playAgain))

