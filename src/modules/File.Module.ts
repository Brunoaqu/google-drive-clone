import { Schema, model } from 'mongoose';
import { IFileSchema } from './IFileSchema';

const FileSchema = new Schema<IFileSchema>(
  {
    name: { type: String },
    path: { type: String },
    filesize: { type: Number },
    user: { type: String },
  },
  { versionKey: false },
);

const File = model<IFileSchema>('User', FileSchema);

export { File };
