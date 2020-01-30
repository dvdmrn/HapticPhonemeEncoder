import csv
import pandas as pd 
import numpy as np
import cmudict


df = pd.read_csv('dummy_data.csv')

ave_response_time = np.mean(df.response_time)
ave_play_again_per_turn = np.mean(df.n_playAgain)

print(ave_response_time)
print(ave_play_again_per_turn)

