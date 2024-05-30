
import os
from pathlib import Path
from typing import List, Dict

import json
import requests
import pickle

from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain.chains.query_constructor.base import AttributeInfo
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.retrievers import EnsembleRetriever
from langchain.embeddings import CacheBackedEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.storage import LocalFileStore

from langchain_community.vectorstores import Chroma

import metadata

#TODO: save CHROMA DB
#TODO: load new sources

countries = ["DE", "FR", "IT", "ES", "HU", "PL", "DK"]

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}


BASE = Path(__file__).resolve().parent


def get_urls_from_file(filename: str) -> List[str]:
   with open(filename, "r") as f:
       urls = f.readlines()
    #remove the newline character
   urls = [url.strip() for url in urls]
   return urls

def load_web(country: str):
    folder = BASE / f"Sources/ActiveSources/{country}"
    filename = folder / f"Wahlprogramme{country}URLs.txt"
    urls = get_urls_from_file(filename)
    loader = WebBaseLoader(urls)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)
    return texts

def get_url_text(country: str) -> List[str]:
    # check if url texts are already in cache
    if (BASE / f"cache/url_{country}.pkl").exists():
        with (BASE / f"cache/url_{country}.pkl").open("rb") as f:
            texts = pickle.load(f)
        
    else:
        texts = load_web(country)
        with (BASE / "cache/url_{country}.pkl").open("wb") as f:
            pickle.dump(texts, f)
        
    return texts


def build_text_datastructure() -> Dict:
    url_texts = {}

    # load all country URLs

    if (BASE / "cache/url_texts_all_countries.pkl").exists():
        with (BASE / "cache/url_texts_all_countries.pkl").open("rb") as f:
            url_texts = pickle.load(f)
    else:
        for country in countries:
            texts = get_url_text(country)
            url_texts[country] = texts
        
        with (BASE / "cache/url_texts_all_countries.pkl").open("wb") as f:
            pickle.dump(url_texts, f)
    
    return url_texts


def check_url(url):
    
    try:
        response = requests.get(url, headers=headers)
        return response.status_code

    except requests.exceptions.RequestException as e:
        return f"An error occurred: {e}"

def get_pdfs_links_by_country(country: str):
    pdfs = []
    filename = BASE / f"Sources/ActiveSources/{country}/Wahlprogramme{country}URLPDF.txt"
    with open(filename, "r") as f:
        pdfs = f.readlines()
    pdfs = [pdf.strip() for pdf in pdfs]
    return pdfs

def load_pdfs(country: str):
    doc_file = BASE / f"cache/pdf_documents_{country}.pkl"
    text_file = BASE / f"cache/pdf_texts_{country}.pkl"
    if doc_file.exists():
        with doc_file.open("rb") as f:
            documents = pickle.load(f)
    else:
        pdfs = get_pdfs_links_by_country(country)
        documents = []
        for file in pdfs:
            code  = check_url(file)
            if code != 200:
                print(f"URL {file} is not valid")
                continue
            loader = PyPDFLoader(file, headers = headers)
            documents.append(loader.load())
        with doc_file.open("wb") as f:
            pickle.dump(documents, f)
    
    metadata_file = BASE / f"cache/pdf_metadata_{country}.pkl"

    if metadata_file.exists():
        with metadata_file.open("rb") as f:
            metadata_dict = pickle.load(f)
    else:
        metadata_dict = {}
        with metadata_file.open("wb") as f:
            pickle.dump(metadata_dict, f)

    for document in documents:
        document_file_name = document[0].metadata["source"]
        if document_file_name not in metadata_dict:
            metadata_dict[document_file_name] = metadata.get_metadata(document_file_name, country=country)
        with metadata_file.open("wb") as f:
            pickle.dump(metadata_dict, f)


    # iterate through pages and add metadata
    for document in documents:
        document_file_name = document[0].metadata["source"]

        doc_metadata = metadata_dict[document_file_name]

        for page in document:
            page.metadata = {**page.metadata, **doc_metadata}
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

def build_pdf_datastructure() -> Dict:
    pdf_texts = {}
    if (BASE / "cache/pdf_texts_all_countries.pkl").exists():
        with (BASE / "cache/pdf_texts_all_countries.pkl").open("rb") as f:
            pdf_texts = pickle.load(f)
    else:
        for country in countries:
            texts = load_pdfs(country)
            pdf_texts[country] = texts
        with (BASE / "cache/pdf_texts_all_countries.pkl").open("wb") as f:
            pickle.dump(pdf_texts, f)
    return pdf_texts

# openai = ChatOpenAI()
# embeddings_openai = OpenAIEmbeddings()


# embedding_cache = LocalFileStore(str((BASE / "cache/embedding_cache").resolve()))

# cached_embedder_openai = CacheBackedEmbeddings.from_bytes_store(embeddings_openai, embedding_cache, namespace=embeddings_openai.model)


# print("getting website content")
# url_texts = get_url_text()

print("getting pdf content")
pdf_texts = build_pdf_datastructure()


# print("building vector db for website content")

# url_db_openai = Chroma.from_documents(url_texts, cached_embedder_openai)
# pdf_db_openai = Chroma.from_documents(pdf_texts, cached_embedder_openai)

# metadata_field_info = [
#     AttributeInfo(
#         name="party_name",
#         description="The abbreviated name of the political party",
#         type="string",
#     ),
#     AttributeInfo(
#         name="party_full_name",
#         description="The full name of the party",
#         type="integer",
#     ),
#     AttributeInfo(
#         name="date",
#         description="The date when the source was embedded",
#         type="string",
#     ),
#     AttributeInfo(
#         name="country",
#         description="The country the source is from can also be EU if it is a EU party",
#         type="string",
#     ),
#     AttributeInfo(
#         name="language",
#         description="The language of the source",
#         type="string",
#     ),
#     AttributeInfo(
#         name="url",
#         description="The url of the source",
#         type="string",
#     ),
#         AttributeInfo(
#         name="tags",
#         description="tags associated with the source",
#         type="list",
#     ),
# ]

# metadata_retreiver = SelfQueryRetriever.from_llm(
#     openai,
#     pdf_db_openai,
#     metadata_field_info=metadata_field_info,
#     document_contents="Political party programmes"
# )


# retriever_openai = EnsembleRetriever(retrievers=[url_db_openai.as_retriever(), metadata_retreiver], weights=[0.5, 0.5])
