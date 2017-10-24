import { pipe, map } from 'ramda';
import boom from 'boom';
import { mapUrl, createLicenseIssuer } from './license.service';

export const createFetchLicenses = LicenseModel => (request, reply) => {
    const {
        email,
        app_metadata: {
            licenseCount,
            licenseTotal
        }
    } = request.auth.credentials;

    return LicenseModel
        .findAll({
            where: { email },
            raw: true
        })
        .then(pipe(
            map(mapUrl),
            licenses => ({
                meta: { licenseCount, licenseTotal }, licenses
            }),
            reply
        ))
        .catch((err) => {
            request.log('error', {
                err,
                msg: 'unable to fetch licenses'
            });
            return reply(boom.badImplementation());
        });
};

export const createNewLicense = LicenseModel => (request, reply) => {
    const issueLicense = createLicenseIssuer();
    const { productId, expiresAt, computer } = request.payload;
    const {
        email,
        app_metadata: {
            licenseCount,
            licenseTotal
        }
    } = request.auth.credentials;

    if (licenseCount >= licenseTotal) {
        return reply(boom.unauthorized('request exceeds available license amount'));
    }

    return issueLicense({ ...request.payload, email })
        .then(license => LicenseModel.create({
            productId, expiresAt, ...computer, license, email
        }))
        .then(_ => _.get({ plain: true }))
        .then(pipe(
            mapUrl,
            license => ({
                meta: {
                    licenseCount: licenseCount + 1,
                    licenseTotal
                },
                license
            }),
            reply
        ))
        .catch((err) => {
            request.log('error', {
                err,
                msg: 'unable to create license'
            });
            return reply(boom.badImplementation());
        });
};

export const createDeleteLicense = LicenseModel => (request, reply) => {
    const { id } = request.params;
    const { email } = request.auth.credentials;

    return LicenseModel
        .destroy({
            where: { id, email }
        })
        .then(rowsAffected => (
            rowsAffected ?
                reply({ success: true }) :
                reply(boom.badRequest('license does not exist'))
        ))
        .catch((err) => {
            request.log('error', {
                err,
                msg: 'unable to delete license'
            });
            return reply(boom.badImplementation());
        });
};

export const createFetchLicense = LicenseModel => (request, reply) => {
    const { id } = request.params;
    const {
        email,
        app_metadata: {
            licenseCount,
            licenseTotal
        }
    } = request.auth.credentials;

    return LicenseModel
        .find({
            where: { email, id },
            raw: true
        })
        .then(license => (
            license ?
                pipe(
                    mapUrl,
                    x => ({
                        meta: { licenseCount, licenseTotal },
                        license: x
                    }),
                    reply
                )(license) :
                reply(boom.notFound())
        ))
        .catch((err) => {
            request.log('error', {
                err,
                msg: 'fetch inidividual license'
            });
            return reply(boom.badImplementation());
        });
};

export const createUpdateLicense = LicenseModel => (request, reply) => {
    const { id } = request.params;
    const { expiresAt, productId } = request.payload;
    const {
        email,
        app_metadata: {
            licenseCount,
            licenseTotal
        }
    } = request.auth.credentials;
    const issueLicense = createLicenseIssuer();

    return LicenseModel
        .findOne({ where: { email, id }, raw: true })
        .then((model) => {
            if (!model) return Promise.reject(Error('license does not exist'));

            const {
                computerId,
                computerUsername,
                computerOS,
                computerName
            } = model;

            const license = issueLicense({
                email,
                expiresAt: expiresAt || model.expiresAt,
                productId: productId || model.productId,
                computer: {
                    computerId,
                    computerUsername,
                    computerOS,
                    computerName
                }
            });

            return model.update({
                expiresAt: expiresAt || model.expiresAt,
                productId: productId || model.productId,
                license
            });
        })
        .then(model => model.get({ plain: true }))
        .then(license => reply({
            meta: {
                licenseCount, licenseTotal
            },
            license
        }))
        .catch((err) => {
            switch (err.message) {
            case 'license does not exist':
                request.log('debug', `requested license ${id} does not exist for user ${email}`);
                return reply(boom.badRequest());
            default:
                request.log('error', {
                    err,
                    msg: 'fetch inidividual license'
                });
                return reply(boom.badImplementation());
            }
        });
};
