export interface IClick {
  referrer: string;
  userAgent: string;
  ipAddress: string;
}

export interface IUrlBase {
  endpoint: string;
  url: string;
  clicks: IClick[];
  createdBy: string;
}
