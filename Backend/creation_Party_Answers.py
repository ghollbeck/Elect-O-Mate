import pandas as pd
import json


# Load the CSV file with the correct delimiter
file_path = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Old_Version_Gabor_Not_Used/Sources/Wahlomat/WahlOMAT_DatensatzFOR_JSON.csv'
df = pd.read_csv(file_path, delimiter=';')

# Initialize an empty list to store JSON entries
json_list = []

# Iterate through each row in the dataframe
for index, row in df.iterrows():
    entry = {
        "Question_Number": row[df.columns[2]],
        "Party_Name": row[df.columns[0]],
        "Full_Party_Name": row[df.columns[1]],
        "Question_Label": row[df.columns[3]],
        "Party_Answer": row[df.columns[5]]
    }
    json_list.append(entry)

for index, row in df.iterrows():
    entry = {
        "Question_Number": row[df.columns[2]],
        "Party_Name": row[df.columns[0]],
        "Full_Party_Name": row[df.columns[1]],
        "Question_Label": row[df.columns[3]],
        "Party_Answer": row[df.columns[5]]
    }
    json_list.append(entry)

# Convert the list to JSON
json_output = json.dumps(json_list, indent=4, ensure_ascii=False)

# Save to a JSON file
output_file_path = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Party_Answers_Converted.json'
with open(output_file_path, 'w', encoding='utf-8') as json_file:
    json_file.write(json_output)

print(f"JSON file has been created at: {output_file_path}")
