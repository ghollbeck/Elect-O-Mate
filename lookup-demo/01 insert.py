from common import *
from doclist import docs

# clear previous documents
db.docs.drop()

i = 0
for doc in docs:
    doc["id"] = i

    # convert date format 2024-04-15 to datetime
    doc["date"] = datetime.strptime(doc["date"], "%Y-%m-%d")

    db.docs.insert_one(doc)
    i += 1