import boom from 'boom';
import joi from 'joi';
import { format } from '../utility';

const createValidateRoutes = () => {
    const notImplemented = (request, reply) => reply(boom.notImplemented());

    return [
        {
            method: 'POST',
            path: '/validate',
            handler: notImplemented,
            config: {
                validate: {
                    payload: {
                        license: joi.string().required()
                            .description('A token to validate')
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
                            ...format.internalError,
                            ...format.notImplemented
                        }
                    }
                }
            }
        }
    ];
};

export default createValidateRoutes;
