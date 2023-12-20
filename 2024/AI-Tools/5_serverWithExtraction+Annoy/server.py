from flask import Flask
from flask import request
from flask import jsonify
from flask import render_template
import clip
import torch
from PIL import Image 
import numpy as np
import os
import pandas as pd
import base64
from io import BytesIO
from annoy import AnnoyIndex


#function d'extraction de features
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/16")

def get_features(image):
    image_input = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        image_features = model.encode_image(image_input)
    return image_features.cpu().numpy()


app = Flask(__name__,  template_folder='templates', static_folder='static')

@app.route('/')
def hello_world():
    # renvoyer la page template index.html
    return render_template('index.html')




@app.route("/search/", methods=["POST"])
def search():
    # On prépare le graph 
    f = 512
    t  = AnnoyIndex(f, 'angular')
    t.load('./static/annoy/index.ann') # super fast, will just mmap the file
    # on récupère les urls des images
    urls = pd.read_csv("./static/csv/imagesList.csv", header=None)
    urls_list = urls.values.tolist()

    # Récupérer les featrures de l'image
    data = request.form['image'].split(',')[1]
    # Décoder la chaîne base64
    image_data = base64.b64decode(data)
    # Utiliser PIL pour ouvrir l'image depuis les données binaires
    image = Image.open(BytesIO(image_data))
    # Extraire les features
    features = get_features(image)
    # Rechercher les images similaires
    response = t.get_nns_by_vector(features[0], 5, search_k=-1, include_distances=True)
    print(response)
    # Retourner les urls des images similaires
    return jsonify({"urls":[urls_list[i][0] for i in response[0]],"distances":[i for i in response[1]]})

    

@app.route("/get_features/", methods=["POST"])
def get_features_from_image():
    # Récupérer les données de la requête
    data = request.form['image'].split(',')[1]
    # Décoder la chaîne base64
    image_data = base64.b64decode(data)
    # Utiliser PIL pour ouvrir l'image depuis les données binaires
    image = Image.open(BytesIO(image_data))
    # Extraire les features
    features = get_features(image)
    # Retourner les features au format JSON
    return jsonify(features.tolist())

@app.route("/build_annoy/", methods=["POST"])
def build_annoy_index():
    # List toutes les images dans le dossier images
    images = os.listdir("static/images")
    # pour chaque image, on extrait les features
    features = []
    urls = []
    for _image in images:
        image = Image.open("static/images/"+_image)
        features.append(get_features(image))
        print(_image)
        urls.append("static/images/"+_image)

    # npy_sauvegarde = torch.cat(features).cpu().numpy()
    npy_sauvegarde = np.array(features)
    with open("./static/npy/features.npy","wb") as f:
        np.save(f,npy_sauvegarde)
    pandas_list = pd.DataFrame(urls)
    pandas_list.to_csv("./static/csv/imagesList.csv", index=False, header=False)

    # build annoy index
    f = 512
    t = AnnoyIndex(f)
    for i in range(len(features)):
        print(features[i][0])
        v = features[i][0]
        t.add_item(i, v)
    t.build(100) # 10 trees
    t.save('./static/annoy/index.ann')

    return jsonify({"message":"annoy ready"})


if __name__ == '__main__':
    # Spécifiez le port 8080
    app.run(debug=True, host="0.0.0.0",port=8080, ssl_context='adhoc')