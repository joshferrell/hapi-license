import { oneLineTrim } from 'common-tags';
import moment from 'moment';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const sign = promisify(jwt.sign);

export const mapUrl = license => Object.assign({}, license, {
    url: oneLineTrim`
        ${process.env.SERVER_SCHEME}://
        ${process.env.SERVER_URL}/license/${license.id}
    `
});

export const createLicenseIssuer = () => ({
    accountId,
    validUntil,
    computer,
    productId
}) => sign(
    {
        accountId,
        computer,
        productId,
        exp: Number.parseInt(moment(validUntil).format('x'), 10)
    },
    'shhh',
    { algorithm: 'HS256' }
);
