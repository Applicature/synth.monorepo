import { DaoMapped } from './model';

export default (data: object | Array<any>) => {
  if (Array.isArray(data) && data.length >= 1) {
    return data.map((current) => Object.assign(new DaoMapped(), current));
  }
  return Object.assign(new DaoMapped(), data);
};
