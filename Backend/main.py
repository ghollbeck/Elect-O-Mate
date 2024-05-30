from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings

# from langchain_community.llms import Ollama
# from langchain_community.embeddings.ollama import OllamaEmbeddings

# from langchain_groq import ChatGroq

from langchain.retrievers import EnsembleRetriever
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.document_loaders import WebBaseLoader

from langchain_community.vectorstores import Chroma

from langchain_text_splitters import CharacterTextSplitter
from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import LocalFileStore
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langserve import add_routes

from langchain.chains.query_constructor.base import AttributeInfo
from langchain.retrievers.self_query.base import SelfQueryRetriever

from pydantic import BaseModel
from Score_Evaluation.calculation import read_json_file, evaluate_answers 

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

from typing import List

from dotenv import load_dotenv
# import os
# import pickle

# import requests

import sources

from pathlib import Path
BASE = Path(__file__).resolve().parent

countries = ["DE", "FR", "IT", "ES", "HU", "PL", "DK"]


app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="A simple api server using Langchain's Runnable interfaces",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict methods if needed
    allow_headers=["*"],  # You can restrict headers if needed
)




template = """You are a helpful assistant for the EU-elections. Never provide an opinion, explain different perspectives instead.
If the QUESTION is not relevant to the EU-elections or politics, do not answer it.

Answer the question based only on the following context. If the context is relevant to the question of the usr, provide a list of sources as source name and url.
ALWAYS ANSWER THE QUESTION IN THE QUESTIONS LANGUAGE.
This is the CONTEXT:

{context}



This is the users QUESTION: {question}
"""

voice_template = """Answer the question based only on the following context. Respond with only one to two sentences.
What you write will be spoken, so write any acronyms with letters separated, for instance, and don't produce bulleted lists.
Do not give sources in the answer, but be prepared to provide them by name if asked.

{context}

Question: {question}
"""

prompt = ChatPromptTemplate.from_template(template)
voice_prompt = ChatPromptTemplate.from_template(voice_template)


openai = ChatOpenAI()
embeddings_openai = OpenAIEmbeddings()


embedding_cache = LocalFileStore(str((BASE / "cache/embedding_cache").resolve()))

cached_embedder_openai = CacheBackedEmbeddings.from_bytes_store(embeddings_openai, embedding_cache, namespace=embeddings_openai.model)


print("getting website content")
url_texts_by_country = sources.build_url_datastructure(countries)

print("getting pdf content")
pdf_texts_by_country = sources.build_pdf_datastructure(countries)


print("building vector db for website content")


def setup_endpoints():

    pdf_metadata_field_info = [
        AttributeInfo(
            name="party_shorthand",
            description="The abbreviated name of the political party",
            type="string",
        ),
        AttributeInfo(
            name="party_name",
            description="The full name of the party",
            type="integer",
        ),
        AttributeInfo(
            name="date",
            description="The date when the source was embedded",
            type="string",
        ),
        AttributeInfo(
            name="country",
            description="The country the source is from can also be EU if it is a EU party",
            type="string",
        ),
        AttributeInfo(
            name="url",
            description="The url of the source",
            type="string",
        ),
            AttributeInfo(
            name="tags",
            description="tags associated with the source",
            type="list",
        ),
    ]


    url_db = {}
    pdf_db = {}
    self_retrievers = {}
    ensemble_retreivers = {}
    chains = {}

    for country in countries:
        url_db[country] = Chroma.from_documents(url_texts_by_country[country], cached_embedder_openai)
        pdf_db[country] = Chroma.from_documents(pdf_texts_by_country[country], cached_embedder_openai)

        self_retrievers[country] = SelfQueryRetriever.from_llm(
            openai,
            pdf_db[country],
            metadata_field_info=pdf_metadata_field_info,
            document_contents="Political party programmes"
        )

        ensemble_retreivers[country] = EnsembleRetriever(retrievers=[url_db[country].as_retriever(), self_retrievers[country]], weights=[0.5, 0.5])



        chains[country] = (
            {"context": ensemble_retreivers[country] , "question": RunnablePassthrough()}
            | prompt  
            | openai
            | StrOutputParser()
        )

        add_routes(
            app,
            chains[country],
            path=f"/{country}",
        )

    return chains, ensemble_retreivers


