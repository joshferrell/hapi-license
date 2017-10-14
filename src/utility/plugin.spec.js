import {
    createLogger,
    createGoodOptions,
    createSwaggerOptions,
    createDevPlugins,
    createLocalPlugins,
    createProductionPlugins
} from './plugin';

describe('server plugins', () => {
    it('should create a bunyan logger', () => {
        const bunyan = {
            createLogger: jest.fn(() => 'test')
        };

        expect(createLogger(bunyan)).toEqual('test');
        expect(bunyan.createLogger).toHaveBeenCalled();
        expect(bunyan.createLogger).toHaveBeenCalledTimes(1);

        const calls = bunyan.createLogger.mock.calls[0][0];
        expect(calls).toMatchSnapshot();
    });

    describe('plugin options', () => {
        it('should create good options', () => {
            expect(createGoodOptions('test')).toMatchSnapshot();
        });

        it('should create swagger options', () => {
            const serverInfo = {
                host: 'localhost:3000',
                scheme: 'http'
            };

            expect(createSwaggerOptions(serverInfo)).toMatchSnapshot();
        });
    });

    describe('plugin environments', () => {
        it('should create dev plugins', () => {
            const serverInfo = {
                host: 'localhost:3000',
                scheme: 'http'
            };

            expect(createDevPlugins(serverInfo)).toMatchSnapshot();
        });

        it('should create local plugins', () => {
            expect(createLocalPlugins()).toMatchSnapshot();
        });

        it('should create production plugins', () => {
            const logger = 'test';
            expect(createProductionPlugins(logger)).toMatchSnapshot();
        });
    });
});
