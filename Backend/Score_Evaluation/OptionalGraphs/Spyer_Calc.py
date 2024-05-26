import numpy as np
import json
import pprint
pp = pprint.PrettyPrinter(indent=4)##
import os
print(os.getcwd())

file_path_Party_Answers = "./Party_Answers_Converted.json"
file_path_My_Answers = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Score_Evaluation/-1_0_1_User_Answers.json' 
party_names = ["CDU / CSU", "GRÜNE", "SPD", "AfD", "DIE LINKE", "FDP", "Die PARTEI", "FREIE WÄHLER", "Tierschutzpartei", "ÖDP", "FAMILIE", "Volt", "PIRATEN", "MERA25", "HEIMAT", "TIERSCHUTZ hier!", "Partei für schulmedizinische Verjüngungsforschung", "BIG", "Bündnis C", "PdH", "MENSCHLICHE WELT", "DKP", "MLPD", "SGP", "ABG", "dieBasis", "BÜNDNIS DEUTSCHLAND", "BSW", "DAVA", "KLIMALISTE", "LETZTE GENERATION", "PDV", "PdF", "V-Partei³"]



def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data



# Read JSON file
pp = pprint.PrettyPrinter(indent=4)
user_answers_matrix = np.zeros((38, 1))
user_answers_matrix_Wheights = [0] * 38
user_answers_matrix_Skipped = [0] * 38
data_Party = read_json_file(file_path_Party_Answers)
data_User = read_json_file(file_path_My_Answers)


#create an array with the User answers in -1,0,1
user_answers_matrix = np.zeros((38, 1))
for i, item in enumerate(data_User):
    if 'users_answer' in item:
        user_answers_matrix[i] = item['users_answer']

party_answers_array = np.zeros((38, 34))

for i, party in enumerate(party_names):
    party_answers = [item['Party_Answer'] for item in data_Party if item['Party_Name'] == party]
    party_answers_array[:, i] = party_answers

# Define the categories and their corresponding question numbers
categories_and_questions = {

    "Offene Aussenpolitik": [4,-6,10,12,15,20,-22,-24,-25,-29,-33,37,38],
    "Liberale Wirtschaftspolitik": [-1, 2,11,-21,22,26,-33,-35], 
    "Restriktive Finanzpolitik": [-1, -5,-11,19,31, 33,-37],
    "Law & Order": [7,12,-17,19,-23],
    "Restriktive Migrationspolitik": [-3,-27,-32,36], 
    "Ausgebauter Umweltschutz": [-2,5,-8,9,-11,-14,18,21,-22,-26,-31,35],
    "Ausgebauter Sozialstaat": [5,30, 12,-15,16,27],
    "Liberale Gesellschaft": [7,16,23,28,34]
}

# Convert to numpy array
categories_array = np.array(list(categories_and_questions.items()), dtype=object)





def calculate_category_sums(user_answers, categories_and_questions):
    # Initialize a dictionary to store the sums for each category
    category_sums = np.zeros((8, 1))
    i =-1
    # Loop over each category and its corresponding question numbers
    for category, question_numbers in categories_and_questions.items():
        # Initialize the sum for this category
        category_sum = 0
        i +=1
        print(i)
        # Loop over the question numbers for this category
        for question_number in question_numbers:
            amount_questions_in_category = len(question_numbers)
            # Subtract 1 from the question number to get the index in the user_answers list
            index = abs(question_number) - 1
            print(f"Index: {index}")
            score = user_answers[index] * question_number / abs(question_number)
            # Add the user's answer for this question to the category sum 
            if score > 0:
                #print(f"Score of question {question_number} is positive: answer_matrixelement_ {user_answers[index]}")
                category_sum += score
            elif score == 0:
                #print(f"Score of question {question_number} is zero: answer_matrixelement_ {user_answers[index]}")
                category_sum += 0.5
            else:
                #print(f"Score of question {question_number} is negative: answer_matrixelement_ {user_answers[index]}")
                category_sum += 0
            
        #print(f"{category_sum}/{amount_questions_in_category}")
        # Store the category sum in the dictionary
        category_sums[i] = 100*category_sum/amount_questions_in_category


    # Convert the sums to numpy arrays
    # for category in category_sums:
    #     category_sums.append(category_sums[i])
    # print(f"Category SUMS: {category_sums}")    
    return category_sums

    # Calculate the category sums for the user's answers
category_sums_User = calculate_category_sums(user_answers_matrix, categories_and_questions)
category_sums_CDU = calculate_category_sums(party_answers_array[:, 0], categories_and_questions)
category_sums_Grünen = calculate_category_sums(party_answers_array[:, 1], categories_and_questions)
category_sums_Volt = calculate_category_sums(party_answers_array[:, 11], categories_and_questions)

print(f"Category sum: {category_sums_CDU}")
    # Print the category sums
# for category, sum in category_sums.items():
#     print(f"{category}: {sum}")







import matplotlib.pyplot as plt

categories = list(categories_and_questions.keys())

def PlotSpider(User_data,Party_data1,Party_data2,Party_data3):



    num_vars = len(User_data)
    User = list(User_data)
    Party1 = list(Party_data1)
    Party2 = list(Party_data2)
    Party3  = list(Party_data3)

    # Compute angle for each axis
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()

    # Complete the loop
    User += User[:1]
    Party1 += Party1[:1]
    Party2 += Party2[:1]
    Party3 += Party3[:1]
    angles += angles[:1]

    # Plot
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))

    # Fill area
    ax.fill(angles, User, color='grey', alpha=0.25)
    ax.fill(angles, Party1, color='red', alpha=0.25)
    ax.fill(angles, Party2, color='green', alpha=0.25)
    ax.fill(angles, Party3, color='violet', alpha=0.25)
    # Plot line
    ax.plot(angles, User, color='grey', linewidth=2, label='User')
    ax.plot(angles, Party1, color='red', linewidth=2, label='CDU')
    ax.plot(angles, Party2, color='green', linewidth=2, label='Grünen')
    ax.plot(angles, Party3, color='violet', linewidth=2, label='Volt')

    # Aesthetics
    #ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories, fontsize=10)
    # Set the scale
    ax.set_yticks([25, 50, 75, 100])
    ax.set_rlabel_position(45)
    # Add a legend
    ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))

    plt.show()








PlotSpider(category_sums_User,category_sums_CDU,category_sums_Grünen,category_sums_Volt)



