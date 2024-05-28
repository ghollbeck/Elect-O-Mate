# import json

# # Load the Hungary.json file
# with open('/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Old_Version_Gabor_Not_Used/Sources/EU_Wide_Json_Files/Hungary.json', 'r', encoding='utf-8') as file:
#     hungary_data = json.load(file)

# # Prepare the new structure
# new_structure = {
#     "party_names": ["Mi Hazánk", "LMP", "DK-MSZP-P", "FIDESZ-KDNP", "MMN", "MOMENTUM", "2RK", "MKKP"],
#     "party_answers": []
# }

# # Map Hungarian party names to full names
# party_full_names = {
#     "Mi Hazánk": "Mi Hazánk Mozgalom",
#     "LMP": "Lehet Más a Politika",
#     "DK-MSZP-P": "Demokratikus Koalíció - Magyar Szocialista Párt - Párbeszéd",
#     "FIDESZ-KDNP": "Fidesz – Magyar Polgári Szövetség – Kereszténydemokrata Néppárt",
#     "MMN": "Mindenki Magyarországa Mozgalom",
#     "MOMENTUM": "Momentum Mozgalom",
#     "2RK": "Kétfarkú Kutya Párt",
#     "MKKP": "Magyar Kétfarkú Kutya Párt"
# }
# # Add the "question_OG" key value pair to the new structure
# new_structure["question_OG"] = hungary_data[0]["question_OG"]
# # Transform the data
# for question in hungary_data:
#     question_number = question["question_number"]
#     question_label = question["question_EN"]
#     question_label_og = question["question_OG"]




#     for party, answer in question.items():
#         if party not in ["question_number", "question_OG", "question_EN"]:
#             new_structure["party_answers"].append({
#                 "Question_Number": question_number,
#                 "Party_Name": party,
#                 "Party_Full_Name": party_full_names[party],
#                 "Question_Label_EN": question_label,
#                 "Question_Label_OG": question_label_og,

#                 "Party_Answer": answer
#             })

# # Save the new structure to a JSON file
# with open('/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Old_Version_Gabor_Not_Used/Sources/EU_Wide_Json_Files/Hungary_Converted.json', 'w', encoding='utf-8') as file:
#     json.dump(new_structure, file, ensure_ascii=False, indent=4)

# print("Transformation complete. The new file is saved as Hungary_Converted.json")








# ------------------ Hungary.json ------------------ NOW TO ITALY



# import json

# # Load the italy.json file
# with open('/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Old_Version_Gabor_Not_Used/Sources/EU_Wide_Json_Files/italy.json', 'r', encoding='utf-8') as file:
#     italy_data = json.load(file)

# # Prepare the new structure
# new_structure = {
#     "party_names": [
#         "Alternativa Popolare", "Partito Democratico", "Pace, Terra, Dignit'e0", "Azione-Siamo Europei",
#         "Democrazia Sovrana Popolare", "Forza Italia-Noi Moderati", "Stati Uniti d'Europa", "Fratelli d'Italia",
#         "Alleanza Verdi e Sinistra", "Movimento 5 Stelle", "Lega Salvini Premier"
#     ],
#     "party_answers": []
# }

# # Transform the data
# for question_key, question_data in italy_data.items():
#     question_number = int(question_key.split()[1])
#     question_label = question_data["question"]
#     question_label_og = question_data["question"]  # Assuming the original question is the same as the English version for this context.

#     for party, answer in question_data["parties"].items():
#         new_structure["party_answers"].append({
#             "Question_Number": question_number,
#             "Party_Name": party,
#             "Party_Full_Name": party,  # Full name is assumed to be the same as the party name in this context
#             "Question_Label_EN": question_label,
#             "Question_Label_OG": question_label_og,
#             "Party_Answer": answer
#         })

# # Save the new structure to a JSON file
# with open('/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Old_Version_Gabor_Not_Used/Sources/EU_Wide_Json_Files/Italy_Converted.json', 'w', encoding='utf-8') as file:
#     json.dump(new_structure, file, ensure_ascii=False, indent=4)

# print("Transformation complete. The new file is saved as Italy_Converted.json")



#####-------- NOW POLAND: --------#####

import json

# Load the Poland.json file
with open('/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Old_Version_Gabor_Not_Used/Sources/EU_Wide_Json_Files/Poland.json', 'r', encoding='utf-8') as file:
    poland_data = json.load(file)

# Prepare the new structure
new_structure = {
    "party_names": [
        "Trzecia Droga", "PiS", "Lewica", "Koalicja Obywatelska",
        "Konfederacja", "Bezpartyjni", "PolExit"
    ],
    "party_answers": []
}

# Transform the data
for question_key, question_data in poland_data.items():
    question_number = int(question_key.split()[1])
    question_label = question_data["question"]

    for party, answer in question_data["parties"].items():
        new_structure["party_answers"].append({
            "Question_Number": question_number,
            "Party_Name": party,
            "Party_Full_Name": party,  # Full name is assumed to be the same as the party name in this context
            "Question_Label_EN": question_label,
            "Party_Answer": answer
        })

# Save the new structure to a JSON file
with open('/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Old_Version_Gabor_Not_Used/Sources/EU_Wide_Json_Files/Poland_Converted.json', 'w', encoding='utf-8') as file:
    json.dump(new_structure, file, ensure_ascii=False, indent=4)

print("Transformation complete. The new file is saved as Poland_Converted.json")
