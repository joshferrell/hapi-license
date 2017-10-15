import Sequelize from 'sequelize';

const createLicenseModel = connection => connection.define('license', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4()
    },
    accountId: Sequelize.STRING,
    productId: Sequelize.STRING,
    lastPaidDate: Sequelize.DATE,
    macAddress: Sequelize.STRING,
    cpuIdentity: Sequelize.STRING,
    license: Sequelize.TEXT
});

export default createLicenseModel;
