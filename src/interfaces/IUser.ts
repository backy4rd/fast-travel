import { IUrl } from '../models/Url';

export interface IProfile {
  firstName: string;
  lastName: string;
}

export interface IUserBase {
  email: string;
  password: string;
  profile: IProfile;
  urls: IUrl[];
}
