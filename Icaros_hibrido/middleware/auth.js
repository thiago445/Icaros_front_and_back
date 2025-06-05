const jwt = require('jsonwebtoken');
const secretKey = '4635rfd2o3i5WDsf3241GFLAIh';

function authenticateToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) return res.status(403).json({ error: 'Token não fornecido' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });

        req.user = { id: decoded.id, flagtype: decoded.userType };
        next();
    });
}

module.exports = authenticateToken;
