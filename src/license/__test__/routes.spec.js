import createLicenseRoutes from '../license.routes';

describe('license routes', () => {
    it('should create license routes', () => {
        const licenseRoutes = createLicenseRoutes();
        expect(licenseRoutes).toMatchSnapshot();
    });
});
