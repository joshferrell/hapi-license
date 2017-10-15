import joi from 'joi';
import { format } from '../utility';
import licenseFormat from './license.format';
import {
    createFetchLicenses,
    createNewLicense,
    createDeleteLicense,
    createFetchLicense
} from './license.handler';

const createLicenseRoutes = (LicenseModel) => {
    const fetchLicenses = createFetchLicenses(LicenseModel);
    const newLicense = createNewLicense(LicenseModel);
    const deleteLicense = createDeleteLicense(LicenseModel);
    const fetchLicense = createFetchLicense(LicenseModel);

    return [
        {
            method: 'POST',
            path: '/license',
            handler: newLicense,
            config: {
                validate: {
                    payload: {
                        productId: joi.string().required()
                            .description('product id associated with license')
                            .example('1bccad9a-10e5-41bb-9032-5f3a0e47ce9f'),
                        lastPaidDate: joi.date()
                            .description('date that the last invoice was paid')
                            .example('2017-01-01'),
                        macAddress: joi.string().required()
                            .description('mac address of computer associated with license')
                            .example('00:3e:e1:c4:5d:df')
                    }
                },
                tags: ['api', 'License Management'],
                description: 'Create a new license for a user',
                notes: [
                    'Returns a license for a user and creates a new license in the database'
                ],
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            200: {
                                description: 'Creation successful',
                                schema: licenseFormat
                            },
                            ...format.badRequest,
                            ...format.unauthorized,
                            ...format.internalError,
                            ...format.notImplemented
                        }
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/license',
            handler: fetchLicenses,
            config: {
                tags: ['api', 'License Management'],
                description: 'Get all active licenses for a user',
                notes: [
                    'Returns all licenses for a user as well as how many licenses the user has available'
                ],
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            200: {
                                description: 'Fetch all licenses for user',
                                schema: joi.array().items(licenseFormat).required()
                            },
                            ...format.badRequest,
                            ...format.unauthorized,
                            ...format.internalError,
                            ...format.notImplemented
                        }
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/license/{id}',
            handler: fetchLicense,
            config: {
                validate: {
                    params: {
                        id: joi.string().uuid(['uuidv4']).required()
                            .description('license id')
                            .example('1e589ff5-b19a-4642-a5b2-8db48c0aa1c4')
                    }
                },
                tags: ['api', 'License Management'],
                description: 'Get a license by the uuid',
                notes: [
                    'Returns all of the information about a single license'
                ],
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            200: {
                                description: 'Fetch license',
                                schema: licenseFormat
                            },
                            ...format.badRequest,
                            ...format.unauthorized,
                            ...format.internalError,
                            ...format.notImplemented
                        }
                    }
                }
            }
        },
        {
            method: 'DELETE',
            path: '/license/{id}',
            handler: deleteLicense,
            config: {
                validate: {
                    params: {
                        id: joi.string().uuid(['uuidv4']).required()
                            .description('license id')
                            .example('1e589ff5-b19a-4642-a5b2-8db48c0aa1c4')
                    }
                },
                tags: ['api', 'License Management'],
                description: 'Delete a license by uuid',
                notes: [
                    'Deletes a license for a user allowing the user to allocate an additional license'
                ],
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            ...format.success,
                            ...format.badRequest,
                            ...format.unauthorized,
                            ...format.internalError,
                            ...format.notImplemented
                        }
                    }
                }
            }
        }
    ];
};

export default createLicenseRoutes;
