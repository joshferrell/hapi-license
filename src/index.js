import glue from 'glue';
import bunyan from 'bunyan';
import dotenv from 'dotenv-safe';
import Sequelize from 'sequelize';
import createManifest from './manifest';
import { createLogger } from './utility';
import createConnection from './orm';

import createHealthRoutes from './health';

dotenv.load();

const serverInfo = {
    host: process.env.SERVER_URL,
    scheme: process.env.SCHEME || 'http'
};

const log = createLogger(bunyan);
const connection = createConnection(Sequelize, log);
const manifest = createManifest(
    process.env.NODE_ENV, serverInfo, log
);

const healthRoutes = createHealthRoutes(connection, log);

const startServer = (server) => {
    server.route(healthRoutes);
    server.start();
    server.log('info', `Server running at ${server.info.uri}`);
};

const failServer = err => log.error(err, 'unable to start server');

glue.compose(manifest)
    .then(startServer, failServer);
