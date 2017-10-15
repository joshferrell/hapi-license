import { format } from '../utility';
import { healthStatus, createDependencyHandler } from './health.handler';

const createHealthStatus = (connection, logger) => {
    const healthDependency = createDependencyHandler(connection, logger);

    return ([
        {
            method: 'GET',
            path: '/healthCheck',
            handler: healthStatus,
            config: {
                auth: false,
                tags: ['api', 'Server Utilities'],
                description: 'Get up status of server',
                notes: [
                    'Returns success status if the server is online'
                ],
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            ...format.healthCheck
                        }
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/healthCheck/all',
            handler: healthDependency,
            config: {
                auth: false,
                tags: ['api', 'Server Utilities'],
                description: 'Get up status of server dependencies',
                notes: [
                    'Returns an array of each server dependency with up status and latency'
                ],
                plugins: {
                    'hapi-swagger': {
                        responses: {
                            ...format.checkDependency,
                            ...format.internalError
                        }
                    }
                }
            }
        }
    ]);
};

export default createHealthStatus;
