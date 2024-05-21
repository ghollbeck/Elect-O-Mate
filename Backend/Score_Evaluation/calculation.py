import json
import numpy as np
import pprint
pp = pprint.PrettyPrinter(indent=4)


file_path_My_Answers = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Score_Evaluation/-1_0_1_User_Answers.json' 
file_path_Party_Answers = "/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Score_Evaluation/Party_Answers_Converted.json"



party_names = ["CDU / CSU", "GRÜNE", "SPD", "AfD", "DIE LINKE", "FDP", "Die PARTEI", "FREIE WÄHLER", "Tierschutzpartei", "ÖDP", "FAMILIE", "Volt", "PIRATEN", "MERA25", "HEIMAT", "TIERSCHUTZ hier!", "Partei für schulmedizinische Verjüngungsforschung", "BIG", "Bündnis C", "PdH", "MENSCHLICHE WELT", "DKP", "MLPD", "SGP", "ABG", "dieBasis", "BÜNDNIS DEUTSCHLAND", "BSW", "DAVA", "KLIMALISTE", "LETZTE GENERATION", "PDV", "PdF", "V-Partei³"]
party_to_index = {party: index for index, party in enumerate(party_names)}
party_names_array= np.array(party_names)
# Add a number count to each party name
party_names_with_count = [(i+1, party) for i, party in enumerate(party_names)]



def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def main():
    # Read JSON file
    pp = pprint.PrettyPrinter(indent=4)
    user_answers_matrix = np.zeros((38, 1))
    user_answers_matrix_Wheights = [0] * 38
    user_answers_matrix_Skipped = [0] * 38
    data_User = read_json_file(file_path_My_Answers)
    data_Party = read_json_file(file_path_Party_Answers)


    #create an array with the User answers in -1,0,1
    user_answers_matrix = np.zeros((38, 1))
    for i, item in enumerate(data_User):
        if 'users_answer' in item:
            user_answers_matrix[i] = item['users_answer']
#create an array with the whieghts yes/no in 0,1
#create an array with the whieghts yes/no in 0,1
    for i, item in enumerate(data_User):
        if 'Wheights' in item:
            if item['Wheights'] == "true":
                user_answers_matrix_Wheights[i] = 1 
            else:
                user_answers_matrix_Wheights[i] = 0
        if 'Skipped' in item:
            if item['Skipped'] == "true":
                user_answers_matrix_Skipped[i] = 1 
            else:
                user_answers_matrix_Skipped[i] = 0
    
    #following not needed, but nice to have for debugging
    #output_csv_file_path = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/user_answers_matrix.csv'
    #np.savetxt(output_csv_file_path, user_answers_matrix, delimiter=',')



    # Initialize matrices
    party_answers_array = np.zeros((38, 34))
    Difference_Matrix = np.zeros((38, 34))

    # For each party, extract Party_Answer and append to matrix
    for i, party in enumerate(party_names):
        party_answers = [item['Party_Answer'] for item in data_Party if item['Party_Name'] == party]
        party_answers_array[:, i] = party_answers
    

    

    # Store party_answers_array in a CSV file, not needed, but nice to have for debugging
    #output_csv_file_path = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Party_Answers.csv'
    #np.savetxt(output_csv_file_path, party_answers_array, delimiter=',')

    #Calculate the difference matrix
    for i in range(len(user_answers_matrix)):
        for j in range(len(party_answers_array[1])):
            Difference_Matrix[i,j] = abs(user_answers_matrix[i] - party_answers_array[i][j])
    print(user_answers_matrix_Skipped)
    counter_wheighted = 0
    counter_skipped = 0
    for i, item in enumerate(data_User):
            wheights_factor = 1
            if user_answers_matrix_Skipped[i] == 1:
                        wheights_factor = 0
                        counter_skipped += 1
            elif user_answers_matrix_Wheights[i] == 1:
                    wheights_factor = 2
                    counter_wheighted += 1
            
            for j in range(34):
                Difference_Matrix[i,j] = (-1)*(Difference_Matrix[i,j]-2)*wheights_factor # normalizing so that the min difference equals the hights points you get + include wheifghts and skipped questions
                    
                
                

    column_sums = np.array([np.sum(Difference_Matrix[:,i]) for i in range(34)])
    print(f"counter_wheighted: {counter_wheighted}")
    print(f"counter_skipped: {counter_skipped}")
    # #save as csv for manual checking, not really needed indeed
    # output_csv_file_path = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Difference_Matrix.csv'
    # np.savetxt(output_csv_file_path, Difference_Matrix, delimiter=',')

    # output_csv_file_path = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/column_sums.csv'
    # np.savetxt(output_csv_file_path, column_sums, delimiter=',')



    #normalizong from the sum to a percentage, 76 is the max number one can get 
    #with 38 questions, 2*counter is the extra amount point one can get with wheights
    column_sums = column_sums/(76 + 2*counter_wheighted - 2*counter_skipped) * 100
    column_sums = [round(column_sums[i], 1) for i in range(len(column_sums))]


    # Combining the two lists of Overlap of the user and the party (column_sums) and the party names
    combined_list = [(a, b) for a, b in zip(column_sums, party_names_array)] #ALTERNATIVE LIST APPENING
    combined_list.sort(key=lambda x: x[0], reverse=True)  

    # Write JSON file    
    output_file_path = "/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Score_Evaluation/Final_Result_Party_Overlap_List_Germany.json"
    with open(output_file_path, 'w',encoding='utf8') as file:
        json.dump(combined_list, file, ensure_ascii=False)


    pp.pprint(combined_list[:20])










if __name__ == "__main__":
    main()

    
    