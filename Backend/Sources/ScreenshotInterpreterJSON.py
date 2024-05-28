
from openai import OpenAI

import openai
api_key ="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"
openai_client = OpenAI(api_key=api_key)


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
            {"type": "image_url", 
            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}", "detail": "low"}}
            ],
        }
    ],
    max_tokens =  4096
    )
    return response.choices[0].message.content



#print(image_to_markdown("data:image/jpeg;base64,/Users/gaborhollbeck/Desktop/Screenshots/Screenshot 2024-05-28 at 19.08.49.png"))

import base64

# Open the image file in binary mode, read it, and encode it as base64
with open("/Users/gaborhollbeck/Desktop/Screenshots/Screenshot 2024-05-28 at 19.08.49.png", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode()

# Pass the base64 string to the image_to_markdown function
print(image_to_markdown(f"data:image/jpeg;base64,{encoded_string}"))