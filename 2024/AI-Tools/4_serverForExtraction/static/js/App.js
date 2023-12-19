class App {
  constructor() {
    console.log("App is loaded");
    this.image = new Image();
    this.image.src = "static/images/image.png";
    document.body.appendChild(this.image);
    document.addEventListener("click", this.handleClick.bind(this));
  }

  handleClick(e) {
    console.log("sending image to server");
    this.postImage();
  }

  postImage() {
    const formData = new FormData();
    // Convertir l'image en base64
    const base64Image = this.imageToBase64(this.image);

    // Ajouter la chaîne base64 à FormData avec la clé "image"
    formData.append("image", base64Image);
    fetch("/get_features", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  imageToBase64(image) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Définir la taille du canvas pour correspondre à l'image
    canvas.width = image.width;
    canvas.height = image.height;

    // Dessiner l'image sur le canvas
    ctx.drawImage(image, 0, 0);

    // Obtenir les données de l'image sous forme de base64
    const base64Image = canvas.toDataURL("image/jpeg"); // Vous pouvez ajuster le format selon vos besoins

    return base64Image;
  }
}

window.onload = () => {
  new App();
};
