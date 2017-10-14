import {
    createLocalPlugins,
    createDevPlugins,
    createProductionPlugins
} from './utility';

const createManifest = (environment, serverInfo, logger) => {
    const localPlugins = ['local'].includes(environment) ? createLocalPlugins() : [];
    const developmentPlugins = ['development', 'local'].includes(environment) ? createDevPlugins(serverInfo) : [];
    const productionPlugins = createProductionPlugins(logger);

    return ({
        connections: [
            {
                port: 3000,
                labels: ['server'],
                router: {
                    stripTrailingSlash: true
                },
                routes: {
                    cors: true
                }
            }
        ],
        registrations: [
            ...productionPlugins,
            ...developmentPlugins,
            ...localPlugins
        ]
    });
};

export default createManifest;
