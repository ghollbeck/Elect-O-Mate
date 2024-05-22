import os
from slugify import slugify
import shutil
import json
from datetime import datetime
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter

from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

import argparse

import pickle

def load_dotenv_file():    
    load_dotenv('./.env')

def load_pdf(filename: str):


    document = PyPDFLoader(filename).load()


    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    text = text_splitter.split_documents(document)

    return text


def get_pdf_filenames():
    pdfs = []
    for filename in os.listdir("./"):
        if filename.endswith(".pdf"):
            pdfs.append(f"./{filename}")
    return pdfs

def generate_keywords(text, chunck_keywords=10, n_keywords=20):
    # Split the text into chunks

    
    # Initialize the OpenAI API
    openai_api_key = os.getenv("OPENAI_API_KEY")
    llm = ChatOpenAI(api_key=openai_api_key,model="gpt-4o")
    
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

def initialize_metadata():

    for filename in os.listdir('.'):
        if filename.endswith('.pdf'):
            filename_meta = filename.split('.')[0]
            
            filename_new = slugify(filename_meta)+".pdf"

            shutil.move("./"+filename, "./"+filename_new)

    # get current date in dd.mm.yyyy format
    date = datetime.now().strftime('%d.%m.%Y')

    sample_dict = {
        "party_name": "",
        "party_full_name": "",
        "tags": [],
        "date": date,
        "country": "",
        "language": "",
    }


    for filename in os.listdir('.'):
        if filename.endswith('.pdf'):
            filename = filename.split('.')[0]
            filename_meta = slugify(filename)+".meta.json"

            if not os.path.exists("./"+filename_meta):
                # touch filename.meta.json
                os.system(f'touch {filename_meta}')
                # write sample_dict to filename.meta.json
                with open(filename_meta, 'w') as f:
                    f.write(json.dumps(sample_dict, indent=4))

                    

                
def generate_tags(force_generate_tags=False):

    pdfs = get_pdf_filenames()
    for pdf in pdfs:
        meta_filename = pdf.replace(".pdf", ".meta.json")
        with open(meta_filename, "r") as f:
            metadata = json.load(f)
        if len(metadata["tags"]) > 0 and not force_generate_tags:
            continue
        print(f"Processing {pdf}\n")
        text = load_pdf(pdf)
        keywords = generate_keywords(text)
        metadata["tags"] = [slugify(keyword).replace("-"," ") for keyword in keywords]
        with open(meta_filename, "w") as f:
            f.write(json.dumps(metadata, indent=4))
        

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Generate metadata for PDFs')

    parser.add_argument('--force_generate_tags', dest='force_generate_tags', action='store_true',
                        help='Force the generation of tags')

    args = parser.parse_args()


    load_dotenv_file()
    initialize_metadata()
    generate_tags(args.force_generate_tags)