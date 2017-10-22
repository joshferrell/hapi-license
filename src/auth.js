import { where, isEmpty } from 'ramda';

export const validateUser = (decoded, request, callback) => {
    let valid = where({
        email: !isEmpty,
        app_metadata: !isEmpty
    })(decoded);

    if (!valid) return callback(null, false);

    valid = where({
        licenseCount: !isEmpty,
        licenseTotal: !isEmpty
    })(decoded.app_metadata);

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
