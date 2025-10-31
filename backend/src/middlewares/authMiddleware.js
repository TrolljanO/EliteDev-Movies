import auth from '../lib/auth.js';
import db from '../lib/db.js';

const requireAuth = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.replace('Bearer ', '');

        if (!token && req.cookies?.['better-auth.session_token']) {
            token = req.cookies['better-auth.session_token'];
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticação não fornecido'
            });
        }

        const sessionId = token.split('.')[0];

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        const session = await db
            .selectFrom('session')
            .selectAll()
            .where('token', '=', sessionId)
            .where('expiresAt', '>', new Date())
            .executeTakeFirst();

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Sessão inválida ou expirada'
            });
        }

        const user = await db
        .selectFrom('user')
        .selectAll()
        .where('id', '=', session.userId)
        .executeTakeFirst();

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        req.user = user;
        req.session = session;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Erro ao verificar autenticação',
            details: error.message
        });
    }
};

export { requireAuth };