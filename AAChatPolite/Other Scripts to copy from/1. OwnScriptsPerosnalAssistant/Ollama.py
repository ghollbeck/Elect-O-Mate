import ollama

import os

from Embedding import vectorsearch
from IPython.display import display, Markdown

import base64


def AskOllama(question):

    results = vectorsearch(question)

    # System Prompt Behaviour
    behaviour = f"""\
    You are a helpful assistant.
    """

    # Question + Context
    question = f"""\
    CONTEXT: {results['documents'][0]}

    QUESTION: {question}
    """

    ### This is the final prompt
    messages=[
        {"role": "system", "content": behaviour},
        {"role": "user", "content": question},
    ]


    response = ollama.chat(model='llama2', messages=messages)
  
    print(response['message']['content'])






question = "what did I speak about luis vuitton?"

AskOllama(question)