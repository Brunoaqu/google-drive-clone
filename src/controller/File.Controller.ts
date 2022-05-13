import express from 'express';
import fs from 'fs';
import os from 'os';
import { IFileSchema } from '../modules/IFileSchema';
import { File } from '../modules/File.Module';

export class FileController {
  // Function to save file in system and his informations on MONGO database
  public async saveFile(request: express.Request, response: express.Response):Promise<void> {
    try {
      const upfile = request.file;

      const _username = request.body._username || os.hostname();
      const _path = `${process.cwd()}/uploads/${upfile?.filename}`;

      // Lógica para checar se o arquivo irá estourar o limite de 300mb
      const files: Array<IFileSchema> = await File.find({ user: _username });

      let total = 0;
      for (let i = 0; i < files.length; i += 1) {
        total += files[i].filesize;
      }

      if (total + upfile?.size <= 314572800) {
        const file = new File({
          name: upfile?.filename,
          path: _path,
          filesize: upfile?.size,
          user: _username,
        });
        const result = await file.save();
        response.status(200).json(result);
      } else {
        // Caso o teste não passe o arquivo é excluido
        // A biblioteca multer não possui uma maneira de realizar esse processo sem gastar processamento e espaço
        fs.unlink(_path, (error) => {
          if (error) throw error;
        });
        throw new Error('Você atingiu seu limite de armazenamento');
      }
    } catch (error: any) {
      response.status(400).json({ error: error.message });
    }
  }

  // Function to get file
  public async getFile(request: express.Request, response: express.Response):Promise<void> {
    try {
      const result: Array<IFileSchema> = await File.find({ name: request.params._filename });
      const path = fs.createReadStream(result[0].path);
      // Código que envia o arquivo
      path.pipe(response);
    } catch (error) {
      response.status(400).json(error);
    }
  }

  // Function to count how many files user have uploaded
  public async fileCount(request: express.Request, response: express.Response):Promise<void> {
    try {
      const _username = request.query._username || os.hostname();
      // Função do mongoose que conta o número de objetos selecionados
      const result = await File.find({ user: _username }).count();
      response.status(200).json({ nome: _username, arquivos: result });
    } catch (error) {
      response.status(400).json(error);
    }
  }

  // Function to calculate how much space user have used
  public async getUsedStorage(request: express.Request, response: express.Response):Promise<void> {
    try {
      const _username = request.query._username || os.hostname();

      const result: Array<IFileSchema> = await File.find({ user: _username });

      let total = 0;
      for (let i = 0; i < result.length; i += 1) {
        total += result[i].filesize;
      }

      response.status(200).json({ armazenamento: `${total / 1048576} MB` });
    } catch (error) {
      response.status(400).json(error);
    }
  }
}
