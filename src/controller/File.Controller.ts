import express from 'express';
import fs from 'fs';
import os from 'os';
import { IFileSchema } from '../modules/IFileSchema';
import { File } from '../modules/File.Module';

export class FileController {
  public async saveFile(request: express.Request, response: express.Response):Promise<void> {
    try {
      const upfile = request.file;
      const _username = request.body._username || os.hostname();
      const file = new File({
        name: upfile?.filename,
        path: `${process.cwd()}/uploads/${upfile?.filename}`,
        filesize: upfile?.size * 0.00097656,
        user: _username,
      });
      const result = await file.save();
      response.json(result);
    } catch (error) {
      response.json({ error });
    }
  }

  public async getFile(request: express.Request, response: express.Response):Promise<void> {
    try {
      const result: Array<IFileSchema> = await File.find({ name: request.params._filename });
      const path = fs.createReadStream(result[0].path);
      path.pipe(response);
    } catch (error) {
      response.json(error);
    }
  }

  public async fileCount(request: express.Request, response: express.Response):Promise<void> {
    try {
      const _username = request.query._username || os.hostname();
      const result = await File.find({ user: _username }).count();
      response.json({ nome: _username, arquivos: result });
    } catch (error) {
      response.json(error);
    }
  }

  public async getUsedStorage(request: express.Request, response: express.Response):Promise<void> {
    try {
      const _username = request.query._username || os.hostname();
      const result: Array<IFileSchema> = await File.find({ user: _username });

      let total = 0;
      for (let i = 0; i < result.length; i += 1) {
        total += result[i].filesize;
      }
      response.json({ armazenamento: total });
    } catch (error) {
      response.json(error);
    }
  }
}
