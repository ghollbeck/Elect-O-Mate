import chromadb
import os
from chromadb.config import Settings
from chromadb.utils  import embedding_functions
from IPython.display import display, Markdown

import fitz
from langchain_community.document_loaders import PyMuPDFLoader

import requests
import base64
from openai import OpenAI

from pathlib import Path
import openai


api_key ="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"
openai_client = OpenAI(api_key=api_key)

# import camelot

#from google.colab import drive
#drive.mount('/content/drive')

SourceDirectory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources'


def pdf_to_md(pdf_file_path: str):
    """
    Convert a PDF file to a markdown file
    :param pdf_file_path: path to the PDF file
    """
    SourceDirectory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources'

    ## Extract the text and save it in .md files
    for dirName, subdirList, fileList in os.walk(SourceDirectory):
        # Filter the list to include only PDF files
        pdf_files = [file for file in fileList if file.endswith('.pdf')]

        # Now you can load each PDF file
        for pdf_name in pdf_files:
            pdf_file_path = os.path.join(dirName, pdf_name)
            loader = PyMuPDFLoader(pdf_file_path)
            data = loader.load()  # extract the text in raw format

            for page in data:  # iterate over pdf pages
                output_path = os.path.join(dirName, f"{pdf_name}_page_{page.metadata['page']+1}_{page.metadata['total_pages']}.md")  # get the path for the new .md file
                with open(output_path, 'w') as f:  # open a new .md file
                    f.write(page.page_content)  # write in the .md file the raw text
                    print(f"Markdown for document {pdf_name}, page {page.metadata['page']+1}/{page.metadata['total_pages']} saved to {output_path}")

pdf_to_md(SourceDirectory)



def pdf_Page_to_PNG(pdf_file_path: str):
    # Specify the directory you want to start from
    SourceDirectory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources'

    # Walk through all subdirectories
    for dirName, subdirList, fileList in os.walk(SourceDirectory):
        # Filter the list to include only PDF files
        pdf_files = [file for file in fileList if file.endswith('.pdf')]

        # Now you can load each PDF file
        for pdf_name in pdf_files:
            pdf_file_path = os.path.join(dirName, pdf_name)
            doc = fitz.open(pdf_file_path) # load the document

            saved_pages = set()  # keep track of the pages that have been saved

            for page_index in range(len(doc)): # iterate over pdf pages
                page = doc[page_index] # get the page

                image_list = page.get_images() # get the images in the page

                # print the number of images found on the page
                if image_list:
                    print(f"Found {len(image_list)} images on page {page_index + 1}")
                else:
                    print("No images found on page", page_index + 1)

                if page_index not in saved_pages:  # if the page has not been saved yet
                    zoom = 2  # increase the resolution by increasing the zoom factor
                    mat = fitz.Matrix(zoom, zoom)
                    pix = page.get_pixmap(matrix=mat)  # render the page as an image

                    output_path = os.path.join(dirName, f"{pdf_name}_page_{page_index+1}.png")
                    pix.save(output_path)  # save the page as a png in the same folder as the pdf
                    print(f"Page {page_index+1} in document {pdf_name} saved to {output_path}")

                    saved_pages.add(page_index)  # mark the page as saved
                    #you have to remove the pages that dont have pictures manually



openai.api_key = "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"
def image_to_markdown(base64_image):
    prompt = """Describe the following picture as precisely as you can.
            It should contain all the information such that someone can recreate the image from the text explanation.
            Convert tables to markdown tables. Describe charts as best you can.
            If the picture contains people don't describe them, only what they are doing very briefly.
            Don't interpret what you see, only describe, nothing else.
            DO NOT return in a codeblock. Just return the raw text in markdown format.""" 
    
    # Makes a calll to GPT-4-vision to process an image
    response = openai_client.chat.completions.create(
    model="gpt-4-vision-preview",
    messages=[
        {
            "role": "user",
            "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}", "detail": "low"}}
            ],
        }
    ],
    max_tokens =  4096
    )
    return response.choices[0].message.content

def encode_image_to_base64(image_path):
    # Write the text description of the image in a .md file
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')
    

    #Process Images and stroe results oin .md files


def png_images_to_md():
    # Specify the directory you want to start from
    SourceDirectory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources'

    # Walk through all subdirectories
    for dirName, subdirList, fileList in os.walk(SourceDirectory):
        # Filter the list to include only PNG files
        png_files = [file for file in fileList if file.endswith('.png')]

        # Now you can process each PNG file
        for png_name in png_files:
            png_file_path = os.path.join(dirName, png_name)

            # Encode the image to base64
            base64_image = encode_image_to_base64(png_file_path)

            # Convert the base64 image to markdown
            markdown_content = image_to_markdown(base64_image)

            # Define the output path
            output_path = os.path.join(dirName, f"{png_name}_image.md")

            # Save the markdown content to a .md file
            with open(output_path, 'w') as f:
                f.write(markdown_content)
                print(f"Markdown for {png_name} saved to {output_path}")



#png_images_to_md()


#Implement later
def Sources_to_CSV():
    # Specify the directory you want to start from
    SourceDirectory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources'

    # Walk through all subdirectories
    # for dirName, subdirList, fileList in os.walk(SourceDirectory):










# def pdf_tables_to_csv():
#     # Specify the directory you want to start from
#     SourceDirectory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/AAChatPolite/Sources'

#     # Walk through all subdirectories
#     for dirName, subdirList, fileList in os.walk(SourceDirectory):
#         # Filter the list to include only PDF files
#         pdf_files = [file for file in fileList if file.endswith('.pdf')]

#         # Now you can load each PDF file
#         for pdf_name in pdf_files:
#             pdf_file_path = os.path.join(dirName, pdf_name)

#             saved_pages = set()  # keep track of the pages that have been saved

#             tables = camelot.read_pdf(pdf_file_path)  # read tables from the PDF file

#             for table_index, table in enumerate(tables):  # iterate over the tables
#                 page_number = table.parsing_report['page']  # get the page number

#                 if page_number not in saved_pages:  # if the page has not been saved yet
#                     output_path = os.path.join(dirName, f"{pdf_name}_page_{page_number}_table_{table_index+1}.csv")
#                     table.to_csv(output_path)  # save the table as a csv in the same folder as the pdf
#                     print(f"Table {table_index+1} from page {page_number} in document {pdf_name} saved to {output_path}")

#                     saved_pages.add(page_number)  # mark the page as saved



#pdf_tables_to_csv()

#pdf_Page_to_PNG(SourceDirectory) 


    