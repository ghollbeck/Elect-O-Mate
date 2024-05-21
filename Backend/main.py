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

from langchain_community.vectorstores import FAISS
from langchain_chroma import Chroma


from langchain_text_splitters import CharacterTextSplitter
from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import LocalFileStore
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langserve import add_routes

from langchain.chains.query_constructor.base import AttributeInfo
from langchain.retrievers.self_query.base import SelfQueryRetriever

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

from typing import List

from dotenv import load_dotenv
import os
import pickle

import requests

from pathlib import Path
BASE = Path(__file__).resolve().parent


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


def load_dotenv_file():
    
    load_dotenv('./.env')
    openai_key = os.getenv("OPENAI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")

load_dotenv_file()


def get_urls(filename: str = "./Sources/URLS/bpb_2_Wahlomat.txt") -> List[str]:
   with open(filename, "r") as f:
       urls = f.readlines()
    #remove the newline character
   urls = [url.strip() for url in urls]
   return urls

# faulty function test before using the one below
def get_urls_from_git(url: str) -> List[str]:
    response = requests.get(url)
    response.raise_for_status() #Notice bad responses
    urls = response.text.splitlines()
    return [url.strip() for url in urls]

def load_web():
    urls = get_urls()
    # urls = get_urls_from_git('https://github.com/ghollbeck/Elect-O-Mate/blob/cfd1bee938d7b0326055f817ced7adf73361c191/Old_Version_Gabor_Not_Used/Sources/URLS/bpb_2_Wahlomat.txt')
    loader = WebBaseLoader(urls)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)
    return texts

def get_url_text() -> List[str]:
    # check if url texts are already in cache
    if (BASE / "cache/url_texts.pkl").exists():
        with (BASE / "cache/url_texts.pkl").open("rb") as f:
            texts = pickle.load(f)
        
    else:
        texts = load_web()
        with (BASE / "cache/url_texts.pkl").open("wb") as f:
            pickle.dump(texts, f)
        
    return texts


def get_pdfs():
    pdfs = []
    for filename in os.listdir("./Sources/PDFs"):
        if filename.endswith(".pdf"):
            pdfs.append(f"./Sources/PDFs/{filename}")
    return pdfs
#
#def get_pdfs_from_git(local_dir: str) -> List[str]:
#    api_url = f"https://api.github.com/repos/ghollbeck/Elect-O-Mate/contents/Old_Version_Gabor_Not_Used/Sources/PDFs?ref=8246ed94cb735d4af12af18d8db326d1c76dda09"
#    response = requests.get(api_url)
#    response.raise_for_status() #Bad responses again
#    contents = response.json()
#    
#    if not os.path.exists(local_dir):
#        os.makedirs(local_dir)
#    
#    pdf_files = []
#    for item in contents:
#        if item['name'].endswith(".pdf"):
#            pdf_url = f"https://raw.githubusercontent.com/ghollbeck/Elect-O-Mate/8246ed94cb735d4af12af18d8db326d1c76dda09/Old_Version_Gabor_Not_Used/Sources/PDFs/{item['name']}"
#            pdf_path = os.path.join(local_dir, item['name'])
#            download_pdf(pdf_url, pdf_path)
#            pdf_files.append(pdf_path)
#            
#    return pdf_files
#
#def download_pdf(url: str, local_path: str):
#    response = requests.get(url)
#    response.raise_for_status() #Baddd responses
#    with open(local_path, 'wb') as f:
#        f.write(response.content)
#         
# def load_git_pdfs(pdf_files: List[str]):
#     doc_file = "./cache/pdf_documents.pkl"
#     text_file = "./cache/pdf_texts.pkl"
#     local_pdf_dir = "./cache/pdfs" 
#     
#     if os.path.exists(doc_file):
#         with open(doc_file, "rb") as f:
#             documents = pickle.load(f)
#     else:
#         pdfs = get_pdfs_from_git(local_pdf_dir)
#         documents = []
#         for file in pdfs:
#             loader = PyPDFLoader(file)
#             documents.append(loader.load())
#         with open(doc_file, "wb") as f:
#             pickle.dump(documents, f)
#     
#     documents = [page for pdf in documents for page in pdf]
# 
#     if os.path.exists(text_file):
#         with open(text_file, "rb") as f:
#             texts = pickle.load(f)
#     else:
#         text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
#         texts = text_splitter.split_documents(documents)
#         with open(text_file, "wb") as f:
#             pickle.dump(texts, f)
#     
#     return texts

