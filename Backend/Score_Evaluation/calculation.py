import json
import numpy as np



def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def evaluate_answers(data_Party, data_User):
    num_questions = len(data_User)
    party_names = data_Party['party_names']
    party_full_names = data_Party['party_full_names']
    
    party_names_array = np.array(party_names)
    data_Party = data_Party['party_answers']
    user_answers_matrix = np.zeros((num_questions, 1))
    user_answers_matrix_Wheights = [0] * num_questions
    user_answers_matrix_Skipped = [0] * num_questions


    #create an array with the User answers in -1,0,1
    user_answers_matrix = np.zeros((num_questions, 1))
    for i, item in enumerate(data_User):
        if 'users_answer' in item:
            user_answers_matrix[i] = item['users_answer']
            print(item)
            
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
    

    # Initialize matrices
    party_answers_array = np.zeros((num_questions, len(party_names)))
    Difference_Matrix = np.zeros((num_questions, len(party_names)))

    # For each party, extract Party_Answer and append to matrix
    for i, party in enumerate(party_names):
        party_answers = [item['Party_Answer'] for item in data_Party if item['Party_Name'] == party]
        party_answers_array[:, i] = party_answers
        
    

    #Calculate the difference matrix
    for i in range(len(user_answers_matrix)):
        for j in range(len(party_answers_array[1])):
            Difference_Matrix[i,j] = abs(user_answers_matrix[i] - party_answers_array[i][j])
            
    
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
            
            for j in range(len(party_names)):
                Difference_Matrix[i,j] = (-1)*(Difference_Matrix[i,j]-2)*wheights_factor # normalizing so that the min difference equals the hights points you get + include wheifghts and skipped questions
                    

    column_sums = np.array([np.sum(Difference_Matrix[:,i]) for i in range(len(party_names))])

    #normalizong from the sum to a percentage, 76 is the max number one can get 
    #with num_question questions, 2*counter is the extra amount point one can get with wheights
    column_sums = column_sums/(num_questions*2 + 2*counter_wheighted - 2*counter_skipped) * 100
    column_sums = [round(column_sums[i], 1) for i in range(len(column_sums))]


    combined_list = [(a, b, c) for a, b, c in zip(column_sums, party_names, party_full_names)]
    combined_list.sort(key=lambda x: x[0], reverse=True)  

    return combined_list
