import chromadb
import os

from chromadb.config import Settings
from chromadb.utils  import embedding_functions

from IPython.display import display, Markdown




dataDirectory = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/Transcriptions/mdFiles'
dir_Chroma = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/Transcriptions/ChromaDB'


def vectorsearch(question:str):


    chroma_client = chromadb.PersistentClient(dir_Chroma)
    # embedding function
    default_ef = embedding_functions.DefaultEmbeddingFunction()

    collection = chroma_client.get_or_create_collection(name="pdf", embedding_function=default_ef)
    print("created new collection")



    # os.walk returns a generator, that creates a tuple of values
    # (current_path, directories in current_path, files in current_path)
    for current_path, directories, files in os.walk(dataDirectory):
        for filename in files:
            if filename.endswith('.md'):
                # construct full file path
                filepath = os.path.join(current_path, filename)
                with open(filepath, 'r') as f:
                    fileContent = f.read()

                # Call your function on the file content
                #print(f"adding document {filepath}")
                collection.upsert(documents=[fileContent], ids=[filepath])


    
    # = "What were the sport in the ancient olympics?" #@param {type:"string"}
    nr_of_results = 4 #@param {type:"slider", min:1, max:10}
    #### Step 5.2: Search Vector Database
    results = collection.query(query_texts=[question], n_results=nr_of_results)
    
    return results 



question = "Flash-Konsum"
search_results = vectorsearch(question)
print(search_results['documents'][0])

