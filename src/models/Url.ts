import { Document, Schema, model } from 'mongoose';

export interface IUrl extends Document {
  endpoint: String;
  url: String;
  click: Number;
}

export const UrlSchema = new Schema(
  {
    endpoint: { type: String, required: true, index: { unique: true } },
    url: { type: String, required: true },
    click: { type: Number, required: true },
  },
  { timestamps: true },
);

const Url = model<IUrl>('Url', UrlSchema);

export default Url;
