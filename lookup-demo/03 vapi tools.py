# a simple flask server to serve a single base url
# this is a query which accepts `issue` and `party` as parameters

from common import *
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin

app = Flask(__name__)

# not sure exactly what this does, but it's necessary
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def search_db(**kwargs):
    docs = db.docs.find(kwargs)
    docs = [
        f"(id={doc['id']})\n\n" + '\n'.join(f'{k}: {doc[k]}' for k in ['stance', 'party', 'issue', 'date', 'region'])
        for doc in docs
    ]
    docs = "\n".join(docs)
    return docs

@app.route('/', methods=['POST'])
@cross_origin(headers=['Content-Type', 'Authorization'])
def index():
    # note that they may not exist
    # they should be POST params
    srch = {}
    if 'issue' in request.form:
        srch['issue'] = request.form['issue']
    if 'party' in request.form:
        srch['party'] = request.form['party']

    print(srch)

    res = search_db(**srch)
    print(res)

    return Response(res, mimetype='text/plain')
    

# run on port 8007
app.run(port=8007)