import glue from 'glue';
import bunyan from 'bunyan';
import dotenv from 'dotenv-safe';
import createManifest from './manifest';
import { createLogger } from './utility';

import { createHealthRoutes } from './health';

dotenv.load();

const serverInfo = {
    host: process.env.SERVER_URL,
    scheme: process.env.SCHEME
};

const log = createLogger(bunyan);
const manifest = createManifest(
    process.env.NODE_ENV, serverInfo, log
);

const startServer = (server) => {
    server.start();
    server.log('info', `Server running at ${server.info.uri}`);
};

const failServer = err => log.error(err, 'unable to start server');

glue.compose(manifest)
    .then(startServer, failServer);
