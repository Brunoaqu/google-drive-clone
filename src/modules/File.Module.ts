import { Schema, model } from 'mongoose';
import { IFile } from './IFile';

const FileSchema = new Schema<IFile>(
  {
    name: { type: String },
    path: { type: String },
    size: { type: Number },
    user: { type: String },
  },
  { versionKey: false },
);

const File = model<IFile>('User', FileSchema);

export { File };
