const auth = require('../lib/auth');

const requireAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replacer('Bearer ', '') ||
            req.cookies?.['better-auth.session_token'];
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Sessão inválida ou expirada'
            });
        }
        req.user = session.user;
        req.session = session.session;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Erro ao verificar autenticação',
            details: error.message
        });
    }
};

module.exports = { requireAuth };