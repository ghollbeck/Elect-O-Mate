
import json
import numpy as np
import pprint


file_path_My_Answers = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/-1_0_1_Answers.json' 
file_path_Party_Answers = "/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Party_Answers_Converted.json"

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def main():
    # Read JSON file
    data_User = read_json_file(file_path_My_Answers)
    data_Party = read_json_file(file_path_Party_Answers)
    
    user_answers_matrix = [[item['users_answer']] for item in data_User if 'users_answer' in item]

    #cdu_answers = [item['Party_Answer'] for item in data_Party if item['Party_Name'] == 'CDU / CSU']

    # Get unique party names
    party_names = list(set([item['Party_Name'] for item in data_Party]))

    # Initialize matrix
    party_answers_matrix = []
    party_answers_array = np.zeros((38, 34))

    # For each party, extract Party_Answer and append to matrix
    for i, party in enumerate(party_names):
        party_answers = [item['Party_Answer'] for item in data_Party if item['Party_Name'] == party]
        print(len(party_answers))
    #     party_answers_array[:, i] = party_answers

    # dim1 = len(party_answers_matrix[0])
    # dim2 = len(party_answers_matrix[1])

# Create a zeros array with the required dimensions
    #zeros_array = np.zeros((dim1, dim2))
    #party_answers_matrix2 = np.array(party_answers_matrix)
    #user_answers_matrix2 = np.array(user_answers_matrix)

    # Ensure user_answers_matrix is a 2D array with the same number of rows as party_answers_matrix
    #user_answers_matrix = np.reshape(user_answers_matrix, (party_answers_matrix.shape[0], -1))

    #    Calculate the difference
    #Difference_Matrix = np.abs(user_answers_matrix - party_answers_matrix)

    #Difference_Matrix = [[abs(user_answers_matrix[question] - party_answers_matrix[question][party]) for party in range(len(party_answers_matrix[0]))] for question in range(len(user_answers_matrix))]
    #column_sums = [sum(row[i] for row in Difference_Matrix) for i in range(len(Difference_Matrix[1]))]

    #pp = pprint.PrettyPrinter(indent=4)
    #pp.pprint(data_Party)

if __name__ == "__main__":
    main()

    