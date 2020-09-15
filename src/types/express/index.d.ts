declare module Express {
  export interface Auth {
    email: string;
    firstName: string;
    lastName: string;
  }

  export type Local = {
    auth?: Auth;
  };

  export interface Request {
    local: Local;
  }
}
