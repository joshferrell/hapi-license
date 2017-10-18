import createManifest from './manifest';

describe('server manifest', () => {
    const serverInfo = {
        host: 'localhost',
        scheme: 'http'
    };

    it('should create a server manifest for local environments', () => {
        const manifest = createManifest('local', serverInfo, 'test');
        expect(manifest).toMatchSnapshot();
    });

    it('should create a server manifest for dev environment', () => {
        const manifest = createManifest('development', serverInfo, 'test');
        expect(manifest).toMatchSnapshot();
    });

    it('should create a server manifest for production', () => {
        const manifest = createManifest('production', serverInfo, 'test');
        expect(manifest).toMatchSnapshot();
    });
});