_,retreivers = setup_endpoints()

voice_chain_openai = (
    {"context": retreivers["DE"] , "question": RunnablePassthrough()}
    | voice_prompt
    | openai
    | StrOutputParser()
)




# for voice, we need a streaming endpoint
import json
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.responses import StreamingResponse
import time
import asyncio

def nonstreaming_response_format(x):
    return  {
        "id": "chatcmpl-abc123",
        "object": "chat.completion",
        "created": 1677858242,
        "model": "gpt-3.5-turbo-0613",
        "usage": {
            "prompt_tokens": 13,
            "completion_tokens": 7,
            "total_tokens": 20
        },
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": x,
                },
                "logprobs": None,
                "finish_reason": "stop",
                "index": 0
            }
        ]
    }

# example dataChunk, from Salil:
"""
{
    id: 'chatcmpl-8c78110d-a5cf-4585-8619-c1f59b714a70',
    object: 'chat.completion.chunk',
    created: 1713300428,
    model: 'gpt-4-1106-preview',
    system_fingerprint: 'fp_5c95a4634e',
    choices: [
    {
        index: 0,
        delta: { content: 'Let me think. ' },
        logprobs: null,
        finish_reason: null,
    },
    ],
},
"""

def streaming_response_format(x): 
    return {
        "id": "chatcmpl-8mcLf78g0quztp4BMtwd3hEj58Uof",
        "object": "chat.completion.chunk",
        "created": int(time.time()),
        "model": "gpt-3.5-turbo-0613",
        "system_fingerprint": None,
        "choices": [
            {
                "index": 0,
                "delta": {"content": x},
                "logprobs": None,

                # do I need to set this?
                "finish_reason": None
            }
        ]
    }

async def stream_openai_events(last_message):
    """
    Function to simulate streaming data.
    """
    
    async for chunk in voice_chain_openai.astream(last_message):#, version="v1"):
        ret = streaming_response_format(chunk)
        ret = dict(ret)
        print(ret)

        # I really don't know what goes here now...
        print(f'data: {chunk}\n\n')
        yield f'data: {json.dumps(ret)}\n\n'

@app.post('/openai/chat/completions')
async def streaming_handler(request: Request):

    """
    # from Sahil (Vapi)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    """

    body = await request.json()  # Directly converting request body to JSON
    messages = body['messages']
    last_message = messages[-1]['content']

    # Assuming 'stream_openai_events' is a function you've defined to handle the streaming
    try:
        return StreamingResponse(
            stream_openai_events(last_message),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache", 
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream",
            },
        )
    except Exception as e:
        print(f"An error occurred: {e}")
        # Handle the exception (e.g., return an error response to the client)
        return JSONResponse({"error": str(e)})

#@app.post('/openai/chat/completions')
async def nonstreaming_handler(request: Request):

    body = await request.json()  # Directly converting request body to JSON
    messages = body['messages']
    last_message = messages[-1]['content']

    result = chain_openai.invoke(last_message)
    print(result)
    return JSONResponse(nonstreaming_response_format(result))

# Evaluate endpoint
class Answer(BaseModel):
    users_answer: int
    Wheights: str
    Skipped: str
class UserAnswers(BaseModel):
    country: str
    data: List[Answer]
class JsonData(BaseModel):
    jsonData: UserAnswers

@app.post("/evaluate")
async def evaluate(user_answers: JsonData):
    country = user_answers.jsonData.country
    data_Party = read_json_file("./Score_Evaluation/Party_Answers_Converted_"+ country +".json")
    
    prepared_data_user = [
        {
            "users_answer": answer.users_answer,
            "Wheights": answer.Wheights,
            "Skipped": answer.Skipped
        }
        for answer in user_answers.jsonData.data
    ]
    
    prepared_data_user = prepared_data_user[2:len(prepared_data_user) -2]
    print(len(prepared_data_user))
    print(prepared_data_user)
    # print(len(prepared_data_user))
    # Call the evaluate_answers function with the prepared data
    result = evaluate_answers(data_Party, prepared_data_user)
    # print(result)
    # print(len(result))
    return {"result": result, "party_answers": data_Party['party_answers']}
    


if __name__ == "__main__":
    import uvicorn
    print("starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
