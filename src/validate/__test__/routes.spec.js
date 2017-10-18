import createValidateRoutes from '../validate.routes';

describe('license routes', () => {
    it('should create license routes', () => {
        const validationRoutes = createValidateRoutes();
        expect(validationRoutes).toMatchSnapshot();
    });
});
