

const key1 = require('crypto').randomBytes(32).toString('hex');
const key2 = require('crypto').randomBytes(32).toString('hex');

console.table({key1,key2})