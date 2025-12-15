import torch
import numpy as np
import os
import pandas as pd
from flask import Flask, request, jsonify, render_template
from voyager import Index, Space
import laion_clap

app = Flask(__name__)

EMBEDDINGS_PATH = 'chunk_embeddings.npy'
METADATA_PATH = 'all_chunk_metadata.csv'
VOYAGER_INDEX_PATH = 'chunk_embeddings.voy'

VOYAGER_M = 64
VOYAGER_EF_CONSTRUCTION = 200
VOYAGER_EF = 200

embeddings = np.load(EMBEDDINGS_PATH, mmap_mode='r')
if embeddings.ndim != 2 or embeddings.shape[1] != 512:
    raise ValueError(f"Expected embeddings of shape (N, 512), got {embeddings.shape}")
embeddings = np.asarray(embeddings, dtype=np.float32)

def build_voyager_index():
    idx = Index(
        Space.Cosine,
        num_dimensions=512,
        M=VOYAGER_M,
        ef_construction=VOYAGER_EF_CONSTRUCTION,
        max_elements=int(embeddings.shape[0]),
    )
    idx.ef = VOYAGER_EF
    idx.add_items(embeddings)
    idx.save(VOYAGER_INDEX_PATH)
    return idx

if os.path.exists(VOYAGER_INDEX_PATH):
    voy_index = Index.load(VOYAGER_INDEX_PATH)
    voy_index.ef = VOYAGER_EF
else:
    voy_index = build_voyager_index()

metadata = pd.read_csv(METADATA_PATH)

#load Clap model
model = laion_clap.CLAP_Module(enable_fusion=False, amodel='HTSAT-base')
print("loading checkpoint")
# set gpu if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()
# List of available models to download: https://github.com/LAION-AI/CLAP?tab=readme-ov-file#pretrained-models
model.load_ckpt("music_audioset_epoch_15_esc_90.14.pt")

@app.route('/', methods=['GET'])
def homepage():
    return render_template('index.html')

def get_text_embedding_vector(text_data):
    text_data = str(text_data)
    with torch.no_grad():
        text_embed = model.get_text_embedding([text_data], use_tensor=True)
    text_embed = text_embed.detach().to('cpu').float().numpy()
    return text_embed[0]

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json(silent=True) or request.form
    query = data.get('query')
    k = int(data.get('k', 10))

    query_vec = get_text_embedding_vector(query)
    k = min(k, len(metadata))
    try:
        neighbors, _ = voy_index.query(query_vec, k=k)
    except Exception as e:
        if e.__class__.__name__ != 'RecallError':
            raise
        return jsonify({
            "error": "Voyager RecallError: insufficient recall to return k neighbors. Rebuild index with higher VOYAGER_M (e.g. 96/128) and REBUILD_VOYAGER=1.",
            "k": k,
        }), 500

    # get metadata for neighbors
    results = metadata.iloc[neighbors].to_dict('records')
    
    return jsonify(results) 


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)