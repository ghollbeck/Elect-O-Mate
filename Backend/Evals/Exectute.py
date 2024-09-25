from Calc import *
from AI_Answer_Generator import *
import os

# folder_path = "Backend/Evals/Party_Answers_Json"

# for filename in os.listdir(folder_path):
#     if filename.endswith(".json"):
#         CreateCSV(os.path.join(folder_path, filename))

# filepath = "./Backend/Evals/Party_Answers_Json/Party_Answers_Converted_de.json"
# execute_calc(filepath,"OAI")


# CalcError("Backend/Evals/AI_Answers_CSV/AI_Answer_Matrix_OAIGermany_CSV.csv","Backend/Evals/AI_Answers_CSV/AI_Answer_Matrix_OAIGermany_CSV_based_on_Json.csv")



filepath = "./Backend/Evals/Party_Answers_Json/Party_Answers_Converted_de.json"
execute_calc2(filepath,"OAI")


# import json

# def delete_party_answers(filepath):
#     with open(filepath, 'r', encoding='utf-8') as file:
#         data = json.load(file)

#     # Delete the Party_Answer value for each party in party_answers
#     for party in data['party_answers']:
#         party['Party_Answer'] = None  # or use `del party['Party_Answer']` to remove the key entirely

#     with open(filepath, 'w', encoding='utf-8') as file:
#         json.dump(data, file, ensure_ascii=False, indent=4)

# # Call the function with the specified file path
# delete_party_answers("Backend/Evals/Party_Answers_Json/Party_Answers_Converted_de.json")
