import userController from './userController.js';
import tokenController from './tokenController.js';
import { validateEmail } from '../utils/validators.js';

const loginController = {
    // Registro de usuario
    register: (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Validar datos requeridos
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username, email y password son requeridos'
                });
            }

            // Crear usuario
            const newUser = userController.create({ username, email, password });

            // Respuesta sin contraseña
            const { password: _, ...userResponse } = newUser;

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                user: userResponse
            });

        } catch (error) {
            console.error('Error en registro:', error);
            
            // Manejar errores de validación
            if (error.message.includes('email') || error.message.includes('username') || error.message.includes('contraseña')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Login de usuario
    login: (req, res) => {
        try {
            const { identifier, password } = req.body;

            // Validar datos requeridos
            if (!identifier || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email/username y password son requeridos'
                });
            }

            // Autenticar usuario
            const user = userController.authenticate(identifier, password);

            // Respuesta exitosa sin contraseña
            const { password: _, ...userResponse } = user;

            res.json({
                success: true,
                message: 'Login exitoso',
                user: userResponse
            });

        } catch (error) {
            console.error('Error en login:', error);
            
            if (error.message === 'Credenciales inválidas') {
                return res.status(401).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Solicitud de recuperación de contraseña
    forgotPassword: (req, res) => {
        try {
            const { email } = req.body;

            // Validar email requerido
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email es requerido'
                });
            }

            // Validar formato de email
            if (!validateEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Formato de email inválido'
                });
            }

            // Buscar usuario
            const user = userController.findByEmail(email);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró una cuenta con ese email'
                });
            }

            // Crear token de recuperación
            const resetTokenData = tokenController.create(user.id);

            // Simular envío de correo
            const resetLink = `https://midominio.com/reset-password?token=${resetTokenData.token}`;

            res.json({
                success: true,
                message: 'Se ha enviado un enlace de recuperación a tu correo',
                resetLink: resetLink, // Solo para pruebas con Postman
                instructions: `Para probar, haz un POST a /api/auth/reset-password con el token: ${resetTokenData.token} y el body: {"password":"nuevaContraseña"}`
            });

        } catch (error) {
            console.error('Error en forgot password:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    // Resetear contraseña
    resetPassword: (req, res) => {
        try {
            const { token } = req.query;
            const { password } = req.body;

            // Validar token y contraseña
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token es requerido'
                });
            }

            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: 'Password es requerido'
                });
            }

            // Validar token
            const resetToken = tokenController.validate(token);

            // Actualizar contraseña del usuario
            userController.updatePassword(resetToken.userId, password);

            // Marcar token como usado
            tokenController.markAsUsed(resetToken.id);

            res.json({
                success: true,
                message: 'Contraseña actualizada exitosamente'
            });

        } catch (error) {
            console.error('Error en reset password:', error);
            
            if (error.message.includes('Token') || error.message.includes('token') || error.message.includes('contraseña')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
};

export default loginController;