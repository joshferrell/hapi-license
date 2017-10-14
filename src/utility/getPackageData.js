import { pipe, split, map, join } from 'ramda';

require('pkginfo')(module, 'version', 'author', 'name', 'description');

export const formatAppName = pipe(
    split('-'),
    map(string => `${string.charAt(0).toUpperCase() + string.substring(1)}`),
    join(' ')
);

export const packageData = {
    name: formatAppName(module.exports.name),
    version: module.exports.version,
    author: module.exports.author,
    description: module.exports.description
};
