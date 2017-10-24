import glue from 'glue';
import bunyan from 'bunyan';
import dotenv from 'dotenv-safe';
import Sequelize from 'sequelize';
import { hapiJwt2Key } from 'jwks-rsa';
import createManifest from './manifest';
import { createLogger, createStrategy } from './utility';
import {
    createLocalConnection,
    createLicenseModel
} from './local-connection';

import createValidateRoutes from './validate';
import createHealthRoutes from './health';
import createLicenseRoutes from './license';

dotenv.load();

const serverInfo = {
    host: process.env.SERVER_URL,
    scheme: process.env.SERVER_SCHEME
};

const log = createLogger(bunyan);
const manifest = createManifest(process.env.NODE_ENV, serverInfo, log);

const connection = createLocalConnection(Sequelize, log);
const LicenseModel = createLicenseModel(connection);

const healthRoutes = createHealthRoutes(connection, log);
const licenseRoutes = createLicenseRoutes(LicenseModel);
const validationRoutes = createValidateRoutes(LicenseModel, 'shhh');

const startServer = (server) => {
    createStrategy(server, hapiJwt2Key);
    server.route(healthRoutes);
    server.route(licenseRoutes);
    server.route(validationRoutes);
    server.start();
    server.log('info', `Server running at ${server.info.uri}`);
};

const failServer = err => log.error(err, 'unable to start server');

LicenseModel.sync(({ force: true }))
    .then(() => glue.compose(manifest))
    .then(startServer)
    .catch(failServer);
