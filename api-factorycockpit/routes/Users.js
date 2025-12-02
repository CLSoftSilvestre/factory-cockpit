import "../services/userQueries.js";
import { Router } from "express";
import { createUser, getUserById, getUserByUsername, getUsers } from "../services/userQueries.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const saltRounds = 10;

/**
 * @swagger
 *  components:
 *      schema:
 *          User:
 *              type: object
 *              properties:
 *                  user_id:
 *                      type: string
 *                      format: uuid
 *                  username:
 *                      type: string
 *                      format: email
 *                  created_at:
 *                      type: string
 *                      format: date-time
 */

/**
 * @swagger
 * /api/users/{anchor}:
 *  get:
 *      tags:
 *          - Users
 *      summary: Get user by id
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *              description: The id of the user
 *      responses:
 *          200:
 *              description: Return list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#components/schema/User'
 *          404:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 */
router.get("/:id", (req, res) => {
    var attributeId = req.params.id;
    const user = getUserById.get(attributeId)
    if (!user) {
        return res.status(404).json({error: 'User does not exist'});
    }

    return res.status(200).json({
            user_id: user.user_id,
            username: user.username,
            joined: new Date(user.created_at).toISOString()
        });
});

/**
 * @swagger
 * /api/users/:
 *  get:
 *      tags:
 *          - Users
 *      summary: Get list of users
 *      responses:
 *          200:
 *              description: Return list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/User'
 */
router.get("/", (req, res) => {
    const users = getUsers.all()
    return res.status(200).json(
        users.map(({ user_id, username, created_at }) => ({
            user_id: user_id,
            username: username,
            joined: new Date(created_at).toISOString()
        }))
    );
});

/**
 * @swagger
 * /api/users/:
 *  post:
 *      tags:
 *          - Users
 *      summary: Create new user
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: Return the user created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#components/schema/User'
 *          400:
 *              description: Missing required property
 *          409:
 *              description: Username already exists
 */
router.post("/", async (req, res) => {

    const { username, password } = req.body;

    // Minimal Input Validation
    if ( !username || !password) {
        return res.status(400).json({error: 'Missing required property'});
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if username already exists
    const recordedUser = getUserByUsername.get(username);

    if (recordedUser)
        return res.status(409).json({ error:"Username already exists"});

    const newUser = createUser.get(uuidv4(), username, hashedPassword, Date.now());

    return res.status(201).json({
        userId: newUser.user_id,
        username: newUser.username,
        joined: new Date(newUser.created_at).toISOString(),
    });

});

/**
 * @swagger
 * /api/users/authenticate:
 *  post:
 *      tags:
 *          - Users
 *      summary: Authenticate user
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: User autenticate with success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#components/schema/User'
 *          400:
 *              description: Missing required property
 *          401:
 *              description: Incorrect password
 *          404:
 *              description: User does not exist
 */
router.post("/authenticate", async (req, res) => {

    const { username, password } = req.body;

    // Minimal Input Validation
    if ( !username || !password) {
        return res.status(400).json({error: 'Missing required property'});
    }

    // Check if username exists
    const registredUser = getUserByUsername.get(username);

    if (!registredUser)
        return res.status(404).json({ error:"User does not exist"});

    // Check for password 
    const isCorrectPassword = await bcrypt.compare(
        password,
        registredUser.password
    );

    if (!isCorrectPassword) {
        return res.status(401).json({ error: 'Incorrect password'});
    }

    return res.status(200).json({
        userId: registredUser.user_id,
        username: registredUser.username,
        joined: new Date(registredUser.created_at).toISOString(),
    });

});


router.put("/", (req, res) => {
    res.send({data:"User updated"});
});

router.delete("/", (req, res) => {
    res.send({data:"User deleted"});
});

export default router

