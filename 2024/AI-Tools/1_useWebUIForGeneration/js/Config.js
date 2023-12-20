class Config {
  constructor() {
    this.IP = "localhost";
    //

    this.HASH = `0yaz5cngrl1`;

    //
    this.LOCAL = `http://${this.IP}:8080`;
    this.API = `http://${this.IP}:7860/`;
  }
}

export default new Config();
