import { formatAppName, packageData } from './getPackageData';

describe('get package data', () => {
    it('should be able to format application name', () => {
        const name = 'test-name';
        expect(formatAppName(name)).toEqual('Test Name');
    });

    it('should return package json information from the package file', () => {
        expect(packageData).toMatchSnapshot();
    });
});