def load_pdfs():
    doc_file = BASE / "cache/pdf_documents.pkl"
    text_file = BASE / "cache/pdf_texts.pkl"
    if doc_file.exists():
        with doc_file.open("rb") as f:
            documents = pickle.load(f)
    else:
        pdfs = get_pdfs()
        documents = []
        for file in pdfs:
            loader = PyPDFLoader(file)
            documents.append(loader.load())
        with doc_file.open("wb") as f:
            pickle.dump(documents, f)
    
    # iterate through pages and add metadata
    for document in documents:
        document_file_name = document[0].metadata["source"]
        metadata_file_name = document_file_name.replace(".pdf", ".meta.json")
        with open (metadata_file_name, "r") as f:
            metadata = json.load(f)
        for page in document:
            page.metadata = {**page.metadata, **metadata}
            page.metadata["source"] = page.metadata["url"]

    documents = [page for pdf in documents for page in pdf]

    if text_file.exists():
        with text_file.open("rb") as f:
            texts = pickle.load(f)
    else:
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        texts = text_splitter.split_documents(documents)
        with text_file.open("wb") as f:
            pickle.dump(texts, f)
    return texts


template = """Answer the question based only on the following context including a bullet point list of sources (as urls) in the bottom of the answer:

{context}



Question: {question}
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

# groq = ChatGroq(model_name="llama3-70b-8192")

# ollama = Ollama(model="llama2")
# embeddings_ollama = OllamaEmbeddings()

embedding_cache = LocalFileStore(str((BASE / "cache/embedding_cache").resolve()))

cached_embedder_openai = CacheBackedEmbeddings.from_bytes_store(embeddings_openai, embedding_cache, namespace=embeddings_openai.model)
# cached_embedder_ollama = CacheBackedEmbeddings.from_bytes_store(embeddings_ollama, embedding_cache, namespace=embeddings_ollama.model)


print("getting website content")
url_texts = get_url_text()

print("getting pdf content")
pdf_texts = load_pdfs()


print("building vector db for website content")
# url_db_openai = FAISS.from_documents(url_texts, cached_embedder_openai)
# pdf_db_openai = FAISS.from_documents(pdf_texts, cached_embedder_openai)

url_db_openai = Chroma.from_documents(url_texts, cached_embedder_openai)
pdf_db_openai = Chroma.from_documents(pdf_texts, cached_embedder_openai)

metadata_field_info = [
    AttributeInfo(
        name="party_name",
        description="The abbreviated name of the political party",
        type="string",
    ),
    AttributeInfo(
        name="party_full_name",
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
        name="language",
        description="The language of the source",
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

metadata_retreiver = SelfQueryRetriever.from_llm(
    openai,
    pdf_db_openai,
    metadata_field_info=metadata_field_info,
    document_contents="Political party programmes"
)


retriever_openai = EnsembleRetriever(retrievers=[url_db_openai.as_retriever(), metadata_retreiver], weights=[0.5, 0.5])
# retriever_ollama = EnsembleRetriever(retrievers=[url_db_ollama.as_retriever(), pdf_db_ollama.as_retriever()], weights=[0.5, 0.5])

chain_openai = (
    {"context": retriever_openai , "question": RunnablePassthrough()}
    | prompt  
    | openai
    | StrOutputParser()
)
# chain_ollama = (
#     {"context": retriever_ollama , "question": RunnablePassthrough()}
#     | prompt
#     | model
#     | StrOutputParser()
# )
# chain_groq = (
#     {"context": retriever_ollama, "question": RunnablePassthrough()}
#     | prompt
#     | groq
#     | StrOutputParser()
# )

voice_chain_openai = (
    {"context": retriever_openai , "question": RunnablePassthrough()}
    | voice_prompt
    | openai
    | StrOutputParser()
)

add_routes(
    app,
    chain_openai,
    path="/openai",
)

# add_routes(
#     app,
#     chains=chain_ollama,
#     path="/ollama",
# )

# add_routes(
#     app,
#     chains=chain_groq,
#     path="/groq",
# )


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



if __name__ == "__main__":
    import uvicorn
    print("starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)

# while True:
#     m = input("> ")
#     if m == "exit":
#         break
#     elif not m:
#         continue
#     result = chain.invoke(m)
#     print(result)
#     print("\n\n")
