import Sequelize from 'sequelize';

const createLicenseModel = connection => connection.define('license', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4()
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    productId: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    computerId: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    computerUsername: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    computerOS: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [['Windows', 'MacOS', 'Linux']]
        }
    },
    computerName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    license: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

export default createLicenseModel;
