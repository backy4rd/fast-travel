import { Document, Schema, model } from 'mongoose';
import { IUrlBase } from '../interfaces/IUrl';

export interface IUrl extends IUrlBase, Document {}

export const UrlSchema = new Schema({
  endpoint: { type: String, required: true, index: { unique: true } },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  clicks: [
    {
      referrer: { type: String },
      userAgent: { type: String },
      ipAddress: { type: String },
      createdAt: { type: Date, default: Date.now() },
    },
  ],
});

const Url = model<IUrl>('Url', UrlSchema);

export default Url;
