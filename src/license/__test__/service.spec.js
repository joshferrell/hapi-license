import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { mapUrl, createLicenseIssuer } from '../license.service';

const verify = promisify(jwt.verify);

describe('license services', () => {
    beforeEach(() => {
        process.env.SERVER_SCHEME = 'https';
        process.env.SERVER_URL = 'localhost:3000';
    });

    describe('license map url', () => {
        it('should return the url for a particular license object', () => {
            const license = {
                test: 'Hi I\'m Paul!',
                id: '1234'
            };

            expect(mapUrl(license)).toEqual({
                test: 'Hi I\'m Paul!',
                id: '1234',
                url: 'https://localhost:3000/license/1234'
            });
        });
    });

    describe('issue license', async () => {
        const issueLicense = createLicenseIssuer();
        const data = {
            accountId: '1234',
            validUntil: '2099-01-01',
            computer: 'Paul\'s Macbook',
            productId: 'awesome product!'
        };

        const license = await issueLicense(data);
        const decoded = await verify(license, 'shhh');
        expect(decoded).toMatchSnapshot();
    });
});
