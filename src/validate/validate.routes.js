import joi from 'joi';
import { format } from '../utility';
import { createValidateLicense } from './validate.handler';

const createValidateRoutes = (LicenseModel, secret) => {
    const validateLicense = createValidateLicense(LicenseModel, secret);

    return [
        {
            method: 'POST',
            path: '/validate',
            handler: validateLicense,
            config: {
                // TODO create authentication strategy for license account Id
                // matches authorization account id
                validate: {
                    payload: {
                        license: joi.string().required()
                            .description('A token to validate'),
                        computerId: joi.string().required()
                            .description('computer unique identifier')
                    }
                },
                tags: ['api', 'License Validation'],
                description: 'Validate that a license is valid by id',
                notes: [
                    'Validates that a license is valid or active'
                ],
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            ...format.success,
                            ...format.badRequest,
                            ...format.unauthorized,
                            ...format.internalError
                        }
                    }
                }
            }
        }
    ];
};

export default createValidateRoutes;
