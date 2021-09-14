const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'jwtSecrethohoh'
module.exports.Decode = (token) => jwt.decode(token)
module.exports.Sign = ({_id, email}, secret, expTime) => jwt.sign({ email, userId: _id }, secret, { expiresIn: expTime });
module.exports.Verify = async (token) => {
    try {
        let isVerified = await jwt.verify(token, secret)
        return 'true'
    } catch (err) {
        if (err === 'TokenExpiredError: jwt expired') {
            return 'expired'
        }
        else if (err === 'JsonWebTokenError: invalid signature') {
            return 'invalid'
        }
    }
}
module.exports.Refresh = (token, expTime) => {
    let payload = jwt.decode(token)
    return jwt.sign({ username: payload.username, role: payload.role }, secret, { expiresIn: expTime });
}
