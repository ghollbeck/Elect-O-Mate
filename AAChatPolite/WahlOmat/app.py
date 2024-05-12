from flask import Flask, render_template, request, session
from openai import OpenAI

app = Flask(__name__)
app.config['SECRET_KEY'] = b'sk-proj-poVcYbfC5Cy3NgbvNhUIT3BlbkFJqtLU4GwHwGKkKq7iFANg'
app.config['TEMPLATES_AUTO_RELOAD'] = True
#openai.api_key = 'sk-proj-poVcYbfC5Cy3NgbvNhUIT3BlbkFJqtLU4GwHwGKkKq7iFANg'
client = OpenAI(api_key='sk-proj-FxajJi8pFr1pSy3RtLVxT3BlbkFJZ3JDd11tRwY4ulijWZdz')

def get_data():
  completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a helpful assistant for politics"},
    {"role": "user", "content": session['query']}
  ]
  )
  response = completion.choices[0].message.content
  return response

@app.route("/", methods=["GET", "POST"])
def index():
  if request.method == "POST":
    query = request.form['q']
    # Setze die Abfrage in der Session
    session['query'] += "Question: " + query + "\n"
    session.modified = True
    # Abrufen der Daten
    response = get_data()
    session['query'] += "You answered: " + response + "\n"
    session.modified = True
    
    return render_template("index.html", question=query, response=response)
  # Wenn GET-Anfrage, zeige einfach das Formular an
  return render_template("index.html", question='query', response="response")

if __name__ == '__main__':
    app.run(debug=True)
