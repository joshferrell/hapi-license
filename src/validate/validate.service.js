import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const verify = promisify(jwt.verify);

/* eslint-disable import/prefer-default-export */

export const createLicenseValidator = secret => (token, computerId) =>
    verify(token, secret)
        .then(decodedToken => (
            decodedToken.computer.computerId === computerId ?
                Promise.resolve(decodedToken) :
                Promise.reject(new Error('computer id does not match license'))
        ));
