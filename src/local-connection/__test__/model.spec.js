import createLicenseModel from '../license.model';

describe('local connection models', () => {
    let connection;

    beforeEach(() => {
        connection = {
            define: jest.fn((table, columns) => columns)
        };
    });

    it('should create a license model', () => {
        const licenseModel = createLicenseModel(connection);
        expect(connection.define).toHaveBeenCalled();
        expect(connection.define).toHaveBeenCalledTimes(1);
        expect(licenseModel).toMatchSnapshot();
    });
});
