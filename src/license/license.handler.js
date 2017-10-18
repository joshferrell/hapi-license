import { pipe, map } from 'ramda';
import boom from 'boom';
import { mapUrl, createLicenseIssuer } from './license.service';

export const createFetchLicenses = LicenseModel => (request, reply) => {
    const accountId = '1234';
    return LicenseModel
        .findAll({
            where: { accountId },
            raw: true
        })
        .then(pipe(
            map(mapUrl),
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
    const { productId, validUntil, computer } = request.payload;
    const accountId = '1234';

    return issueLicense({ ...request.payload, accountId })
        .then(license => LicenseModel.create({
            productId, validUntil, ...computer, license, accountId
        }))
        .then(_ => _.get({ plain: true }))
        .then(pipe(
            mapUrl,
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
    const accountId = '1234';
    return LicenseModel
        .destroy({
            where: { id, accountId }
        })
        .then(() => reply({ success: true }))
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
    const accountId = '1234';
    return LicenseModel
        .find({
            where: { accountId, id },
            raw: true
        })
        .then(pipe(
            mapUrl,
            reply
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
    const { validUntil, productId } = request.payload;
    const accountId = '1234';
    const issueLicense = createLicenseIssuer();

    return LicenseModel
        .findOne({ where: { accountId, id }, raw: true })
        .then((model) => {
            if (!model) return Promise.reject(Error('license does not exist'));

            const {
                computerId,
                computerUsername,
                computerOS,
                computerName
            } = model;

            const license = issueLicense({
                accountId,
                validUntil: validUntil || model.validUntil,
                productId: productId || model.productId,
                computer: {
                    computerId,
                    computerUsername,
                    computerOS,
                    computerName
                }
            });

            return model.update({
                validUntil: validUntil || model.validUntil,
                productId: productId || model.productId,
                license
            });
        })
        .then(model => model.get({ plain: true }))
        .then(reply)
        .catch((err) => {
            switch (err.message) {
            case 'license does not exist':
                request.log('debug', `requested license ${id} does not exist for user ${accountId}`);
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
