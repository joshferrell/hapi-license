import Sequelize from 'sequelize';
import boom from 'boom';
import { dissoc, pipe } from 'ramda';
import { createLicenseModel } from '../../local-connection';
import {
    createFetchLicenses,
    createDeleteLicense,
    createNewLicense,
    createFetchLicense,
    createUpdateLicense
} from '../license.handler';

describe('license handlers', () => {
    let LicenseModel;
    let request;
    let reply;

    const LicenseModelBad = {
        create: () => Promise.reject(new Error('bad to the bone')),
        findAll: () => Promise.reject(new Error('bad to the bone')),
        destroy: () => Promise.reject(new Error('bad to the bone')),
        find: () => Promise.reject(new Error('bad to the bone'))
    };

    const simpleLicense = {
        id: 'c797c6bc-ef64-4203-9956-a3a90c0c0927',
        email: 'example@gmail.com',
        productId: 'simple-product',
        computerId: 'unique-machine-name',
        computerUsername: 'paul',
        computerOS: 'Windows',
        computerName: 'paul\'s laptop',
        expiresAt: '2099-01-01',
        license: 'hi I\'m paul',
        createdAt: '2017-01-01'
    };

    beforeAll(() => {
        process.env.SERVER_URL = 'localhost:3000';
        process.env.SERVER_SCHEME = 'http';
        const connection = new Sequelize('database', 'username', 'password', {
            dialect: 'sqlite'
        });

        LicenseModel = createLicenseModel(connection);
    });

    beforeEach(async () => {
        await LicenseModel.sync({ force: true });
        request = {
            log: jest.fn(),
            auth: {
                credentials: {
                    email: 'example@gmail.com',
                    app_metadata: {
                        licenseCount: 1,
                        licenseTotal: 5
                    }
                }
            }
        };
        reply = jest.fn();
    });

    describe('fetching licenses', () => {
        beforeEach(() => LicenseModel.create(simpleLicense));

        it('should return an array of licenses with an id url', async () => {
            const fetchLicenses = createFetchLicenses(LicenseModel);
            await fetchLicenses(request, reply);
            expect(reply).toHaveBeenCalled();
            expect(reply).toHaveBeenCalledTimes(1);

            const licenses = reply.mock.calls[0][0]
                .licenses
                .map(pipe(
                    dissoc('updatedAt'),
                    dissoc('createdAt')
                ));
            const { meta } = reply.mock.calls[0][0];

            expect(licenses).toHaveLength(1);
            expect(licenses).toMatchSnapshot();
            expect(meta.licenseCount).toBe(1);
            expect(meta.licenseTotal).toBe(5);
        });

        it('should log and reply error if fatal error', async () => {
            const fetchLicenses = createFetchLicenses(LicenseModelBad);
            await fetchLicenses(request, reply);
            const errorLog = request.log.mock.calls[0];

            expect(reply).toHaveBeenCalled();
            expect(reply).toHaveBeenCalledTimes(1);
            expect(reply).toHaveBeenCalledWith(boom.badImplementation());

            expect(request.log).toHaveBeenCalled();
            expect(request.log).toHaveBeenCalledTimes(1);
            expect(errorLog[0]).toEqual('error');
            expect(errorLog[1]).toMatchSnapshot();
        });
    });

    describe.skip('creating license', () => {

    });

    describe('delete license', () => {
        beforeEach(() => {
            const { id } = simpleLicense;
            request.params = { id };
            return LicenseModel.create(simpleLicense);
        });

        it('should delete an existing license', async () => {
            const deleteLicense = createDeleteLicense(LicenseModel);
            await deleteLicense(request, reply);

            expect(reply).toHaveBeenCalled();
            expect(reply).toHaveBeenCalledTimes(1);
            expect(reply).toHaveBeenCalledWith({
                success: true
            });
        });

        it('should not remove a license if there is no access', async () => {
            const deleteLicense = createDeleteLicense(LicenseModel);
            request.auth.credentials.email = 'bad@superbad.io';

            await deleteLicense(request, reply);

            expect(reply).toHaveBeenCalled();
            expect(reply).toHaveBeenCalledTimes(1);
            expect(reply).toHaveBeenCalledWith(boom.badRequest('license does not exist'));
        });

        it('should log and reply 500 if error', async () => {
            const deleteLicense = createDeleteLicense(LicenseModelBad);
            await deleteLicense(request, reply);
            const errorLog = request.log.mock.calls[0][1];

            expect(reply).toHaveBeenCalled();
            expect(reply).toHaveBeenCalledTimes(1);
            expect(reply).toHaveBeenCalledWith(boom.badImplementation());

            expect(request.log).toHaveBeenCalled();
            expect(request.log).toHaveBeenCalledTimes(1);
            expect(request.log.mock.calls[0][0]).toEqual('error');
            expect(errorLog).toMatchSnapshot();
        });
    });

    describe.skip('fetch single license', () => {
        
    });

    describe.skip('update licenses', () => {

    });
});
