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
from langchain_text_splitters import CharacterTextSplitter
from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import LocalFileStore
from langchain_community.document_loaders import PyPDFLoader
from langserve import add_routes
from langchain.text_splitter import CharacterTextSplitter

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from typing import List

from dotenv import load_dotenv
import os
import pickle

import requests


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


#def get_urls(filename: str = "/Users/lorinurbantat/Documents/GPT-4-Elections/AAChatPolite/Sources/URLS/bpb_2_Wahlomat.txt") -> List[str]:
#    with open(filename, "r") as f:
#        urls = f.readlines()
    # remove the newline character
#    urls = [url.strip() for url in urls]
#    return urls

def get_urls_from_git(url: str) -> List[str]:
    response = requests.get(url)
    response.raise_for_status(url) #Notice bad responses
    urls = response.text.splitlines()
    return [url.strip() for url in urls]

def load_web():
    #urls = get_urls()
    urls = get_urls_from_git('https://github.com/ghollbeck/Elect-O-Mate/blob/cfd1bee938d7b0326055f817ced7adf73361c191/Old_Version_Gabor_Not_Used/Sources/URLS/bpb_2_Wahlomat.txt')
    loader = WebBaseLoader(urls)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)
    return texts

def get_url_text() -> List[str]:
    # check if url texts are already in cache
    if os.path.isfile("./cache/url_texts.pkl"):
        with open("./cache/url_texts.pkl", "rb") as f:
            texts = pickle.load(f)
        
    else:
        texts = load_web()
        with open("./cache/url_texts.pkl", "wb") as f:
            pickle.dump(texts, f)
        
    return texts


def get_pdfs():
    pdfs = []
    for filename in os.listdir("/Users/lorinurbantat/Documents/GPT-4-Elections/AAChatPolite/Sources/PDFs"):
        if filename.endswith(".pdf"):
            pdfs.append(f"/Users/lorinurbantat/Documents/GPT-4-Elections/AAChatPolite/Sources/PDFs/{filename}")
    return pdfs

def load_pdfs():
    doc_file = "./cache/pdf_documents.pkl"
    text_file = "./cache/pdf_texts.pkl"
    if os.path.exists(doc_file):
        with open(doc_file, "rb") as f:
            documents = pickle.load(f)
    else:
        pdfs = get_pdfs()
        documents = []
        for file in pdfs:
            loader = PyPDFLoader(file)
            documents.append(loader.load())
        with open(doc_file, "wb") as f:
            pickle.dump(documents, f)
    
    documents = [page for pdf in documents for page in pdf]

    if os.path.exists(text_file):
        with open(text_file, "rb") as f:
            texts = pickle.load(f)
    else:
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        texts = text_splitter.split_documents(documents)
        with open(text_file, "wb") as f:
            pickle.dump(texts, f)
    return texts


template = """Answer the question based only on the following context including a bullet point list of sources (filename or url) in the bottom of the answer:

{context}



Question: {question}
"""

prompt = ChatPromptTemplate.from_template(template)



openai = ChatOpenAI()
embeddings_openai = OpenAIEmbeddings()

# groq = ChatGroq(model_name="llama3-70b-8192")

# ollama = Ollama(model="llama2")
# embeddings_ollama = OllamaEmbeddings()

embedding_cache = LocalFileStore("./cache/embedding_cache")

cached_embedder_openai = CacheBackedEmbeddings.from_bytes_store(embeddings_openai, embedding_cache, namespace=embeddings_openai.model)
# cached_embedder_ollama = CacheBackedEmbeddings.from_bytes_store(embeddings_ollama, embedding_cache, namespace=embeddings_ollama.model)


print("getting website content")
url_texts = get_url_text()

print("getting pdf content")
pdf_texts = load_pdfs()


print("building vector db for website content")
url_db_openai = FAISS.from_documents(url_texts, cached_embedder_openai)
pdf_db_openai = FAISS.from_documents(pdf_texts, cached_embedder_openai)

# url_db_ollama = FAISS.from_documents(url_texts, cached_embedder_ollama)
# pdf_db_ollama = FAISS.from_documents(pdf_texts, cached_embedder_ollama)

retriever_openai = EnsembleRetriever(retrievers=[url_db_openai.as_retriever(), pdf_db_openai.as_retriever()], weights=[0.5, 0.5])
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
