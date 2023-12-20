class Config {
  constructor() {
    this.IP = "192.168.1.232";
    //

    this.HASH = `0yaz5cngrl1`;

    //
    this.LOCAL = `http://${this.IP}:8080`;
    this.API = `http://${this.IP}:7860/`;
  }
}

export default new Config();
