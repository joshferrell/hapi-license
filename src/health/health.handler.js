import Boom from 'boom';
import { createCheckDatabase } from './health.service';

export const healthStatus = (request, reply) =>
    reply({ status: 'OK' });

export const createDependencyHandler = (localConnection, logger) =>
(request, reply) => {
    const checkPostgres = createCheckDatabase('postgres', localConnection, logger);
    return Promise
        .all([
            checkPostgres()
        ])
        .then(dependencies => {
            dependencies
                .filter(({ up }) => up === false)
                .forEach(dependency => request.log('error', {
                    msg: `unable to access ${dependency.name}`,
                    dependency
                }));

            return reply(dependencies);
        })
        .catch((err) => {
            request.log('error', {
                err,
                msg: 'unable to check dependencies'
            });
            return reply(Boom.badImplementation());
        });
};
