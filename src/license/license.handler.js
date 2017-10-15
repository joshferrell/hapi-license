import { pipe, map } from 'ramda';
import boom from 'boom';
import { mapUrl } from './license.service';

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
    const { productId, macAddress } = request.payload;
    const accountId = '1234';
    return LicenseModel
        .create({ accountId, productId, macAddress })
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
