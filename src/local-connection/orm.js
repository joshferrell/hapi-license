
export const createConnection = (Sequelize, log) => new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST,
        dialect: 'postgres',
        operatorsAliases: Sequelize.Op,
        logger: msg => log.trace(msg)
    }
);

export default createConnection;
