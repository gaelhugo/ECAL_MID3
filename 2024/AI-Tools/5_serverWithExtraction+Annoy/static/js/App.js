class App {
  constructor() {
    console.log("App is loaded");
    this.image = new Image();
    this.image.width = 300;
    this.image.height = 300;
    this.image.src = "static/images/truck.png";
    document.querySelector(".container").appendChild(this.image);
    this.button = document.querySelector("#extraction");
    this.annoy = document.querySelector("#annoy");
    this.search = document.querySelector("#search");
    this.distance = document.querySelector("#distance");
    this.input = document.querySelector("#search_input");
    this.search_text = document.querySelector("#search_text");
    // action buttons
    this.button.addEventListener("click", this.handleClick.bind(this));
    this.annoy.addEventListener("click", this.handleAnnoy.bind(this));
    this.search.addEventListener("click", this.handleSearch.bind(this));
    this.distance.addEventListener("click", this.handleDistance.bind(this));
    this.search_text.addEventListener(
      "click",
      this.handleSearchText.bind(this)
    );

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

  handleSearchText(e) {
    console.log("sending text to server");
    this.postSearchText();
  }

  handleDistance(e) {
    console.log("sending distance to server");
    // index of the image
    let name_of_image = "static/images/truck.png";
    this.postDistance(name_of_image);
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

  postSearchText() {
    const formData = new FormData();
    formData.append("text", this.input.value);
    fetch("/search_by_text", {
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

  postDistance(image_name) {
    const formData = new FormData();
    // Convertir l'image en base64
    const base64Image = this.imageToBase64(this.image);
    // Ajouter la chaîne base64 à FormData avec la clé "image"
    formData.append("image", base64Image);
    // add index of the image
    formData.append("refImage", image_name);

    fetch("/getDistance", {
      method: "POST",
      body: formData,
    })
      .then((data) => data.json())
      .then((json) => {
        console.log(json);
        // document.querySelector(".console").textContent = json;
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
