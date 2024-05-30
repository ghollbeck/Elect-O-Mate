import os
from slugify import slugify
import tiktoken
from datetime import datetime
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter

from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_community.document_loaders import WebBaseLoader


headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}


def load_pdf(filename: str):

    document = PyPDFLoader(filename, headers=headers).load()

    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    text = text_splitter.split_documents(document)

    return text

def load_web(url:str):
    loader = WebBaseLoader(url)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)
    return texts

def generate_party_name(text):
    # Initialize the OpenAI API
    openai_api_key = os.getenv("OPENAI_API_KEY")
    llm = ChatOpenAI(api_key=openai_api_key,model="gpt-3.5-turbo")
    
    # Define the prompt template for generating keywords
    prompt_template = PromptTemplate(
        input_variables=["text"],
        template="Get the political party name from the following text: \n\n{text}"
    )
    
    # Create the LLMChain
    chain = prompt_template | llm
    
    names = []

    for chunk in text:
        response = chain.invoke({"text": chunk.page_content})
        names.append(response.content)

    # Define the prompt template for generating keywords
    prompt_template = PromptTemplate(
        input_variables=["text"],
        template="From the following list of political party names return the most frequent one. Provide the Shorthand name and the full name in the format shorthand,full name. Do not include any other information in your response \n\n{text}"
    )
    
    # Create the LLMChain
    chain = prompt_template | llm

    response = chain.invoke({"text": "\n".join(names)}).content

    if "," in response:
        shorthand = response.split(",")[0]
        full_name = response.split(",")[1]
    else:
        shorthand = response
        full_name = response

    return shorthand, full_name

def count_tokens(text: str) -> int:
    tokenizer = tiktoken.get_encoding("cl100k_base")
    
    # Tokenize the input text
    tokens = tokenizer.encode(text)
    
    # Return the number of tokens
    return len(tokens)


def generate_keywords(text, chunck_keywords=10, n_keywords=20):

    # Initialize the OpenAI API
    openai_api_key = os.getenv("OPENAI_API_KEY")
    llm = ChatOpenAI(api_key=openai_api_key,model="gpt-3.5-turbo")
    
    # Define the prompt template for generating keywords
    prompt_template = PromptTemplate(
        input_variables=["text", "n_keywords"],
        template="Extract the top {n_keywords} keywords from the following text. Respond as a list separated by linebreaks and do not include numbering in your response: \n\n{text}"
    )
    
    # Create the LLMChain
    chain = prompt_template | llm
    
    # Generate keywords for each chunk and collect them
    keywords = []
    for chunk in text:
        if count_tokens(chunk.page_content) > 15000:
            length = len(chunk.page_content)
            chunk1 = chunk.page_content[0:length-500] 
            chunk2 = chunk.page_content[length-500:]
            response1 = chain.invoke({"text": chunk1, "n_keywords": chunck_keywords})
            response2 = chain.invoke({"text": chunk2, "n_keywords": chunck_keywords})
            keywords.extend(response1.content.split("\n"))
            keywords.extend(response2.content.split("\n"))
        else:
            response = chain.invoke({"text": chunk.page_content, "n_keywords": chunck_keywords})
            keywords.extend(response.content.split("\n"))


    final_keywords_template = PromptTemplate(
        input_variables=["text", "n_keywords"],
        template="extract the top {n_keywords} keywords from this list of keywords. Respond as a list separated by linebreaks and do not include numbering in your response: \n\n{text}"
    )

    final_keywords_chain = final_keywords_template | llm

    keywords_text = "\n".join(keywords)

    final_keywords = final_keywords_chain.invoke({"text": keywords_text, "n_keywords": n_keywords})


    # Deduplicate and return the keywords
    return list(set(final_keywords.content.split("\n")))

def get_metadata(url: str, country: str, pdf:   bool=True):
    # get current date in dd.mm.yyyy format
    date = datetime.now().strftime('%d.%m.%Y')

    metadata = {
        "url": url,
        "party_name": "",
        "party_shorthand": "",
        "tags": [],
        "date": date,
        "country": country
    }

    if pdf:
        text = load_pdf(url)
    else:
        text = load_web(url)

    keywords = generate_keywords(text)
    metadata["tags"] = [slugify(keyword).replace("-"," ") for keyword in keywords]

    shorthand, full_name = generate_party_name(text)
    metadata["party_name"] = full_name
    metadata["party_shorthand"] = shorthand


    return metadata

