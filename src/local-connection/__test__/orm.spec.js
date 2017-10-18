import { createConnection } from '../orm';

describe('create local connection', () => {
    let sequelize;
    let log;

    beforeEach(() => {
        process.env.POSTGRES_DB = 'db_test';
        process.env.POSTGRES_USER = 'db_user';
        process.env.POSTGRES_PASSWORD = 'db_password';
        process.env.POSTGRES_HOST = 'db_localhost';
        sequelize = jest.fn((db, user, pass, options) => options);
        log = {
            trace: jest.fn()
        };
    });

    it('should create a sequelize connection', () => {
        const { logger } = createConnection(sequelize, log);
        const calls = sequelize.mock.calls[0];
        logger('something');

        expect(sequelize).toHaveBeenCalled();
        expect(sequelize).toHaveBeenCalledTimes(1);
        expect(calls).toMatchSnapshot();

        expect(log.trace).toHaveBeenCalled();
        expect(log.trace).toHaveBeenCalledTimes(1);
        expect(log.trace).toHaveBeenCalledWith('something');
    });
});
