from Embedding import access_collection
import os
#from openai import OpenAI
from openai import OpenAI
import ollama


#from IPython.display import display, Markdown
os.environ['GROQ_API_KEY'] = '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'
from groq import Groq
client = Groq(
    api_key=os.environ.get("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"),)
os.environ['GROQ_API_KEY'] = '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'


# Disable parallelism for tokenizers
os.environ["TOKENIZERS_PARALLELISM"] = "false"
# Now you can import the tokenizers library
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


os.environ['OPENAI_API_KEY'] = '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'
api_key ='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'
openai_client = OpenAI(api_key=api_key)




def AskChatGPT(prompt:str):

    collection = access_collection()
    nr_of_results = 6
    results = collection.query(query_texts=[prompt], n_results=nr_of_results)   #Search Vector Database

    # System Prompt Behaviour
    behaviour = f"""\
    Du bist ein hilfreicher Assistent, der User bei der Wahlentscheidung zur Europawahl hilft.
    Erstelle aus der Frage und dem Context eine finale Antwort für den User. Gebe nur die Informationen die Text stehen, nutze kein wissen aus deinem sonstigen Training. Falls die Information nicht explizit erwähnt wird, erkläre die Textstelle in der es um da thema geht.
    
    """

#Kohleausstieg CUD wann
    # Question + Context
    prompt = f"""\
    CONTEXT: {results['documents']}

    QUESTION: {prompt}
    """
    #print(prompt)
    ### This is the final prompt
    messages=[
        {"role": "system", "content": behaviour},
        {"role": "user", "content": prompt},
    ]

    #print(messages)


    ### Call to OPEN AI
    temperature = 0    # randomness seed (0 no randomness, 1 max randomness)

    max_tokens = 4000     # tokens to expect as response

    response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo", # gpt-4
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
        top_p=1,
        frequency_penalty=1,
        presence_penalty=1
    )

    #display(Markdown(response.choices[0].message.content))
    #print(response.choices[0].message.content)
        
    

    return response.choices[0].message.content



def AskOllama(prompt:str):

    collection = access_collection()
    nr_of_results = 10
    results = collection.query(query_texts=[prompt], n_results=nr_of_results)   #Search Vector Database

    # System Prompt Behaviour
    behaviour = f"""\
    Du bist ein hilfreicher Assistent, der User bei der Wahlentscheidung zur Europawahl hilft.
    Erstelle aus der Frage und dem Context eine finale Antwort für den User. Falls zur Frage keine Informationen im Kontext gibt, antworten Sie mit "Tut mir leid, die Antwort steht nicht im Kontext".
    Antworte auf Deutsch und halte deine Antwort kurz und prägnant.
    """


    # Question + Context
    prompt = f"""\
    CONTEXT: {results['documents']}

    QUESTION: {prompt}
    """
    # print(prompt)
    ### This is the final prompt
    messages=[
        {"role": "system", "content": behaviour},
        {"role": "user", "content": prompt},
    ]

    response = ollama.chat(model='llama3', messages=messages)

    return(response['message']['content'],results['documents'])





def AskGroq(prompt:str):
    
    collection = access_collection()
    nr_of_results = 5
    results = collection.query(query_texts=[prompt], n_results=nr_of_results)   #Search Vector Database

    # System Prompt Behaviour
    behaviour = f"""\
        create/extract the most important keywords out of the prompt. focus on topics
    """

#    Du bist ein hilfreicher Assistent, der User bei der Wahlentscheidung zur Europawahl hilft.
#     Erstelle aus der Frage und dem Context eine finale Antwort für den User. Falls zur Frage keine Informationen im Kontext gibt, antworten Sie mit "Tut mir leid, die Antwort steht nicht im Kontext".
#     Antworte auf Deutsch und halte deine Antwort kurz und prägnant.


    # Question + Context
    #prompt = f"""\
    #CONTEXT: {results['documents']}

    #QUESTION: {prompt}
    #"""

    messages=[
        {"role": "system", "content": behaviour},
        {"role": "user", "content": prompt},
    ]

    chat_completion = client.chat.completions.create(
    messages=messages,
    model="mixtral-8x7b-32768", #mixtral-8x7b-32768, llama3-8b-8192
    )

    return chat_completion.choices[0].message.content , results['documents']




# bis wann will die CDU Klimaneutralität erreichen

# bis wann will die AFD Klimaneutralität erreichen, steht da was im parteiprogram zu?


while True:
    prompt = input("You: ")
    if prompt.lower() in ["exit", "quit", "bye","."]:
        os.system('clear')
        print("Goodbye!")
        break
    response,results = AskOllama(prompt)
    print(f"Kontext: {results}")
    print(f"Bot: {response}")


