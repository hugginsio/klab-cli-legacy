import * as pkg from '../package.json';

export const manifest = {
  name: pkg.name,
  productName: pkg.productName,
  version: pkg.version,
  bugs: pkg.bugs
};

export default manifest;