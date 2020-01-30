import math
from collections import Counter
import helpers
from scipy import stats

path = "dummy_data.csv"

data = helpers.readCSV(path)

def entropy(s):
    p, lns = Counter(s), float(len(s))
    print(p,lns)
    return - sum( count/lns * math.log(count/lns, 2) for count in p.values())


entropyVals = []

def main():
	for row in data:
		print(row["target_phrase"],entropy(row["target_phrase"]))
		entropyVals.append({"entropy":entropy(row["target_phrase"])})
	print(entropyVals)
	helpers.writeCSV(path+"_ENTROPY.csv",["entropy"],entropyVals)
