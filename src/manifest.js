import {
    createLocalPlugins,
    createDevPlugins,
    createProductionPlugins
} from './utility';


const createManifest = (environment, serverInfo, logger) => {
    const localPlugins = environment === 'local' ? createLocalPlugins() : null;
    const developmentPlugins = (environment === 'development' || environment === 'development') ? createDevPlugins(serverInfo) : null;
    const productionPlugins = environment === 'production' ? createProductionPlugins(logger) : null;

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
            ...localPlugins,
            ...developmentPlugins,
            ...productionPlugins
        ]
    });
};

export default createManifest;
