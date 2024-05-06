from openai import OpenAI
import openai
import whisper

import os

os.environ['OPENAI_API_KEY'] = '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'

openai.api_key = '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'


def transcribe(file_path, run: str):

    if run == "local":
        model = whisper.load_model("medium")
        result = model.transcribe(file_path)
        transcription = result["text"]
        #print(result["text"])

    elif run == "server":
        client = OpenAI()

        with open(file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file, 
            response_format="text"
            )
        #print(transcription)
    return transcription







# import whisper




# from openai import OpenAI
# client = OpenAI()

# # Set your OpenAI API key
# #openai.api_key = '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'

# # Path to your audio file
# with open(file_path, "rb") as audio_file:
#     transcription = client.audio.transcriptions.create(
#         model="whisper-1", 
#         file=audio_file, 
#     response_format="text"
#     )
# print(transcription)





# model = whisper.load_model("medium")
# result = model.transcribe(file_path)
# print(result["text"])

