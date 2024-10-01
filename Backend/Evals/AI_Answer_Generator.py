import json
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.colors as colors
import ollama
import os
import re
import pandas as pd
import time  # Add this import at the top
from dotenv import load_dotenv
import openai
#from IPython.display import display, Markdown
from groq import Groq
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import csv

# Disable parallelism for tokenizers
os.environ["TOKENIZERS_PARALLELISM"] = "false"
# Load environment variables from .env file
load_dotenv(dotenv_path='Backend/Evals/.env')

# Initialize OpenAI and Groq clients with API keys from environment variables
api_key = os.getenv("OPENAI_API_KEY")
openai_client = openai.OpenAI(api_key=api_key)

api_keyGroq = os.getenv("GROQ_API_KEY")
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Model specifications and cutoffs for questions and parties
modelspec = "gpt-4o-mini" # gpt-4, gpt-4o, gpt-4o-mini llama3
cutoff_questions = 0
cutoff_parties = 12

# Function to clean JSON strings by removing invalid control characters
def clean_json_string(json_string):
    json_string = re.sub(r'[\x00-\x1F\x7F]', '', json_string)
    return json_string

# Function to extract and return various specifications from the data file
def SpecsOfData(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        raw_data = file.read()
        cleaned_data = clean_json_string(raw_data)
        data_Party = json.loads(cleaned_data)  # Load the cleaned JSON data
    country = data_Party['country']
    # Measure amount of Parties
    party_names = data_Party['party_names']
    full_party_names = data_Party['party_full_names']
    party_names_length = len(party_names)

    unique_questions = set()
    for answer in data_Party['party_answers']:
        if answer['Party_Name'] == party_names[0]:
            unique_questions.add(answer['Question_Label'])

    # Measure the length or amount of different questions
    unique_questions = list(unique_questions)  # Convert set to list
    if cutoff_questions != 0:
        unique_questions = unique_questions[:cutoff_questions]  # Apply cutoff to questions
    
    if cutoff_parties != 0:
        full_party_names = full_party_names[:cutoff_parties]  # Apply cutoff to full party names

    if cutoff_parties != 0:
        party_names = party_names[:cutoff_parties]  # Apply cutoff to parties

    num_unique_questions = len(unique_questions)
    party_names_length = len(party_names)

    return (
        country, 
        party_names_length, 
        num_unique_questions, 
        data_Party,  
        party_names,
        full_party_names, 
        unique_questions, 
        data_Party['party_answers']
    )

# Function to create messages and behaviors for each question and party
def create_message(filepath):
    country,num_parties,num_questions,data, party_names,Party_Full_Names, questions, data_Country= SpecsOfData(filepath)
    
    messages_list = [["" for _ in range(len(Party_Full_Names))] for _ in range(len(questions))]
    behaviour_list = [["" for _ in range(len(Party_Full_Names))] for _ in range(len(questions))]

    for i in range(num_questions):
        for j in range(num_parties):
            messages_list[i][j] = f"question number _ {i}, question: {questions[i]}"
            behaviour_list[i][j] = (
                f'You are the political party {Party_Full_Names[j]} from {country}. '
                f'You will be asked a question that you have to answer in this JSON format: '
                f'"question" : "<the asked question>", '
                f'"question_number" : "<number of the question>", '
                f'"Full Party Name" : "<Full Party Name>", '
                f'"AI_answer_number" : "<SINGLE DIGIT. -1 means Disagree, 1 means agree, 0 means neutral position>", '
                f'"AI_answer_reason" : "<your reasoning for the number you have given above, 2 sentences max.>", '
                f'"AI_confidence" : "<An integer number between 0 and 100 of the confidence of your answer>"'
            )

    return messages_list,behaviour_list






# Function to ask ChatGPT for an answer to a specific question for a specific party
def AskChatGPT(filepath,i,j, country):
    message2, behaviour2 = create_message(filepath)
    behaviour = f"""\
    You are a helpful assistant about Questions in the politics of {country} and put yourself in the position of a politcal party assigned in the input prompt. Youll be asked a question that you have to asnwer in this format:
    You ANSWER WITH A SINGLE DIGIT. -1 means Disagree, 1 means agree, 0 means neutral position.
    """

    messages=[
        {"role": "system", "content": behaviour2[i][j]},
        {"role": "user", "content": message2[i][j] },
    ]
    temperature = 0
    max_tokens = 200 
    response = openai_client.chat.completions.create(
        model=modelspec, # gpt-4
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
        top_p=1,
        frequency_penalty=1,
        presence_penalty=1
    )

    return response.choices[0].message.content

# Function to ask Ollama for an answer to a specific question for a specific party
def AskOllama(filepath,i,j, country):
    behaviour = f"""\
    You are a helpful assistant about Questions in the politics of {country} and put yourself in the position of a politcal party assigned in the input prompt. Youll be asked a question that you have to asnwer in this format:
    You ANSWER WITH A SINGLE DIGIT. -1 means Disagree, 1 means agree, 0 means neutral position.
    """
     
    messages=[
        {"role": "system", "content": behaviour},
        {"role": "user", "content": create_message(filepath)[i][j]},
    ]

    response = ollama.chat(model='llama3', messages=messages)

    return(response['message']['content'])

# Function to ask Groq for an answer to a specific question for a specific party
def AskGroq(filepath,i,j,  country):
    behaviour = f"""\
    You are a helpful assistant about Questions in the politics of {country} and put yourself in the position of a politcal party assigned in the input prompt. Youll be asked a question that you have to asnwer in this format:
    You ANSWER WITH A SINGLE DIGIT. -1 means Disagree, 1 means agree, 0 means neutral position.
    """
    messages=[
        {"role": "system", "content": behaviour},
        {"role": "user", "content": create_message(filepath)[i][j]},
    ]

    chat_completion = client.chat.completions.create(
    messages=messages,
    model="llama3-8b-8192", #mixtral-8x7b-32768, llama3-8b-8192
    )

    return chat_completion.choices[0].message.content

# Function to execute the calculation and generate the answer matrix using the specified model
def execute_calc(filepath,model):
    country, num_party, num_questions,_,_,_,_,_= SpecsOfData(filepath)  
    GPT_Answer_Matrix = np.zeros((num_questions, num_party))

    k = 0

    start_time = time.time()  # Start the timer

    for i in range(num_questions):  # len(questions)
        for j in range(num_party):  # len(Party_Full_Names)
            if model == "Ollama":
                answer = AskOllama(filepath, i, j,country)
            elif model == "OAI":
                answer = AskChatGPT(filepath, i, j,country)
            elif model == "Groq":
                answer = AskGroq(filepath, i, j,country)
            else:
                print("Model not found")
                break
        
            numbers = re.findall(r'-?\b\d+\b', answer)
            answer = int(numbers[0]) if numbers else None
            if answer not in [-1, 0, 1]:
                answer = 5
            GPT_Answer_Matrix[i][j] = answer
            k += 1
            
            elapsed_time = time.time() - start_time  # Calculate elapsed time
            estimated_total_time = (elapsed_time / k) * (num_questions * num_party)  # Estimate total time
            print(f"Progress {round(k / (num_party * num_questions) * 100, 2)}%, "
                  f"Question number {i + 1}/{num_questions}, Party number: {j + 1}/{num_party}: "
                  f"{GPT_Answer_Matrix[i][j]}, "
                  f"Elapsed time: {elapsed_time:.2f}s, Estimated total time: {estimated_total_time:.2f}s, Estimated remaining time: {estimated_total_time - elapsed_time:.2f}s ")

    # Save GPT_Answer_Matrix as CSV file with a different suffix each time
    csv_file = f"./Backend/Evals/AI_Answers_CSV/AI_Answer_Matrix_{model}{country}_CSV.csv"
    np.savetxt(csv_file, GPT_Answer_Matrix, delimiter=",")

    return GPT_Answer_Matrix




# Function to execute the calculation and generate the answer matrix and JSON using the specified model
def execute_calc2(filepath, model):
    country, num_party, num_questions, _, _, _, _, _ = SpecsOfData(filepath)
    GPT_Answer_Matrix = np.zeros((num_questions, num_party))

    k = 0

    start_time = time.time()  # Start the timer
    answers_list = []  # Initialize an empty list to store answers

    for i in range(num_questions):  # len(questions)
        for j in range(num_party):  # len(Party_Full_Names)
            if model == "Ollama":
                answer = AskOllama(filepath, i, j, country)
            elif model == "OAI":
                answer = AskChatGPT(filepath, i, j, country)
            elif model == "Groq":
                answer = AskGroq(filepath, i, j, country)
            else:
                print("Model not found")
                break

            try:
                answer_json = json.loads(answer)  # Parse the answer as JSON
                if isinstance(answer_json, dict):
                    answer_number = int(answer_json.get("AI_answer_number", "0"))  # Get the value of "AI_answer_number" and convert to int
                else:
                    answer_number = 5  # Default value if parsing fails
            except json.JSONDecodeError:
                answer_number = 5  # Default value if JSON parsing fails

            if answer_number not in [-1, 0, 1]:
                answer_number = 5
            GPT_Answer_Matrix[i][j] = answer_number
            k += 1

            answers_list.append(answer_json)  # Append the parsed JSON to the list

            elapsed_time = time.time() - start_time  # Calculate elapsed time
            estimated_total_time = (elapsed_time / k) * (num_questions * num_party)  # Estimate total time

            print(f"Progress {round(k / (num_party * num_questions) * 100, 2)}%, "
                  f"Question number {i + 1}/{num_questions}, Party number: {j + 1}/{num_party}: "
                  f"\n\n{answer}\n\n"
                  f"Elapsed time: {elapsed_time:.2f}s, Estimated total time: {estimated_total_time:.2f}s, Estimated remaining time: {estimated_total_time - elapsed_time:.2f}s "
                  )

    # Save GPT_Answer_Matrix as CSV file with a different suffix each time
    json_file = f"./Backend/Evals/AI_JSON/AI_Answer_JSON_{model}{country}2.json"
    with open(json_file, 'w', encoding='utf-8') as file:
        json.dump(answers_list, file, ensure_ascii=False, indent=4)  # Write the JSON list to the file
    if answers_list:
        print("answers_list has been saved")

    # Save GPT_Answer_Matrix as CSV file in the CSV folder
    csv_file = f"./Backend/Evals/AI_Answers_CSV/AI_Answer_Matrix_{model}{country}_CSV_based_on_Json-4o-mini.csv"
    np.savetxt(csv_file, GPT_Answer_Matrix, delimiter=",")
    print("GPT_Answer_Matrix has been saved as CSV")

    return answers_list

# Function to calculate the error between party answers and AI answers
def CalcError(filepath_Party,filepath_AI):
    # Load the CSV file into a matrix
    party_answers_matrix = np.loadtxt(filepath_Party, delimiter=',')
    AI_answers_matrix = np.loadtxt(filepath_AI, delimiter=',')

    num_party, num_questions = party_answers_matrix.shape
    print(num_party, num_questions)

    difference_matrix = (-1)*(abs(AI_answers_matrix - party_answers_matrix)-2)

    print(difference_matrix)

    count_2 = np.count_nonzero(difference_matrix == 0)
    count_1 = np.count_nonzero(difference_matrix == 1)
    count_0 = np.count_nonzero(difference_matrix == 2)
    # Count all other numbers excluding 0, 1, and 2 Failrate
    count_other = np.count_nonzero((difference_matrix != 0) & (difference_matrix != 1) & (difference_matrix != 2))

    error_rate_off_by_1 = round(count_1 / (num_party * num_questions) * 100, 2)
    error_rate_off_by_2 = round(count_2 / (num_party * num_questions) * 100, 2)
    total_error_rate = round((count_2 + count_1) / (num_party * num_questions) * 100, 2)
    fail_rate_gpt = round(count_other / (num_party * num_questions) * 100, 2)
    accuracy_rate = round(count_0 / (num_party * num_questions) * 100, 2)

    print(f"Accuracy Rate: {accuracy_rate}%")
    print(f"Errorrate Off by 1: {error_rate_off_by_1}%")
    print(f"Errorrate Off by 2: {error_rate_off_by_2}%")
    print(f"Errorrate TOTAL: {total_error_rate}%")
    print(f"Failrate GPT: {count_other}, In percent: {fail_rate_gpt}%")

    return
