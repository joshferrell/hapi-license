import moment from 'moment';

export const setTime = (startTime = 0) => moment().format('x') - startTime;

export const createCheckDatabase = (name, connection, log) => () => {
    const startTime = setTime();

    return connection
        .authenticate()
        .then(() => {
            const duration = setTime(startTime);
            return {
                name,
                up: true,
                msg: `${name} is up. time to query ${duration}`,
                duration
            };
        })
        .catch((err) => {
            const duration = setTime(startTime);
            log.error(err, `unable to ping ${name}`);

            return {
                name,
                up: false,
                msg: `${name} is down. time to error ${duration}`,
                duration
            };
        });
};
