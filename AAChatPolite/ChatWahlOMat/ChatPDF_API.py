import requests
file_path = "/Users/gaborhollbeck/Desktop/GitHub/GPT-4-Elections/AAChatPolite/Sources/IPCC/IPCC_AR6_SYR_SPM.pdf"
api_key =  "sec_t2Ba3TDJY6Ru5zpevsfiV7NqRShwCMoF"

def upload_pdf_to_chatpdf(file_path, api_key):
    # API endpoint for uploading a PDF file
    endpoint = "https://api.chatpdf.com/v1/sources/add-file"
    
    # Headers including the API key for authentication
    headers = {
        'x-api-key': api_key
    }
    
    # The file to be uploaded
    files = {
        'file': (file_path, open(file_path, 'rb'), 'application/pdf')
    }
    
    # Making the POST request to the ChatPDF API
    response = requests.post(endpoint, headers=headers, files=files)
    
    # Cleaning up by closing the file
    files['file'][1].close()
    
    # Checking the response status code
    if response.status_code == 200:
        # Extracting the source ID from the response
        source_id = response.json().get('sourceId')
        print('Source ID:', source_id)
        return source_id
    else:
        # Print error details if the request failed
        print('Failed to upload PDF:', response.status_code, response.text)

# Replace 'path_to_your_pdf' with the actual path to your PDF file and 'your_api_key' with your ChatPDF API key
#source_id = upload_pdf_to_chatpdf(file_path, api_key)

# if source_id:
#     print("PDF was successfully uploaded with Source ID:", source_id)
# else:
#     print("Failed to upload PDF.")









def chat_with_pdf(source_id, api_key, message):
    # API endpoint for sending a chat message
    endpoint = "https://api.chatpdf.com/v1/chats/message"
    
    # Headers including the API key for authentication
    headers = {
        'x-api-key': api_key,
        'Content-Type': 'application/json'
    }
    
    # Prepare the chat data
    chat_data = {
        'sourceId': source_id,
        'messages': [{'role': 'user', 'content': message} ]
    }
    
    try:
        response = requests.post(endpoint, json=chat_data, headers=headers, stream=True)
        response.raise_for_status()

        if response.iter_content:
            max_chunk_size = 1024
            for chunk in response.iter_content(max_chunk_size):
                text = chunk.decode()
                print("Chunk:", text.strip())
        else:
            raise Exception("No data received")
    except requests.exceptions.RequestException as error:
        print("Error:", error)

# Example usage
message = "how much has the venus warmed by now? provide a source"
source_id = "src_IKloKJEQqqiPF2ndwYGSr"
chat_with_pdf(source_id, api_key, message)
