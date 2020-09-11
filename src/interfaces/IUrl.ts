import { IUser } from '../models/User';

export interface IClick {
  referrer: string;
  userAgent: string;
  ipAddress: string;
}

export interface IUrlBase {
  endpoint: string;
  url: string;
  clicks: IClick[];
  createdBy: IUser;
}
