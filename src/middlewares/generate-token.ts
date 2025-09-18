import jwt from 'jsonwebtoken';

const payload = { id: 1 };
const secret = 'my_secret_key';

const token = jwt.sign(payload, secret);
console.log(`Generated token: ${token}`);