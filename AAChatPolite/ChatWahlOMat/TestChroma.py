import os
from langchain_community.document_loaders import PyPDFLoader

from langchain.text_splitter import RecursiveCharacterTextSplitter


from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI

ChromaDB_Directory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources/Chroma2'
SourceDirectory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources'




csu_loader = PyPDFLoader("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/csu.pdf")
csu_pages = csu_loader.load()

freiewaehler_loader = PyPDFLoader("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/freiewähler.pdf")
freiewaehler_pages = freiewaehler_loader.load()

grune_loader = PyPDFLoader("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/grüne.pdf")
gruene_pages = grune_loader.load()

all_pages = csu_pages + freiewaehler_pages + gruene_pages




csu_loader = PyPDFLoader("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/csu.pdf")
csu_pages = csu_loader.load()

freiewaehler_loader = PyPDFLoader("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/freiewähler.pdf")
freiewaehler_pages = freiewaehler_loader.load()

grune_loader = PyPDFLoader("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/grüne.pdf")
gruene_pages = grune_loader.load()

all_pages = csu_pages + freiewaehler_pages + gruene_pages

print("Anzahl pages: ", len(all_pages))





# split the doc into smaller chunks i.e. chunk_size=500
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(all_pages)



# get OpenAI Embedding model
embeddings = OpenAIEmbeddings(openai_api_key='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')

# embed the chunks as vectors and load them into the database
db_chroma = Chroma.from_documents(chunks, embeddings, persist_directory=ChromaDB_Directory)


# this is an example of a user question (query)
query = 'bis wann will die AFD Klimaneutralität erreichen'

# retrieve context - top 5 most relevant (closests) chunks to the query vector 
# (by default Langchain is using cosine distance metric)
docs_chroma = db_chroma.similarity_search_with_score(query, k=5)

# generate an answer based on given user query and retrieved context information
context_text = "\n\n".join([doc.page_content for doc, _score in docs_chroma])

print(context_text)
