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


os.environ["TOKENIZERS_PARALLELISM"] = "false"
load_dotenv(dotenv_path='Backend/Evals/.env')

api_key = os.getenv("OPENAI_API_KEY")
openai_client = openai.OpenAI(api_key=api_key)

api_keyGroq = os.getenv("GROQ_API_KEY")
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))




model = "Ollama" # "Ollama", "OAI", "Groq":
modelspec = "gpt-4o-mini" # gpt-4, gpt-4o, gpt-4o-mini llama3


cutoff_questions = 5
cutoff_parties = 5 



def clean_json_string(json_string):
    # Remove invalid control characters
    json_string = re.sub(r'[\x00-\x1F\x7F]', '', json_string)
    return json_string

def SpecsOfData(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        raw_data = file.read()
        cleaned_data = clean_json_string(raw_data)
        data_Party = json.loads(cleaned_data)  # Load the cleaned JSON data
    country = data_Party['country']
    # Measure amount of Parties
    party_names = data_Party['party_names']
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
        party_names = party_names[:cutoff_parties]  # Apply cutoff to parties

    num_unique_questions = len(unique_questions)
    party_names_length = len(party_names)

    return country, party_names_length, num_unique_questions, data_Party

def create_message(filepath):
    _,_,_,data = SpecsOfData(filepath)
    data_Country = data['party_answers']
    Party_Full_Names = data['party_names']
    
    first_party_name = Party_Full_Names[0]
    country = data['country']

    questions =   [item['Question_Label'] for item in data_Country if item['Party_Name'] == first_party_name]
    num_questions = len(questions)

    messages_list = [["" for _ in range(len(Party_Full_Names))] for _ in range(len(questions))]
    for i in range(len(questions)):
        for j in range(len(Party_Full_Names)):
            messages_list[i][j] = f"How would the Party {Party_Full_Names[j]} from {country} answer the following question: ´{questions[i]}' ANSWER WITH A SINGLE DIGIT. -1 means Disagree, 1 means agree, 0 means neutral position."

    return messages_list






def AskChatGPT(filepath,i,j, country):
    

    behaviour = f"""\
    You are a helpful assistant about Questions in the politics of {country} and put yourself in the position of a politcal party assigned in the input prompt. Youll be asked a question that you have to asnwer in this format:
    You ANSWER WITH A SINGLE DIGIT. -1 means Disagree, 1 means agree, 0 means neutral position.
    """

    messages=[
        {"role": "system", "content": behaviour},
        {"role": "user", "content": create_message(filepath)[i][j]},
    ]
    temperature = 0
    max_tokens = 3 

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






def execute_calc(filepath,model):
    country, num_party, num_questions,_ = SpecsOfData(filepath)  
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



