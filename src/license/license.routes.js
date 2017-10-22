import joi from 'joi';
import { format } from '../utility';
import { licenseFormat, computerFormat } from './license.format';
import {
    createFetchLicenses,
    createNewLicense,
    createDeleteLicense,
    createFetchLicense,
    createUpdateLicense
} from './license.handler';

const createLicenseRoutes = (LicenseModel) => {
    const fetchLicenses = createFetchLicenses(LicenseModel);
    const newLicense = createNewLicense(LicenseModel);
    const deleteLicense = createDeleteLicense(LicenseModel);
    const fetchLicense = createFetchLicense(LicenseModel);
    const updateLicense = createUpdateLicense(LicenseModel);

    return [
        {
            method: 'POST',
            path: '/license',
            handler: newLicense,
            config: {
                auth: {
                    scope: 'write:license'
                },
                validate: {
                    payload: {
                        productId: joi.string().required()
                            .description('product id associated with license')
                            .example('1bccad9a-10e5-41bb-9032-5f3a0e47ce9f'),
                        validUntil: joi.date().min('now').required()
                            .description('date that the license expires')
                            .example('2999-01-01'),
                        computer: computerFormat
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
                auth: {
                    scope: 'read:license'
                },
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
                auth: {
                    scope: 'read:license'
                },
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
                auth: {
                    scope: 'write:license'
                },
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
        },
        {
            method: 'PATCH',
            path: '/license/{id}',
            handler: updateLicense,
            config: {
                auth: {
                    scope: 'write:license'
                },
                validate: {
                    params: {
                        id: joi.string().uuid(['uuidv4']).required()
                            .description('license id')
                            .example('1e589ff5-b19a-4642-a5b2-8db48c0aa1c4')
                    },
                    payload: joi.object({
                        validUntil: joi.date().min('now')
                            .description('date that license expires')
                            .example('2099-01-01'),
                        productId: joi.string()
                            .description('product that user has purchased used')
                            .example('1234')
                    }).or('validUntil', 'productId').required()
                },
                tags: ['api', 'License Management'],
                description: 'Update license expiration',
                notes: [
                    'valid until date set in case that license has been updated for expire time',
                    'product id set in case the user has updated their product of choice'
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
        }
    ];
};

export default createLicenseRoutes;
