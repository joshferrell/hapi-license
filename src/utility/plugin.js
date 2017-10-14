import { stdSerializers } from 'bunyan';
import { packageData } from './index';

export const createLogger = bunyan =>
    bunyan.createLogger({
        name: packageData.name,
        serialziers: {
            err: stdSerializers.err
        },
        level: 'trace'
    });

export const createGoodOptions = (logger) => {
    const eventFilter = {
        request: '*', log: '*', response: '*', error: '*'
    };

    return ({
        includes: {
            request: ['headers', 'payload'],
            response: ['payload']
        },
        ops: {
            interval: 2160000
        },
        reporters: {
            bunyan: [
                {
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [eventFilter]
                },
                {
                    module: 'white-out',
                    args: [{
                        Authorization: 'censor'
                    }]
                },
                {
                    module: 'good-bunyan',
                    args: [
                        eventFilter,
                        {
                            logger,
                            formatters: {
                                err: stdSerializers.err
                            }
                        }
                    ]
                }
            ]
        }
    });
};

export const createSwaggerOptions = ({ host, scheme }) => ({
    host,
    info: {
        title: `${packageData.formatedName} Documentation`,
        description: packageData.description,
        verson: packageData.version,
        contact: {
            ...packageData.author
        }
    },
    securityDefinitions: {
        manageLicense: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    grouping: 'tags',
    schemes: [scheme]
});

// { host, schema }
export const createDevPlugins = (serverInfo) => {
    const swaggerOptions = createSwaggerOptions(serverInfo);
    return [
        {
            plugin: {
                register: 'hapi-swagger',
                options: swaggerOptions
            }
        }
    ];
};

export const createLocalPlugins = () => [
    {
        plugin: {
            register: 'tv',
            options: {
                endpoint: '/tv'
            }
        }
    }
];

export const createProductionPlugins = (logger) => {
    const goodOptions = createGoodOptions(logger);
    return [
        { plugin: 'inert' },
        { plugin: 'vision' },
        { plugin: 'hapi-auth-jwt2' },
        {
            plugin: {
                register: 'good',
                options: goodOptions
            }
        }
    ];
};
