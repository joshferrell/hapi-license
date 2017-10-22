import boom from 'boom';

/* eslint-disable import/prefer-default-export */

export const createValidateLicense = (LicenseModel, validateLicense) => (request, reply) => {
    const { license, computerId } = request.payload;

    return LicenseModel
        .findOne({
            where: { license },
            raw: true
        })
        .then(model => (
            model ?
                validateLicense(license, computerId) :
                Promise.reject(new Error('license does not exist'))
        ))
        .then(() => reply({ success: true }))
        .catch((err) => {
            switch (err) {
            case 'computer id does not match license':
                return reply(boom.unauthorized());
            case 'license does not exist':
                return reply(boom.unauthorized());
            default:
                request.log('error', {
                    err,
                    msg: 'unable to validate license'
                });
                return reply(boom.badImplementation());
            }
        });
};
