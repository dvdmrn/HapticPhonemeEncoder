import csv


def writeCSV(fileName, headers, toWrite):
	print("to write: ",toWrite)
	with open(fileName, 'w', newline='') as csvfile:
	    writer = csv.DictWriter(csvfile, fieldnames=headers)
	    writer.writeheader()
	    writer.writerows(toWrite)

def readCSV(filePath):
	with open(filePath,"r") as csvFile:
		reader = csv.DictReader(csvFile)
		return list(reader)