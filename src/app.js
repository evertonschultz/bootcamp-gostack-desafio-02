import express from 'express'; // import o servidor express
import routes from './routes'; // import as rotas de outro arquivo

import './database';

class App {
  // cria a classe App
  constructor() {
    // medotodo que é chamamos automaticamente quanto instanciar a classe App
    this.server = express(); // Definindo uma variavel como express

    this.middlewares(); // chamando os metodos
    this.routes();
  }

  middlewares() {
    // definindo metodos
    this.server.use(express.json()); // apartir de agora pode receber requisiçoes JSON
  }

  routes() {
    // definindo metodos
    this.server.use(routes);
  }
}

export default new App().server; // exportando uma nova instancia de App, so o server
