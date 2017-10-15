import joi from 'joi';

const licenseFormat = joi.object({
    id: joi.string().uuid(['uuidv4']).required()
        .description('license id')
        .example('1dfc0c66-bcc0-4c02-aa0a-f633766f2dc5'),
    accountId: joi.string().required()
        .description('account user id')
        .example('1234'),
    productId: joi.string().required()
        .description('product id')
        .example('1bccad9a-10e5-41bb-9032-5f3a0e47ce9f'),
    lastPaidDate: joi.date().required()
        .description('last date that payment was made')
        .example('2017-01-01'),
    macAddress: joi.string().required()
        .description('computer mac address of license')
        .example('00:3e:e1:c4:5d:df'),
    cpuIdentity: joi.string().required()
        .description('computer cpu id of license id')
        .example('1234'),
    license: joi.string().required()
        .description('user license text to be imported into application'),
    createdAt: joi.date().required()
        .description('time that license was created')
        .example('2017-01-01T00:00:00.000Z'),
    updatedAt: joi.date().required()
        .description('time that license was updated')
        .example('2017-01-01T00:00:00.000Z'),
    url: joi.string().uri().required()
        .description('url that license is accessible')
        .example('http://localhost:3000/license/1dfc0c66-bcc0-4c02-aa0a-f633766f2dc5')
});

export default licenseFormat;
