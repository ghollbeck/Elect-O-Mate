from pymongo import MongoClient
import os


import openai
from openai import OpenAI

prompt = "who killed Kennedy"
res = openai.embeddings.create(
input=[prompt],
model = "text-embedding-ada-002"
)
#xq = res.data[0].embedding








# MongoDB connection string
mongo_uri = "mongodb://localhost:27017/"
client = MongoClient(mongo_uri)

# Specify the database and collection
db = client['ChromaDB']
if 'DataCollection' not in db.list_collection_names():
    db.create_collection('DataCollection')
collection = db['DataCollection']

SourceDirectory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources'
ChromaDB_Directory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources/ChromaDB'
SourceDirectory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources'


def create_embedding():
    # os.walk returns a generator, that creates a tuple of values
    # (current_path, directories in current_path, files in current_path)
    for current_path, directories, files in os.walk(SourceDirectory):
        for filename in files:
            if filename.endswith('.md'):
                # construct full file path
                filepath = os.path.join(current_path, filename)
                with open(filepath, 'r') as f:
                    fileContent = f.read()
                    filecontent = f"folgender Text stammt aus dem {filename}: {fileContent}"
                # Insert the document into the MongoDB collection
                collection.insert_one({'_id': filepath, 'content': fileContent})
    print("created new collection")