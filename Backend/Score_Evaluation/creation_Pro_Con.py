import json
import pandas as pd

input_file = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Score_Evaluation/Wahl-O-Mat Europa 2024_Datensatz_Perplexity.csv'
output_file = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Score_Evaluation/Pro_Con_Perplexity_output_Germany.json'

# Load the CSV file
data = pd.read_csv(input_file)

# Extract the relevant columns
questions = data.iloc[:, 0].tolist()
arguments = data.iloc[:, 2].tolist()
print(arguments[0])
# Create a list of dictionaries with the desired structure
json_data = []
for i in range(38):
    json_data.append({
        "question_number": str(i + 1),
        "question": questions[i],
        
        "Arguments": arguments[i]
    })

# Save the JSON data to a file
with open(output_file, 'w', encoding='utf-8') as json_file:
    json.dump(json_data, json_file, ensure_ascii=False, indent=4)
