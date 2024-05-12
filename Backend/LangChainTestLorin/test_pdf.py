from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
import os
import pickle


def get_pdfs():
    pdfs = []
    for filename in os.listdir("/Users/lorinurbantat/Documents/GPT-4-Elections/AAChatPolite/Sources/PDFs"):
        if filename.endswith(".pdf"):
            pdfs.append(f"/Users/lorinurbantat/Documents/GPT-4-Elections/AAChatPolite/Sources/PDFs/{filename}")
    return pdfs

def load_pdfs():
    if os.path.exists("pdf_documents.pkl"):
        with open("pdf_documents.pkl", "rb") as f:
            documents = pickle.load(f)
    else:
        pdfs = get_pdfs()
        documents = []
        for file in pdfs:
            loader = PyPDFLoader(file)
            documents.append(loader.load())
        with open("pdf_documents.pkl", "wb") as f:
            pickle.dump(documents, f)
    
    documents = [page for pdf in documents for page in pdf]

    if os.path.exists("pdf_texts.pkl"):
        with open("pdf_texts.pkl", "rb") as f:
            texts = pickle.load(f)
    else:
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        texts = text_splitter.split_documents(documents)
        with open("pdf_texts.pkl", "wb") as f:
            pickle.dump(texts, f)
    return texts


print(load_pdfs())

