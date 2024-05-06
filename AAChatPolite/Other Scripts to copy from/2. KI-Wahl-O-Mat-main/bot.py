from langchain.chains import ConversationalRetrievalChain
from langchain_community.llms import OpenAI
import pickle
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
vectorstore = "/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/KI-Wahl-O-Mat-main/vectorstore.pkl"
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
