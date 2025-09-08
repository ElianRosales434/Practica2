import { v4 as uuidv4 } from 'uuid';
import tokens from '../databases/tokens.js';

const tokenController = {
    create: (userId, expirationMinutes = 15) => {
        const resetToken = uuidv4();
        const expirationTime = new Date(Date.now() + expirationMinutes * 60 * 1000);

        const newToken = {
            id: tokens.length > 0 ? Math.max(...tokens.map(t => t.id)) + 1 : 1,
            token: resetToken,
            userId: userId,
            expiresAt: expirationTime,
            used: false,
            type: 'password_reset'
        };

        tokens.push(newToken);
        return newToken;
    },

    validate: (tokenValue) => {
        const token = tokenController.findByToken(tokenValue);
        
        if (!token) {
            throw new Error('Token inválido');
        }

        if (token.used) {
            throw new Error('Este token ya ha sido utilizado');
        }

        if (new Date() > token.expiresAt) {
            throw new Error('El token ha expirado');
        }

        return token;
    },

    markAsUsed: (tokenId) => {
        const tokenIndex = tokens.findIndex(token => token.id === tokenId);
        if (tokenIndex !== -1) {
            tokens[tokenIndex].used = true;
            return tokens[tokenIndex];
        }
        throw new Error('Token no encontrado');
    },

    cleanExpired: () => {
        const now = new Date();
        const initialLength = tokens.length;
        
        for (let i = tokens.length - 1; i >= 0; i--) {
            if (tokens[i].expiresAt <= now) {
                tokens.splice(i, 1);
            }
        }
        
        return initialLength - tokens.length;
    },

    findByUserId: (userId) => {
        return tokens.filter(token => token.userId === userId);
    },

    findByToken: (tokenValue) => {
        return tokens.find(token => token.token === tokenValue);
    }
};

export default tokenController;