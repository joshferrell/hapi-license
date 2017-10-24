import { allPass, path } from 'ramda';

export const validateUser = (decoded, request, callback) => {
    const valid = allPass([
        path(['email']),
        path(['app_metadata', 'licenseCount']),
        path(['app_metadata', 'licenseTotal'])
    ])(decoded);

    return callback(null, valid);
};

const createStrategy = (server, hapiJwt2Key) =>
    server.auth.strategy('jwt', 'jwt', 'required', {
        complete: true,
        key: hapiJwt2Key({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: process.env.JWTKEY_JWKS_URI
        }),
        verifyOptions: {
            audience: process.env.VERIFY_OPTIONS_AUDIENCE,
            issuer: process.env.VERIFY_OPTIONS_ISSUER,
            algorithms: ['RS256']
        },
        validateFunc: validateUser
    });

export default createStrategy;
