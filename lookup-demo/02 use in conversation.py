from tools import *
from common import *

"""
Example doc:
{
    "source": "CDU Policy Brief 2024",
    "source text": "We believe that a moderate increase in carbon taxes is necessary to fund technological innovations and reduce emissions without harming the economy.",
    "stance": "Supports moderate increase in carbon taxes",
    "party": "Christian Democratic Union (CDU)",
    "issue": "Climate Change",
    "date": "2024-04-15",
    "region": "National",
    "tags": ["environment", "tax policy"]
}
"""

gpt_small = "gpt-3.5-turbo"
gpt_big = "gpt-4-turbo-preview"

t = Thread(client)

a = t.create_assistant(
    name="Political Helper",
    instructions=(
        "You are a helpful assistant for politics. "
        "You can help answer questions about the stances of various political parties, try to match individuals to the party that best represents their views, or provide information on the political process. "
        "Always answer in a neutral and informative manner. "
        "Keep your responses as short as possible. This should be a conversation, not a lecture. "
    ),
    model = gpt_big
)

def search_db(**kwargs):
    docs = db.docs.find(kwargs)
    docs = [
        f"(id={doc['id']})\n" + '\n'.join(f'{k}: {doc[k]}' for k in ['stance', 'party', 'issue', 'date', 'region'])
        for doc in docs
    ]
    docs = "\n".join(docs)

    if not docs:
        return "No results found."

    return docs

issues = db.docs.distinct("issue")
parties = db.docs.distinct("party")

a.add_tool(
    name="search_db",
    description="Search for policy positions in the database",
    parameters=(
        Parameters()
            .add_property("issue", "string", "The issue to search for. One of " + ", ".join(issues), required=False)
            .add_property("party", "string", "The party to search for. One of " + ", ".join(parties), required=False)
    ).json(),
    function=search_db,
)

a.initialize()

while True:
    m = input("> ")
    t.say('user', m)
    result = a.complete()
    print(result)