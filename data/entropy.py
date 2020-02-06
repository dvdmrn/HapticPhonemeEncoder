import math
from collections import Counter
import helpers
from scipy import stats

path = "all_transcriptions.csv"

data = helpers.readCSV(path)

def entropy(s):
    p, lns = Counter(s), float(len(s))
    print(p,lns)
    return - sum( count/lns * math.log(count/lns, 2) for count in p.values())


entropyVals = []

def main():
	for row in data:
		print(row["transcription"],entropy(row["transcription"]))
		entropyVals.append({"entropy":entropy(row["transcription"])})
	print(entropyVals)
	helpers.writeCSV(path[:-4]+"_ENTROPY.csv",["entropy"],entropyVals)

main()