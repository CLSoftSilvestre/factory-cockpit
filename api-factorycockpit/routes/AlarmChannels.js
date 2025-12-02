const express = require("express");
const router = express.Router();
const fetch = require('node-fetch').default;
const auth = require('../services/authentication');

/**
 * @swagger
 * /api/alarmchannels/count:
 *  get:
 *      tags:
 *          - Alarm Channels
 *      summary: Get the number of alarm channels
 *      responses:
 *          200:
 *              description: Return the number of alarm channels in the system
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              count:
 *                                  type: number                         
 */
router.get("/count", async (req, res) => {

    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const api_url = process.env.SERVER + "/DataService/AlarmChannels/Count";
    const fetch_response = await fetch(api_url, requestOptions);

    if (fetch_response.status != 200) {
        res.sendStatus(503);
    } else {
        const json = await fetch_response.json();
        res.json(json);
    }

});

module.exports = router