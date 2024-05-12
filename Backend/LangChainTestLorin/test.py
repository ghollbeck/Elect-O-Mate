from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter


from dotenv import load_dotenv
import os


def load_dotenv_file():
    
    load_dotenv('../../.env')
    openai_key = os.getenv("OPENAI_API_KEY")

load_dotenv_file()


template = """Answer the question based only on the following context and give the source you used as a bullet point list in the bottom:

{context}

Question: {question}
"""

prompt = ChatPromptTemplate.from_template(template)
model = ChatOpenAI()

loader = WebBaseLoader("https://www.bpb.de/themen/parteien/wer-steht-zur-wahl/europawahl-2024/548019/aktion-partei-fuer-tierschutz/")

documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
texts = text_splitter.split_documents(documents)
embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(texts, embeddings)


retriever = db.as_retriever()

chain = (
    {"context": retriever , "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

while True:
    m = input("> ")
    result = chain.invoke(m)
    print(result)


