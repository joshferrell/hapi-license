import joi from 'joi';

export const computerFormat = {
    computerId: joi
        .string()
        .required()
        .description('unique identify for machine based off of computer UUID'),
    computerUsername: joi
        .string()
        .required()
        .description('username for computer that app is in use for')
        .example('Paul'),
    computerOS: joi
        .string()
        .valid(['Windows', 'MacOS', 'Linux'])
        .required()
        .description('operating system that machine is using')
        .example('MacOS'),
    computerName: joi
        .string()
        .required()
        .description('name that user has defined for their computer')
        .example('Paul\'s Macbook Pro')
};

export const licenseFormat = joi.object({
    id: joi.string().uuid(['uuidv4']).required()
        .description('license id')
        .example('1dfc0c66-bcc0-4c02-aa0a-f633766f2dc5'),
    accountId: joi.string().required()
        .description('account user id')
        .example('1234'),
    productId: joi.string().required()
        .description('product id')
        .example('1bccad9a-10e5-41bb-9032-5f3a0e47ce9f'),
    validUntil: joi.date().min('now').required()
        .description('date that license expires')
        .example('2999-01-01'),
    ...computerFormat,
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
