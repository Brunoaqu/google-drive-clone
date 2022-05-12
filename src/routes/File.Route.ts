import { Response, Request, Application } from 'express';
import fs from 'fs';
import multer from 'multer';
import { FileController } from '../controller/File.Controller';

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

export class FileRoutes {
  public fileController: FileController = new FileController();

  public routes(app: Application): void {
    // Static main page
    app.route('/')
      .get((request: Request, response: Response) => {
        response.status(200).sendFile(`${process.cwd()}/src/views/index.html`);
      });

    // Save File route
    app.route('/api/file')
      .post(upload, this.fileController.saveFile);

    // Get File route
    app.route('/api/file/:_filename')
      .get(this.fileController.getFile);

    // Get number of Files uploads with user name
    app.route('/api/filecount')
      .get(this.fileController.fileCount);

    // Get used storage in KB
    app.route('/api/storage')
      .get(this.fileController.getUsedStorage);
  }
}
