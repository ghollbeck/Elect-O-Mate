from groq.cloud.core import  Completion


import subprocess

subprocess.run(["export", "GROQ_SECRET_ACCESS_KEY=<secret key>"], shell=True)

import os

from Embedding import vectorsearch
from IPython.display import display, Markdown

import base64


def AskGroq(question):

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


    with Completion() as completion:
        response, id, stats = completion.send_prompt("llama2-70b-4096", user_prompt=question)
        if response != "":
            print(f"\nPrompt: {question}\n")
            print(f"Request ID: {id}")
            print(f"Output:\n {response}\n")
            print(f"Stats:\n {stats}\n")

    print(response['message']['content'])






question = "what did I speak about luis vuitton?"

AskGroq(question)