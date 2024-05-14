import numpy as np
import tensorflow_hub as hub
from sklearn.neighbors import NearestNeighbors

# Load the Universal Sentence Encoder from TensorFlow Hub
use = hub.load('https://tfhub.dev/google/universal-sentence-encoder/4')
embeddings = []
data = []
nn = None
fitted = False
fitted = False


def fit(data_input, batch=1000, n_neighbors=5):
    global embeddings, nn, fitted
    data.extend(data_input)
    batch_embeddings = []
    for i in range(0, len(data), batch):
        text_batch = data[i:i+batch]
        emb_batch = use(text_batch)
        batch_embeddings.append(emb_batch)
    embeddings = np.vstack(batch_embeddings)
    n_neighbors = min(n_neighbors, len(embeddings))
    nn = NearestNeighbors(n_neighbors=n_neighbors)
    nn.fit(embeddings)
    fitted = True

def get_neighbors(text, return_data=True):
    if not fitted:
        raise ValueError("The model has not been fitted yet.")
    inp_emb = use([text])
    neighbors = nn.kneighbors(inp_emb, return_distance=False)[0]
    if return_data:
        return [data[i] for i in neighbors]
    else:
        return neighbors

# Example Usage
# Assuming you have your data ready as a list of strings:
texts = ["sample text 1", "sample text 2", "sample text 3"]
fit(texts)  # Fit the model with your data

# Example query
query = "explain the first text"
results = get_neighbors(query)
print("Results:", results)
