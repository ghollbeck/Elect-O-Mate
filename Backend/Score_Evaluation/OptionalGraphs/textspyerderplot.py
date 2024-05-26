# import numpy as np
# import matplotlib.pyplot as plt

# # Example data
# labels = ['Restriktive Finanzpolitik', 'Liberale Wirtschaftspolitik', 'Offene Aussenpolitik', 
#           'Liberale Gesellschaft', 'Ausgebauter Umweltschutz', 'Restriktive Migrationspolitik', 
#           'Law & Order']
# num_vars = len(labels)

# # Sample data
# values_1 = [70, 85, 90, 55, 65, 75, 95]
# values_2 = [60, 75, 80, 50, 60, 65, 85]
# values_3 = [50, 65, 70, 45, 55, 55, 100]

# # Combine the data into one array
# values = [values_1, values_2, values_3]

# # Create the radar chart
# angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
# values = [v + [v[0]] for v in values]  # Repeat the first value to close the circular graph
# angles += angles[:1]

# fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))

# for value, color, alpha in zip(values, ['r', 'g', 'b'], [0.3, 0.3, 0.3]):
#     ax.fill(angles, value, color=color, alpha=alpha)
#     ax.plot(angles, value, color=color, linewidth=2)

# ax.set_yticklabels([])
# ax.set_xticks(angles[:-1])
# ax.set_xticklabels(labels)

# plt.show()



import numpy as np
import matplotlib.pyplot as plt
import json
import pprint

# Pretty printer
pp = pprint.PrettyPrinter(indent=4)

# File paths
file_path_Party_Answers = "./Party_Answers_Converted.json"
file_path_My_Answers = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Score_Evaluation/-1_0_1_User_Answers.json'
party_names = ["CDU / CSU", "GRÜNE", "SPD", "AfD", "DIE LINKE", "FDP", "Die PARTEI", "FREIE WÄHLER", "Tierschutzpartei", "ÖDP", "FAMILIE", "Volt", "PIRATEN", "MERA25", "HEIMAT", "TIERSCHUTZ hier!", "Partei für schulmedizinische Verjüngungsforschung", "BIG", "Bündnis C", "PdH", "MENSCHLICHE WELT", "DKP", "MLPD", "SGP", "ABG", "dieBasis", "BÜNDNIS DEUTSCHLAND", "BSW", "DAVA", "KLIMALISTE", "LETZTE GENERATION", "PDV", "PdF", "V-Partei³"]

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

# Read JSON files
data_Party = read_json_file(file_path_Party_Answers)
data_User = read_json_file(file_path_My_Answers)

# Create an array with the User answers in -1, 0, 1
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
    "Offene Aussenpolitik": [4, -6, 10, 12, 15, 20, -22, -24, -25, -29, -33, 37, 38],
    "Liberale Wirtschaftspolitik": [-1, 2, 11, -21, 22, 26, -33, -35], 
    "Restriktive Finanzpolitik": [-1, -5, -11, 19, 31, 33, -37],
    "Law & Order": [7, 12, -17, 19, -23],
    "Restriktive Migrationspolitik": [-3, -27, -32, 36], 
    "Ausgebauter Umweltschutz": [-2, 5, -8, 9, -11, -14, 18, 21, -22, -26, -31, 35],
    "Ausgebauter Sozialstaat": [5, 30, 12, -15, 16, 27],
    "Liberale Gesellschaft": [7, 16, 23, 28, 34]
}

def calculate_category_sums(user_answers, categories_and_questions):
    category_sums = np.zeros((8, 1))
    for i, (category, question_numbers) in enumerate(categories_and_questions.items()):
        category_sum = 0
        for question_number in question_numbers:
            index = abs(question_number) - 1
            score = user_answers[index] * question_number / abs(question_number)
            if score > 0:
                category_sum += score
            elif score == 0:
                category_sum += 0.5
        category_sums[i] = 100 * category_sum / len(question_numbers)
    return category_sums

category_sums_User = calculate_category_sums(user_answers_matrix, categories_and_questions)
category_sums_CDU = calculate_category_sums(party_answers_array[:, 0], categories_and_questions)
category_sums_Grünen = calculate_category_sums(party_answers_array[:, 1], categories_and_questions)
category_sums_Volt = calculate_category_sums(party_answers_array[:, 11], categories_and_questions)

categories = list(categories_and_questions.keys())

def PlotSpider(User_data, Party_data1, Party_data2, Party_data3):
    num_vars = len(User_data)
    User = list(User_data.flatten())
    Party1 = list(Party_data1.flatten())
    Party2 = list(Party_data2.flatten())
    Party3 = list(Party_data3.flatten())

    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()

    User += User[:1]
    Party1 += Party1[:1]
    Party2 += Party2[:1]
    Party3 += Party3[:1]
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))

    for value, color, alpha in zip([User, Party1, Party2, Party3], ['blue', 'red', 'green', 'violet'], [0.25, 0.25, 0.25, 0.25]):
        ax.fill(angles, value, color=color, alpha=alpha)
        ax.plot(angles, value, color=color, linewidth=2)

    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories, fontsize=10)
    ax.set_yticks([25, 50, 75, 100])
    ax.set_rlabel_position(45)
    ax.legend(['User', 'CDU', 'Grünen', 'Volt'], loc='upper right', bbox_to_anchor=(1.3, 1.1))

    plt.show()

PlotSpider(category_sums_User, category_sums_CDU, category_sums_Grünen, category_sums_Volt)
