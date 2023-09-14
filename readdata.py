import pymongo
import csv

# Connect to the MongoDB database
client = pymongo.MongoClient("mongodb+srv://ashishgolla2003:NS011618@cluster0.ophbpqo.mongodb.net/")
db = client["my_database"]
collection = db["users"]

# Open the CSV file in read mode
with open("data.csv", "r") as csvfile:

    # Create a CSV reader object
    reader = csv.reader(csvfile, delimiter=",")
    fieldnames=['Name','Age','Role']
    # Skip header
    next(reader, None)

    # Insert the CSV data into the MongoDB collection
    for row in reader:
        document = {}
        for index, column in enumerate(fieldnames):
            document[column] = row[index]
        collection.insert_one(document)
    print(document)
print("Data successfully imported into MongoDB!")
