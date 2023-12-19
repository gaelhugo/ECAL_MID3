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

if __name__ == '__main__':
    # Spécifiez le port 8080
    app.run(debug=True, port=8080)