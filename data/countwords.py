import math
from collections import Counter
import helpers
from scipy import stats
import numpy as np

path = "p8/P8 01-31-2020 01:40:48 PM.csv"

data = helpers.readCSV(path)



wordsPerMsg = []

def main():
	for row in data:
		wordsPerMsg.append(len(row["target_phrase"].split(" ")))

	for word in wordsPerMsg:
		print(word)
	# print(wordsPerMsg)
	# print(np.mean(wordsPerMsg))
	# print(np.std(wordsPerMsg))



main()