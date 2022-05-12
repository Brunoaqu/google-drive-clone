import express from 'express';
import os from 'os';
import { File } from '../modules/File.Module';

const saveFile = async (request: express.Request, response: express.Response):Promise<void> => {
  const upfile = request.file;
  try {
    const file = new File({
      name: upfile?.filename,
      path: `${process.cwd()}/uploads/${upfile?.filename}`,
      size: Math.floor(upfile?.size * 0.00097656),
      user: os.hostname(),
    });
    const result = await file.save();
    response.json(result);
  } catch (error) {
    response.json({ error });
  }
};

const getFile = (request: express.Request, response: express.Response):void => {
  response.send('Get File');
};

export { saveFile, getFile };
