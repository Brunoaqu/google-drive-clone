import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { FileRoutes } from './routes/File.Route';

// Configuração do express
class App {
  public app: express.Application = express();

  public fileRoute: FileRoutes = new FileRoutes();

  public mongoUrl: string = process.env.MONGODB_URI || '';

  constructor() {
    this.config();
    this.mongoSetup();
    this.fileRoute.routes(this.app);
  }

  private config():void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/public', express.static(`${process.cwd()}/src/public`));
  }

  private mongoSetup():void {
    mongoose
      .connect(this.mongoUrl || '')
      .then(() => { console.log('Connection with mongo database was successful'); })
      .catch((err) => console.log(err));
  }
}

export default new App().app;
