from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS

from langchain.text_splitter import RecursiveCharacterTextSplitter


from langchain_openai import OpenAIEmbeddings
import os

import pickle



from langchain.chains import ConversationalRetrievalChain
from langchain_community.llms import OpenAI

from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory

from dotenv import load_dotenv, find_dotenv



# csu_loader = PyPDFLoader("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/csu.pdf")
# csu_pages = csu_loader.load()

# freiewaehler_loader = PyPDFLoader("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/freiewähler.pdf")
# freiewaehler_pages = freiewaehler_loader.load()

# grune_loader = PyPDFLoader("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/grüne.pdf")
# gruene_pages = grune_loader.load()

# all_pages = csu_pages + freiewaehler_pages + gruene_pages

# print("Anzahl pages: ", len(all_pages))


# text_splitter = RecursiveCharacterTextSplitter(
#     chunk_size=250,
#     chunk_overlap=20,
# )

# documents = text_splitter.split_documents(all_pages)
# print("Anzahl pages: ", len(documents))

# # Save the documents list to a file
# with open("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/documents.pkl", "wb") as f:
#     pickle.dump(documents, f)



"""""


with open("/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/ChatWahlOMat/documents.pkl", "rb") as f:
    documents = pickle.load(f)


#####

# Set the OpenAI key
os.environ['OPENAI_API_KEY'] = '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'

# Create a FAISS index from the documents
faiss_index = FAISS.from_documents(documents, OpenAIEmbeddings())
print ("faiss_index creted")


with open("vectorstore2.pkl", "wb") as f:
    pickle.dump(faiss_index, f)
    
print ("LAST STEP")



"""""


# Set the OpenAI key
os.environ['OPENAI_API_KEY'] = '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'



#--------ffff------

load_dotenv(find_dotenv())
vectorstore = "/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Other Scripts to copy from/2. KI-Wahl-O-Mat-main/vectorstore.pkl"
with open(vectorstore, "rb") as f:
    vectorstore = pickle.load(f)

memory = ConversationBufferMemory(
    memory_key="chat_history", return_messages=True, output_key="answer"
)

prompt_template = """Du bist ein hilfreicher Assistent, der User bei der Wahlentscheidung zur Bayernwahl hilft.
Erstelle aus der Frage und dem Context eine finale Antwort für den User.

Context: {context}
Frage: {question}
Antwort hier:"""

PROMPT = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
)

qa = ConversationalRetrievalChain.from_llm(
    llm=OpenAI(),
    memory=memory,
    retriever=vectorstore.as_retriever(),
    combine_docs_chain_kwargs={"prompt": PROMPT},
)

while True:
    user_input = input("You: ")

    if user_input.lower() in ["exit", "quit", "bye"]:
        print("Goodbye!")
        break

    response = qa({"question": user_input})

    print("Bot:", response["answer"])

