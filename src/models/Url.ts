import { Document, Schema, model, Model } from 'mongoose';
import { IUrlBase } from '../interfaces/IUrl';

const endpointLength = 6;
const characterSet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export interface IUrl extends IUrlBase, Document {}

interface IUrlModel extends Model<IUrl> {
  genEndpoint(): string;
  isEndpointExist(endpoint: string): Promise<boolean>;
}

export const UrlSchema = new Schema(
  {
    endpoint: {
      type: String,
      required: 'Id is required',
      maxlength: [endpointLength, `Id must have ${endpointLength} character`],
      minlength: [endpointLength, `Id must have ${endpointLength} character`],
      match: [
        /^[0-9A-Za-z]+$/,
        'Endpoint must only contain alphabet character and number',
      ],
      index: true,
    },
    url: {
      type: String,
      required: 'Url is required',
      match: [
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
        'Invalid url',
      ],
    },
    clicks: [
      {
        referrer: { type: String, default: null },
        userAgent: { type: String, default: null },
        ipAddress: { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: {
      type: String,
      default: null,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Invalid email address',
      ],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

// Static methods
UrlSchema.statics.genEndpoint = function () {
  let endpoint = '';
  for (let i = 0; i < endpointLength; i++) {
    endpoint += characterSet[Math.floor(Math.random() * characterSet.length)];
  }
  return endpoint;
};

UrlSchema.statics.isEndpointExist = function (endpoint: string) {
  return this.exists({ endpoint: endpoint });
};

const Url = model<IUrl, IUrlModel>('Url', UrlSchema);

export default Url;
