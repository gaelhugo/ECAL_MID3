class App {
  constructor() {
    console.log("App is loaded");
    this.image = new Image();
    this.image.width = 300;
    this.image.height = 300;
    this.image.src = "static/images/car.png";
    document.querySelector(".container").appendChild(this.image);
    this.button = document.querySelector("#extraction");
    this.annoy = document.querySelector("#annoy");
    this.search = document.querySelector("#search");
    // action buttons
    this.button.addEventListener("click", this.handleClick.bind(this));
    this.annoy.addEventListener("click", this.handleAnnoy.bind(this));
    this.search.addEventListener("click", this.handleSearch.bind(this));

    // small test to activate camera (Marius request)
    new Camera();
  }

  handleClick(e) {
    console.log("sending image to server");
    this.postImage();
  }
  handleAnnoy(e) {
    console.log("sending image to server");
    this.postAnnoy();
  }
  handleSearch(e) {
    console.log("sending image to server");
    this.postSearch();
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
        document.querySelector(".console").textContent = data.join(",");
      });
  }

  postAnnoy() {
    fetch("/build_annoy", {
      method: "POST",
      body: null,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  postSearch() {
    const formData = new FormData();
    // Convertir l'image en base64
    const base64Image = this.imageToBase64(this.image);
    // Ajouter la chaîne base64 à FormData avec la clé "image"
    formData.append("image", base64Image);

    fetch("/search", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        document.querySelector(".console").innerHTML = "";
        data.urls.forEach((element) => {
          let img = document.createElement("img");
          img.src = element;
          img.width = 125;
          img.height = 125;
          document.querySelector(".console").appendChild(img);
        });
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
