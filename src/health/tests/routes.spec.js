import createHealthStatus from '../health.routes';

describe('health routes', () => {
    it('should create health routes for the server', () => {
        const healthRoutes = createHealthStatus();
        expect(healthRoutes).toMatchSnapshot();
    });
});
