import database from './database.js';

const createUser = database.prepare(`
    INSERT INTO users (user_id, username, password, created_at)
    VALUES (?, ?, ?, ?)
    RETURNING user_id, username, created_at`
);

const getUserByUsername = database.prepare(`
    SELECT * FROM users WHERE username = ?`
);

const getUserById = database.prepare(`
    SELECT * FROM users WHERE user_id = ?`
);

const getUsers = database.prepare(`
    SELECT * FROM users`
);

export {
    createUser,
    getUserByUsername,
    getUserById,
    getUsers
};