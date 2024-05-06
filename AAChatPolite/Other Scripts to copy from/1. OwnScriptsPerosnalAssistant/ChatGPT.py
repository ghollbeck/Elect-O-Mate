import os

from Embedding import vectorsearch
from IPython.display import display, Markdown

import base64
from openai import OpenAI

from pathlib import Path
import tempfile

import simpleaudio as sa


from pydub import AudioSegment



os.environ['OPENAI_API_KEY'] = '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'
api_key ='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'
openai_client = OpenAI(api_key=api_key)
client = OpenAI(api_key=api_key)





question = "what names was I talking about?"

def AskChatGPT(question):

    results = vectorsearch(question)

    # System Prompt Behaviour
    behaviour = f"""\
    You are a helpful assistant.
    """

    # Question + Context
    question = f"""\
    CONTEXT: {results['documents'][0]}

    QUESTION: {question}
    """

    ### This is the final prompt
    messages=[
        {"role": "system", "content": behaviour},
        {"role": "user", "content": question},
    ]




    ### Call to OPEN AI

    # randomness seed (0 no randomness)
    temperature = 0.5 # @param {type:"slider", min:0, max:1, step:0.1}
    # tokens to expect as response
    max_tokens = 4000 # @param {type: "slider", min:100, max: 12000, step: 100}

    response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo", # gpt-4
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
        top_p=1,
        frequency_penalty=1,
        presence_penalty=1
    )

    #display(Markdown(response.choices[0].message.content))
    print(response.choices[0].message.content)
        
    
    # Create a temporary file for the MP3
    temp_file_mp3 = tempfile.NamedTemporaryFile(suffix=".mp3", delete=True)

    response2 = client.audio.speech.create(
        model="tts-1",
        voice="echo",
        input=response.choices[0].message.content
    )

    # Write the response to the temporary MP3 file
    response2.stream_to_file(Path(temp_file_mp3.name))

    # Convert MP3 to WAV
    audio = AudioSegment.from_mp3(temp_file_mp3.name)
    temp_file_wav = tempfile.NamedTemporaryFile(suffix=".wav", delete=True)
    audio.export(temp_file_wav.name, format="wav")

    # Play the audio file
    wave_obj = sa.WaveObject.from_wave_file(temp_file_wav.name)
    play_obj = wave_obj.play()
    play_obj.wait_done()  # Wait for the audio file to finish playing

    # The temporary files will be deleted when they are closed
    temp_file_mp3.close()
    temp_file_wav.close()

    return response.choices[0].message.content






question = "did i talk about luis vuitton?"
print(AskChatGPT(question))


