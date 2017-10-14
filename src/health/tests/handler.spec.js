import { healthStatus, createDependencyHandler } from '../health.handler';

describe('health check handler', () => {
    let request;
    let reply;

    beforeEach(() => {
        request = {
            log: jest.fn()
        };
        reply = jest.fn();
    });

    describe('server status', () => {
        it('should reply status ok', () => {
            healthStatus(request, reply);
            expect(reply).toHaveBeenCalled();
            expect(reply).toHaveBeenCalledTimes(1);
            expect(reply).toHaveBeenCalledWith({
                status: 'OK'
            });
        });
    });

    describe('dependency status', () => {
        let connection;
        let logger;

        beforeEach(() => {
            connection = {
                authentication: jest.fn(() => Promise.resolve())
            };
            logger = {
                error: jest.fn()
            };
        });

        it('should reply with the up status of dependencies', async () => {
            const dependencyHandler = createDependencyHandler(connection, logger);
            await dependencyHandler(request, reply);

            expect(reply).toHaveBeenCalled();
            expect(reply).toHaveBeenCalledTimes(1);

            const response = reply.mock.calls[0][0];
            expect(response).toHaveLength(1);
        });

        it('should log that the dependency is down if down', async () => {
            connection = {
                authentication: jest.fn(() => Promise.reject())
            };

            const dependencyHandler = createDependencyHandler(connection, logger);
            await dependencyHandler(request, reply);

            expect(reply).toHaveBeenCalled();
            expect(reply).toHaveBeenCalledTimes(1);

            const response = reply.mock.calls[0][0];
            expect(response).toHaveLength(1);

            expect(request.log).toHaveBeenCalled();
            expect(request.log).toHaveBeenCalledTimes(1);
        });
    });
});
