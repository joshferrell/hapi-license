import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const verify = promisify(jwt.verify);

/* eslint-disable import/prefer-default-export */

export const createLicenseValidator = (LicenseModel, secret = 'shhh') =>
    token => verify(token, secret);
