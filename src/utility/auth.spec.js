import { dissoc } from 'ramda';
import createStrategy, { validateUser } from './auth';

describe('server authentication', () => {
    describe('validating a user object', () => {
        let decoded;
        let callback;
        beforeEach(() => {
            callback = jest.fn();
            decoded = {
                email: 'example@gmail.com',
                app_metadata: {
                    licenseCount: 2,
                    licenseTotal: 5
                }
            };
        });

        it('should reject if the app_meta data is empty', () => {
            decoded = dissoc('app_metadata', decoded);
            validateUser(decoded, null, callback);

            expect(callback).toHaveBeenCalled();
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(
                null,
                false
            );
        });

        it('should reject if the email is empty', () => {
            decoded = dissoc('email', decoded);
            validateUser(decoded, null, callback);

            expect(callback).toHaveBeenCalled();
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(
                null,
                false
            );
        });

        it('should reject if there is no licenseCount', () => {
            decoded = Object.assign({}, decoded, {
                app_metadata: {
                    licenseTotal: 0
                }
            });
            validateUser(decoded, null, callback);

            expect(callback).toHaveBeenCalled();
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(
                null,
                false
            );
        });

        it('should reject if there is no licenseTotal', () => {
            decoded = Object.assign({}, decoded, {
                app_metadata: {
                    licenseCount: 0
                }
            });
            validateUser(decoded, null, callback);

            expect(callback).toHaveBeenCalled();
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(
                null,
                false
            );
        });

        it('should allow if all fields are available', () => {
            validateUser(decoded, null, callback);

            expect(callback).toHaveBeenCalled();
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(
                null,
                true
            );
        });
    });

    describe('creating a server strategy', () => {
        let server;
        let hapiJwt2Key;
        beforeEach(() => {
            server = {
                auth: {
                    strategy: jest.fn()
                }
            };

            hapiJwt2Key = jest.fn(() => 'test');

            process.env.JWTKEY_JWKS_URI = 'test_jwks';
            process.env.VERIFY_OPTIONS_ISSUER = 'options_issue';
            process.env.VERIFY_OPTIONS_AUDIENCE = 'verify_audience';
        });

        it('should return a auth server strategy', () => {
            createStrategy(server, hapiJwt2Key);
            const strategy = server.auth.strategy.mock.calls[0];
            const jwtKey = hapiJwt2Key.mock.calls[0][0];

            expect(jwtKey).toMatchSnapshot();
            expect(strategy).toMatchSnapshot();
        });
    });
});
