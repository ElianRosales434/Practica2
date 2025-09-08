import users from '../databases/users.js';

const userController = {
    create: (userData) => {
        const { username, email, password } = userData;

        const existingUserByEmail = users.find(user => user.email === email);
        if (existingUserByEmail) {
            throw new Error('El email ya está registrado');
        }

        const existingUserByUsername = users.find(user => user.username === username);
        if (existingUserByUsername) {
            throw new Error('El username ya está registrado');
        }

        if (!email.includes('@') || !email.includes('.')) {
            throw new Error('Formato de email inválido');
        }

        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            username,
            email,
            password
        };

        users.push(newUser);

        return newUser;
    },

    authenticate: (identifier, password) => {
        const user = users.find(user => 
            user.email === identifier || user.username === identifier
        );

        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        if (user.password !== password) {
            throw new Error('Credenciales inválidas');
        }

        return user;
    },

    findByEmail: (email) => {
        return users.find(user => user.email === email);
    },

    findById: (id) => {
        return users.find(user => user.id === id);
    },

    findByUsername: (username) => {
        return users.find(user => user.username === username);
    },

    updatePassword: (userId, newPassword) => {
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        if (newPassword.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        users[userIndex].password = newPassword;

        return users[userIndex];
    },

    getAll: () => {
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    },

    update: (userId, updateData) => {
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        const { username, email } = updateData;

        if (email && email !== users[userIndex].email) {
            const existingUserByEmail = users.find(user => user.email === email && user.id !== userId);
            if (existingUserByEmail) {
                throw new Error('El email ya está registrado');
            }

            if (!email.includes('@') || !email.includes('.')) {
                throw new Error('Formato de email inválido');
            }
        }

        if (username && username !== users[userIndex].username) {
            const existingUserByUsername = users.find(user => user.username === username && user.id !== userId);
            if (existingUserByUsername) {
                throw new Error('El username ya está registrado');
            }
        }

        if (username) users[userIndex].username = username;
        if (email) users[userIndex].email = email;

        return users[userIndex];
    },

    delete: (userId) => {
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        const deletedUser = users.splice(userIndex, 1)[0];
        const { password, ...userWithoutPassword } = deletedUser;
        return userWithoutPassword;
    }
};

export default userController;