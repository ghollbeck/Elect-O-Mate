from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings


from langchain.retrievers import EnsembleRetriever
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import Chroma

from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import LocalFileStore

from langserve import add_routes

from langchain.chains.query_constructor.base import AttributeInfo
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain_core.documents import Document


from pydantic import BaseModel

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from typing import List


from Score_Evaluation.calculation import read_json_file, evaluate_answers 
import sources
import prompts

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



def main():

    openai = ChatOpenAI()
    embeddings_openai = OpenAIEmbeddings()


    print("getting website content")
    url_texts_by_country = sources.build_url_datastructure(countries)

    print("getting pdf content")
    pdf_texts_by_country = sources.build_pdf_datastructure(countries)

    # reformat tags to be a string
    for country in countries:
        for document in pdf_texts_by_country[country]:
            document.metadata["tags"] = ",".join(document.metadata["tags"])

    print("building vector db for website content")

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
    embedding_cache = {}
    cached_embedder_openai = {}

    for country in countries:
        
        prompt = ChatPromptTemplate.from_template(prompts.prompts[f"template_{country}"])

        embedding_cache[country] = LocalFileStore(str((BASE / f"cache/embedding_cache/{country}").resolve()))

        cached_embedder_openai[country] = CacheBackedEmbeddings.from_bytes_store(embeddings_openai, embedding_cache[country], namespace=f"{country}_{embeddings_openai.model}")

        
        if not url_texts_by_country[country]:
            url_texts_by_country[country] = [Document("")]

        url_db[country] = Chroma.from_documents(url_texts_by_country[country], cached_embedder_openai[country],collection_name=f"url_{country}")
        
        if not pdf_texts_by_country[country]:
            pdf_texts_by_country[country] = [Document("")]

        pdf_db[country] = Chroma.from_documents(pdf_texts_by_country[country], cached_embedder_openai[country],collection_name=f"pdf_{country}")

        

        self_retrievers[country] = SelfQueryRetriever.from_llm(
            openai,
            pdf_db[country],
            metadata_field_info=pdf_metadata_field_info,
            document_contents="Political party programmes"
        )

        ensemble_retreivers[country] = EnsembleRetriever(retrievers=[url_db[country].as_retriever(), self_retrievers[country]], weights=[0.5, 0.5])

        chains[country] = (
            {"context": self_retrievers[country] , "question": RunnablePassthrough()}
            | prompt  
            | openai
            | StrOutputParser()
        )
        chains[f"{country}_EN"] = (
            {"context": self_retrievers[country] , "question": RunnablePassthrough()}
            | ChatPromptTemplate.from_template(prompts.prompts["template_EN"])
            | openai
            | StrOutputParser()
        )

        add_routes(
            app,
            chains[country],
            path=f"/{country}/{country}"
        )

        add_routes(
            app,
            chains[f"{country}_EN"],
            path=f"/{country}/EN"
        )

    return self_retrievers, ensemble_retreivers, chains, url_db, pdf_db, cached_embedder_openai, embedding_cache

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
    _, _, _, _, _, _, _ = main()
    print("starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
