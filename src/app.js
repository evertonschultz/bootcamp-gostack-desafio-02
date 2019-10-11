import 'dotenv/config';

import express from 'express'; // import o servidor express
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes'; // import as rotas de outro arquivo
import sentryConfig from './config/sentry';
import './database';

class App {
  // cria a classe App
  constructor() {
    // medotodo que é chamamos automaticamente quanto instanciar a classe App
    this.server = express(); // Definindo uma variavel como express

    Sentry.init(sentryConfig);

    this.server.use(Sentry.Handlers.requestHandler());
    this.middlewares(); // chamando os metodos
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // definindo metodos
    this.server.use(express.json()); // apartir de agora pode receber requisiçoes JSON
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    // definindo metodos
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  // verificar
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server; // exportando uma nova instancia de App, so o server
