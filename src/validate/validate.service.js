import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const verify = promisify(jwt.verify);

/* eslint-disable import/prefer-default-export */

export const createLicenseValidator = (secret = 'shhh') => (token, computerId) =>
    verify(token, secret)
        .then(({ computer }) => (
            computer.computerId === computerId ?
                Promise.resolve(null) :
                Promise.reject(new Error('computer id does not match license'))
        ));
