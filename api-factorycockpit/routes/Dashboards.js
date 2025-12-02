import "../services/dashboardQueries.js";
import { Router } from "express";
import { createDashboard, getDashboardById, getDashboards, updateDashboard, deleteDashboard } from "../services/dashboardQueries.js";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

/**
 * @swagger
 *  components:
 *      schema:
 *          Dashboard:
 *              type: object
 *              properties:
 *                  dashboard_id:
 *                      type: string
 *                      format: uuid
 *                  title:
 *                      type: string
 *                  data:
 *                      type: string
 *                      format: binary
 *                  created_at:
 *                      type: string
 *                      format: date-time
 *                  created_by:
 *                      type: string
 *                      format: uuid
 */

/**
 * @swagger
 * /api/dashboards/{anchor}:
 *  get:
 *      tags:
 *          - Dashboards
 *      summary: Get dashboard by id
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *              description: The id of the dashboard
 *      responses:
 *          200:
 *              description: Return the dashboard
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#components/schema/Dashboard'
 *          404:
 *              description: Dashboard not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 */
router.get("/:id", (req, res) => {
    var dashboardId = req.params.id;
    const dashboard = getDashboardById.get(dashboardId)
    if (!dashboard) {
        return res.status(404).json({error: 'Dashboard does not exist'});
    }

    return res.status(200).json({
        dashboard_id: dashboard.dashboard_id,
        title: dashboard.title,
        data: JSON.parse(dashboard.data),
        created_at: new Date(dashboard.created_at).toISOString(),
        created_by: dashboard.created_at
    });
});

/**
 * @swagger
 * /api/dashboards/:
 *  get:
 *      tags:
 *          - Dashboards
 *      summary: Get list of dashboards
 *      responses:
 *          200:
 *              description: Return list of dashboards
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Dashboard'
 */
router.get("/", (req, res) => {
    const dashboards = getDashboards.all()
    return res.status(200).json(
        dashboards.map(({ dashboard_id, title, data, created_at, created_by }) => ({
            dashboard_id: dashboard_id,
            title: title,
            //data: JSON.parse(data),
            created_at: new Date(created_at).toISOString(),
            created_by: created_by
        }))
    );
});

/**
 * @swagger
 * /api/dashboards/:
 *  post:
 *      tags:
 *          - Dashboards
 *      summary: Create new empty dashboard
 *      responses:
 *          200:
 *              description: Return the new generated dashboard
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#components/schema/Dashboard'
 */
router.post("/", (req, res) => {

    const { title } = req.body;

    // Minimal input validation
    if (!title ) {
        return res.status(400).json({error: 'Missing required property'});
    }

    const newDashboard = createDashboard.get(uuidv4(), title, "[]", Date.now(), "user");

    return res.status(201).json({
        dashboard_id: newDashboard.dashboard_id,
        title: newDashboard.title,
        created_at: new Date(newDashboard.created_at).toISOString(),
        created_by: newDashboard.created_by
    });
});

/**
 * @swagger
 * /api/dashboards/{anchor}:
 *  patch:
 *      tags:
 *          - Dashboards
 *      summary: Update the widgets content of the dashboard
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *              description: The id of the dashboard
 *      responses:
 *          200:
 *              description: Return the dashboard updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#components/schema/Dashboard'
 */
router.patch("/:id", (req, res) => {

    var dashboardId = req.params.id;
    const { data } = req.body;

    // Minimal input validation
    if (!data) {
        return res.status(400).json({error: 'Missing required property'});
    }

    const updatedDashboard = updateDashboard.get(data, dashboardId);

    return res.status(201).json({
        dashboard_id: updatedDashboard.dashboard_id,
        title: updatedDashboard.title,
        data: JSON.parse(updatedDashboard.data),
        created_at: new Date(updatedDashboard.created_at).toISOString(),
        created_by: updatedDashboard.created_by
    });

});

/**
 * @swagger
 * /api/dashboards/{anchor}:
 *  delete:
 *      tags:
 *          - Dashboards
 *      summary: Delete the dashboard
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *              description: The id of the dashboard
 *      responses:
 *          200:
 *              description: Dashboard deleted with success
 */
router.delete("/:id", (req, res) => {

    var dashboardId = req.params.id;
    deleteDashboard.get(dashboardId);
    return res.status(200);

});

export default router