const express = require("express");
const router = express.Router();
const fetch = require('node-fetch').default;
const auth = require('../services/authentication');
const expressCache = require("cache-express");


/**
 * @swagger
 * /api/ied/resources:
 *  get:
 *      tags:
 *          - IED server
 *      summary: Get the resources status of the IED
 *      responses:
 *          200:
 *              description: Return the resources of the IED
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              cpu:
 *                                  type: object
 *                                  description: CPU information
 *                                  properties:
 *                                      usedPercentage:
 *                                          type: string
 *                                      coreCount:
 *                                          type: string
 *                                      modelName:
 *                                          type: string
 *                                      cpuArch:
 *                                          type: string
 *                              storage:
 *                                  type: object
 *                                  description: Storage information
 *                                  properties:
 *                                      total:
 *                                          type: string
 *                                      used:
 *                                          type: string
 *                                      free:
 *                                          type: string
 *                                      usedPercentage:
 *                                          type: string
 *                              memory:
 *                                  type: object
 *                                  description: Memory information
 *                                  properties:
 *                                      total:
 *                                          type: string
 *                                      used:
 *                                          type: string
 *                                      free:
 *                                          type: string
 *                                      usedPercentage:
 *                                          type: string
 *                                      peak:
 *                                          type: string
 *                                      average:
 *                                          type: string
 *                              upTime:
 *                                  type: string
 */
router.get("/", expressCache({timeOut: 5*60*1000}), async (req, res) => {

    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const api_url = process.env.SERVER + "/device/edge/api/v2/resources";
    const fetch_response = await fetch(api_url, requestOptions);

    if (fetch_response.status != 200) {
        res.sendStatus(503);
    } else {
        const json = await fetch_response.json();
        res.json(json);
    }

});

/**
 * @swagger
 * /api/ied/resources/hostname:
 *  get:
 *      tags:
 *          - IED server
 *      summary: Get the hostname of the IED
 *      responses:
 *          200:
 *              description: Return the hostname of the IED
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              hostname:
 *                                  type: string
 */
router.get("/hostname", expressCache({timeOut: 60*60*1000}), async(req, res) => {

    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const api_url = process.env.SERVER + "/device/edge/api/v2/hostname";
    const fetch_response = await fetch(api_url, requestOptions);

    if (fetch_response.status != 200) {
        res.sendStatus(503);
    } else {
        const json = await fetch_response.json();
        res.json(json);
    }

});

/**
 * @swagger
 * /api/ied/resources/dataservice/version:
 *  get:
 *      tags:
 *          - IED server
 *      summary: Get version of the DataService module
 *      responses:
 *          200:
 *              description: Return the version of the DataService
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              version:
 *                                  type: string
 *                              productVersion:
 *                                  type: string
 *                              gitVersion:
 *                                  type: string
 *                              build:
 *                                  type: string
 */
router.get("/dataservice/version", expressCache({timeOut: 60*60*1000}), async(req, res) => {
    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const api_url = process.env.SERVER + "/DataService/Service/Version";
    const fetch_response = await fetch(api_url, requestOptions);

    if (fetch_response.status != 200) {
        res.sendStatus(503);
    } else {
        const json = await fetch_response.json();
        res.json(json);
    }
})

module.exports = router