import database from './database.js';

const createDashboard = database.prepare(`
    INSERT INTO dashboards (dashboard_id, title, description, data, keywords, created_at, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING dashboard_id, title, description, data, keywords, created_at, created_by`
);

const getDashboardById = database.prepare(`
    SELECT * FROM dashboards WHERE dashboard_id = ?`
);

const getDashboards = database.prepare(`
    SELECT * FROM dashboards ORDER BY title ASC`
);

const updateDashboard = database.prepare(`
    UPDATE dashboards SET data = ? WHERE dashboard_id = ?
    RETURNING dashboard_id, title, description, data, keywords, created_at, created_by`
);

const updateDashboardImage = database.prepare(`
    UPDATE dashboards SET image = ? WHERE dashboard_id = ?
    RETURNING dashboard_id, title, description, data, keywords, created_at, created_by`
);

const deleteDashboard = database.prepare(`
    DELETE FROM dashboards WHERE dashboard_id = ?`
);

export {
    createDashboard,
    getDashboardById,
    getDashboards,
    updateDashboard,
    updateDashboardImage,
    deleteDashboard
};