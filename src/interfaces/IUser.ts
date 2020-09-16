export interface IProfile {
  firstName: string;
  lastName: string;
}

export interface IUserBase {
  email: string;
  password: string;
  uuid: string;
  profile: IProfile;
}
