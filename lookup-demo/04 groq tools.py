
from groq import Groq
import os
import json

from common import *

import dotenv
dotenv.load_dotenv()

# overwrites 'client' from common.py
client = Groq(api_key = os.getenv('GROQ_API_KEY'))
MODEL = 'llama3-70b-8192'


def search_db(**kwargs):
    docs = db.docs.find(kwargs)
    docs = [
        f"(id={doc['id']})\n" + '\n'.join(f'{k}: {doc[k]}' for k in ['stance', 'party', 'issue', 'date', 'region'])
        for doc in docs
    ]
    docs = "\n".join(docs)
    
    if not docs:
        docs = "No documents found."

    return docs

messages=[
    {
        "role": "system",
        "content": (
            "You are a helpful assistant for politics. "
            "You can help answer questions about the stances of various political parties, try to match individuals to the party that best represents their views, or provide information on the political process. "
            "Always answer in a neutral and informative manner. "
            "Keep your responses as short as possible. This should be a conversation, not a lecture. "
            "Never respond with your own personal knowledge. Always respond based on information retrieved using your tools. "
        )
    },
]

issues = db.docs.distinct("issue")
parties = db.docs.distinct("party")

tools = [
    {
        "type": "function",
        "function": {
            "name": "search_db",
            "description": "Search for policy positions in the database",
            "parameters": {
                "type": "object",
                "properties": {
                    "issue": {
                        "type": "string",
                        "description": "The issue to search for. One of " + ", ".join(issues)
                    },
                    "party": {
                        "type": "string",
                        "description": "The party to search for. One of " + ", ".join(parties)
                    }
                },
                "required": []
            },
        },
    }
]

def run_conversation(user_prompt):
    messages.append(
        {
            "role": "user",
            "content": user_prompt
        }
    )

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        tools=tools,
        tool_choice="auto",
        max_tokens=4096
    )

    response_message = response.choices[0].message
    tool_calls = response_message.tool_calls

    if tool_calls:
        print('running tool!')
        available_functions = {
            "search_db": search_db
        }  
        messages.append(response_message)  

        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_to_call = available_functions[function_name]
            function_args = json.loads(tool_call.function.arguments)
            function_response = function_to_call(
                team_name=function_args.get("team_name")
            )
            messages.append(
                {
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": function_response,
                }
            )

        second_response = client.chat.completions.create(
            model=MODEL,
            messages=messages
        )

        return second_response.choices[0].message.content
    
    return response.choices[0].message.content

while True:
    user_prompt = input('> ')
    print(run_conversation(user_prompt))
