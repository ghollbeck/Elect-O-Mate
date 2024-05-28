import base64
import requests
import json

# OpenAI API Key
api_key = "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"

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Path to your image
image_path = "/Users/gaborhollbeck/Desktop/Screenshots/Screenshot 2024-05-28 at 19.08.49.png"

# Getting the base64 string
base64_image = encode_image(image_path)

headers = {
  "Content-Type": "application/json",
  "Authorization": f"Bearer {api_key}"
}

payload = {
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
            "text": "extract the data fro the image like Question number, Question Label, Party Name, Question Label, Party Answer. Then put it into a nice json file structure"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": f"data:image/jpeg;base64,{base64_image}"
          }
        }
      ]
    }
  ],
  "max_tokens": 300
}

response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

# Save response as JSON file
#with open('/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/Sources/ResponseInterpreter.json', 'w') as file:
#   json.dump(print(response.content), file)



print(response.json())




