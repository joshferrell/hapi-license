import {
    createLocalPlugins,
    createDevPlugins,
    createProductionPlugins
} from './utility';


const createManifest = (environment, serverInfo, logger) => {
    const localPlugins = ['local', 'production', 'development'].includes(environment) ? createLocalPlugins() : [];
    const developmentPlugins = ['production', 'development'].includes(environment) ? createDevPlugins(serverInfo) : [];
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
