
import json
import numpy as np
import pprint


file_path_My_Answers = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/-1_0_1_Answers.json' 
file_path_Party_Answers = "/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Party_Answers_Converted.json"

party_names = [
    "CDU / CSU",
    "GRÜNE",
    "SPD",
    "AfD",
    "DIE LINKE",
    "FDP",
    "Die PARTEI",
    "FREIE WÄHLER",
    "Tierschutzpartei",
    "ÖDP",
    "FAMILIE",
    "Volt",
    "PIRATEN",
    "MERA25",
    "HEIMAT",
    "TIERSCHUTZ hier!",
    "Partei für schulmedizinische Verjüngungsforschung",
    "BIG",
    "Bündnis C",
    "PdH",
    "MENSCHLICHE WELT",
    "DKP",
    "MLPD",
    "SGP",
    "ABG",
    "dieBasis",
    "BÜNDNIS DEUTSCHLAND",
    "BSW",
    "DAVA",
    "KLIMALISTE",
    "LETZTE GENERATION",
    "PDV",
    "PdF",
    "V-Partei³"
]

# Add a number count to each party name
party_names_with_count = [(i+1, party) for i, party in enumerate(party_names)]



def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def main():
    # Read JSON file
    user_answers_matrix = np.zeros((38, 1))
    data_User = read_json_file(file_path_My_Answers)
    data_Party = read_json_file(file_path_Party_Answers)
    
    user_answers_matrix = np.zeros((38, 1))
    for i, item in enumerate(data_User):
        if 'users_answer' in item:
            user_answers_matrix[i] = item['users_answer']

    #cdu_answers = [item['Party_Answer'] for item in data_Party if item['Party_Name'] == 'CDU / CSU']

    # Get unique party names
    party_names = list(set([item['Party_Name'] for item in data_Party]))

    # Initialize matrix
    party_answers_matrix = []
    party_answers_array = np.zeros((38, 34))
    Difference_Matrix = np.zeros((38, 34))

    # For each party, extract Party_Answer and append to matrix
    for i, party in enumerate(party_names):
        party_answers = [item['Party_Answer'] for item in data_Party if item['Party_Name'] == party]
        party_answers_array[:, i] = party_answers


    Difference_Matrix = np.array([[abs(user_answers_matrix[question] - party_answers_array[question][party]) for party in range(len(party_answers_array[0]))] for question in range(len(user_answers_matrix))])
    column_sums = np.array([np.sum(Difference_Matrix[i,:]) for i in range(len(Difference_Matrix[0]))])
    


    for i, item in enumerate(data_User):
        counter = 0
        if 'Wheights' in item:
            if 'Wheights' == "true":
                counter += 1
                column_sums[i] = column_sums[i] * 2



    column_sums = column_sums/(72 + 2*counter) * 100
    column_sums = [round(column_sums[i], 2) for i in range(len(column_sums))]

    combined_list = []
    for i in range(len(column_sums)):
        combined_list.append([column_sums[i], party_names[i]])

    combined_list.sort(key=lambda x: x[0], reverse=True)  
    
    output_file_path = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Party_Overlap_List.json'
    with open(output_file_path, 'w') as file:
        json.dump(combined_list, file)

    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(combined_list[:10])









if __name__ == "__main__":
    main()

    