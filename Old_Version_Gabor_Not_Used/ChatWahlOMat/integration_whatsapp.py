
from groq import Groq
import os
import json

import dotenv
dotenv.load_dotenv()

# overwrites 'client' from common.py
client = Groq(api_key = os.getenv('GROQ_API_KEY'))
MODEL = 'llama3-70b-8192'

def go(ms):
    r = client.chat.completions.create(
        model=MODEL,
        messages=ms
    )

    return r.choices[0].message.content
    
from flask import Flask, request, jsonify, abort

app = Flask(__name__)

# not sure exactly what this does, but it's necessary
from flask_cors import CORS, cross_origin
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

ms = []

@app.route('/chat', methods=['POST'])
@cross_origin(headers=['Content-Type', 'Authorization'])
def chat():
    global ms
    try:
        data = request.get_json()
        
        if 'chat_message' not in data:
            abort(400)

        m = data['chat_message'].strip()
        if m == '':
            return jsonify({'response': 'Hmm... appears to be an empty message you just sent. What\'s up?'})
        
        ms.append({'role': 'user', 'content': m})
        rstring = go(ms)
        ms.append({'role': 'system', 'content': rstring})

        ms = ms[-5:]

        return jsonify({'response': rstring})
    except Exception as e:
        # print out the full details
        from traceback import format_exc
        print(format_exc())

        return jsonify({'response': 'error'})

# start on port 8007
if __name__ == '__main__':
    app.run(port=8007, debug=True)