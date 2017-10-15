import { oneLineTrim } from 'common-tags';

/* eslint-disable import/prefer-default-export */
export const mapUrl = license => Object.assign({}, license, {
    url: oneLineTrim`
        ${process.env.SERVER_SCHEME}://
        ${process.env.SERVER_URL}/license/${license.id}
    `
});
