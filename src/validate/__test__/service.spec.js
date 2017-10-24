import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { createLicenseValidator } from '../validate.service';

const sign = promisify(jwt.sign);

const signToken = body => sign(body, 'shhh', { algorithm: 'HS256' });

describe('validation services', () => {
    describe('license validator', () => {
        let tokenBody;
        let licenseValidate;
        beforeEach(() => {
            tokenBody = {
                accountId: '1234',
                computer: {
                    computerId: 'computer-id'
                },
                productId: 'product something'
            };

            licenseValidate = createLicenseValidator('shhh');
        });

        it('should verify a valid token', async () => {
            const token = await signToken(tokenBody);
            const decoded = await licenseValidate(token, 'computer-id');

            expect(decoded.accountId).toEqual('1234');
            expect(decoded.computer).toEqual({
                computerId: 'computer-id'
            });
            expect(decoded.productId).toEqual('product something');
        });

        it('should reject if the computer id is not in the token', async () => {
            tokenBody.computer.computerId = 'bad to the bone';
            const token = await signToken(tokenBody);
            return expect(licenseValidate(token, 'computer-id')).rejects.toMatchSnapshot();
        });
    });
});
