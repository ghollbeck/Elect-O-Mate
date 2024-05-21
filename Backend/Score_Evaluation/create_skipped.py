import json
import random

# Open the JSON file and load the data
with open('/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/-1_0_1_Answers.json', 'r') as f:
    data = json.load(f)

# Add the new key-value pair to each dictionary

    # Alternate between 1 and -1
    for i, item in enumerate(data):
        item["users_answer"] = 1 if i % 2 == 0 else -1


# Write the updated data back to the JSON file
with open('/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/-1_0_1_Answers.json', 'w') as f:
    json.dump(data, f, indent=4)