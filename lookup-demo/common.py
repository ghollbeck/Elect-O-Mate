from pathlib import Path
home_dir = Path(__file__).parent

# grab environment variables from .env
from dotenv import load_dotenv
load_dotenv()

from os import getenv
from datetime import datetime

from pymongo import MongoClient
db = MongoClient().doc_lookup_demo

# -------- OpenAI Helpers --------

from openai import OpenAI
client = OpenAI()

def throw_to_chatgpt(prompt, system=None, model="gpt-3.5-turbo"):
    ms = []
    if system is not None:
        ms += [{"role": "system", "content": system}]

    ms += [{"role": "user", "content": prompt}]

    return client.chat.completions.create(
        model=model,
        messages=ms,
        max_tokens=None,
        temperature=0.9,
        #frequency_penalty=0,
        #presence_penalty=0.6,
        #stop=["\n"]
    ).choices[0].message.content

def get_embedding(text, model="text-embedding-ada-002"):
   #text = text.replace("\n", " ")
   return client.embeddings.create(input = [text], model=model).data[0].embedding
