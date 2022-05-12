import { Router, Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import * as controller from '../controller/File.Controller';

const storageMulter = multer.diskStorage({
  destination: (req: Request, file, callback: CallableFunction) => {
    const dir = `${process.cwd()}/uploads`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: (req: Request, file, callback) => {
    console.log(file);
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storageMulter,
  limits: { fileSize: 300 / 0.00097656 },
}).single('upfile');

const routes = Router();

routes.post('/api/save', upload, controller.saveFile);
routes.get('/api/get', controller.getFile);
routes.get('/', (req, res) => { res.sendFile(`${process.cwd()}/src/views/index.html`); });

export { routes };
