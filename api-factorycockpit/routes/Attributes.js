const express = require("express");
const router = express.Router();
const fetch = require('node-fetch').default;
const auth = require('../services/authentication');

/**
 * @swagger
 * /api/attributes/{anchor}:
 *  get:
 *      tags:
 *          - Attributes
 *      summary: Get the properties and the last value of the attribute
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *              description: The anchor id of the attribute
 *      responses:
 *          200:
 *              description: Return the attribute properties and last value recorded
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              $anchor:
 *                                  type: string
 *                                  description: Attribute ID
 *                              $name:
 *                                  type: string
 *                                  description: Attribute name
 *                              $abstraction:
 *                                  type: string
 *                              $concept:
 *                                  type: string
 *                              $displayname:
 *                                  type: object
 *                                  properties:
 *                                      xx-XX:
 *                                          type: string
 *                              $datatype:
 *                                  type: string
 *                              $unit:
 *                                  type: string
 *                                  description: UOM of the attribute
 *                              $value:
 *                                  oneOf:
 *                                      - type: number
 *                                      - type: string
 *                                  description: Last value recorded in this attribute
 */
router.get("/:id", async (req, res) => {

    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    var attributeId = req.params.id;

    const api_url = process.env.SERVER + "/DataService/anchor/v1/attributes/" + attributeId + "?details=true";
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
 *  components:
 *      schema:
 *          Datapoint:
 *              type: object
 *              properties:
 *                  timestamp:
 *                      type: string
 *                  value:
 *                      type: number
 *                  qualitycode:
 *                      type: number
 */

/**
 * @swagger
 *  components:
 *      schema:
 *          AttributeData:
 *              type: object
 *              properties:
 *                  variableId:
 *                      type: string
 *                  values:
 *                      type: array
 *                      items:
 *                          $ref: '#components/schema/Datapoint'
 */

/**
 * @swagger
 * /api/attributes/{anchor}/data:
 *  get:
 *      tags:
 *          - Attributes
 *      summary: Get the attribute data recorded
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *              description: The anchor id of the attribute
 *          -
 *              in: query
 *              name: from
 *              schema:
 *                  type: string
 *                  format: date-time
 *              required: true
 *          -
 *              in: query
 *              name: to
 *              schema:
 *                  type: string
 *                  format: date-time
 *              required: true
 *          -
 *              in: query
 *              name: limit
 *              schema:
 *                  type: string
 *                  format: integer
 *              required: false
 *          -
 *              in: query
 *              name: interpolation
 *              schema:
 *                  type: boolean
 *              required: false
 *          -
 *              in: query
 *              name: interval
 *              schema:
 *                  type: string
 *                  format: integer
 *              required: false
 *      responses:
 *          200:
 *              description: Return the attribute properties and last value recorded
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#components/schema/AttributeData'
 */
router.get("/:id/data", async (req, res) => {

    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    var attributeId = req.params.id;
    var from = req.query.from;
    var to = req.query.to;
    var limit = req.query.limit ? req.query.limit : 2000;
    var interpolated = req.query.interpolation? req.query.interpolation : false;
    var interval = req.query.interval? req.query.interval : 5000;

    const api_url = process.env.SERVER + "/DataService/Data/" + attributeId + "?from=" + from +"&to=" + to +"&limit=" + limit + "&order=Ascending&excludeBadQuality=true&interpolated=" + interpolated + "&interpolationInterval=" + interval;
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
 * /api/attributes/{anchor}/aggregated:
 *  get:
 *      tags:
 *          - Attributes
 *      summary: Get aggregated value
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *          -
 *              in: query
 *              name: from
 *              schema:
 *                  type: string
 *                  format: date-time
 *              required: true
 *          -
 *              in: query
 *              name: to
 *              schema:
 *                  type: string
 *                  format: date-time
 *              required: true
 *          -
 *              in: query
 *              name: aggregation
 *              schema:
 *                  type: string
 *              required: true
 */
router.get("/:id/aggregated", async (req, res) => {
    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    var attributeId = req.params.id;
    var from = req.query.from;
    var to = req.query.to;
    var aggregation = req.query.aggregation;

    const bodyData = {
        from : from,
        to : to,
        dataSources : [
            {
                id : attributeId,
                type: "Variable",
                aggregation: aggregation,
            }
        ]
    }

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify(bodyData),
    };

    const api_url = process.env.SERVER + "/DataService/Calculate/";
    const fetch_response = await fetch(api_url, requestOptions);

    if (fetch_response.status != 200) {
        res.sendStatus(503);
    } else {
        const json = await fetch_response.json();
        res.json(json);
    }

})

/**
 * @swagger
 * /api/attributes/{anchor}/trend:
 *  get:
 *      tags:
 *          - Attributes
 *      summary: Get trend values aggregated by time range
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *          -
 *              in: query
 *              name: from
 *              schema:
 *                  type: string
 *                  format: date-time
 *              required: true
 *          -
 *              in: query
 *              name: to
 *              schema:
 *                  type: string
 *                  format: date-time
 *              required: true
 *          -
 *              in: query
 *              name: timerange
 *              schema:
 *                  type: integer
 *              required: true
 *          -
 *              in: query
 *              name: aggregation
 *              schema:
 *                  type: string
 *              required: true
 */

router.get("/:id/trend", async (req, res) => {
    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    var attributeId = req.params.id;
    var from = req.query.from;
    var to = req.query.to;
    var timerange = req.query.timerange;
    var aggregation = req.query.aggregation;

    const bodyData = {
        from : from,
        to : to,
        calculationTimeRange: Number(timerange),
        dataSources : [
            {
                id : attributeId,
                type: "Variable",
                aggregation: aggregation,
            }
        ]
    }

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify(bodyData),
    };

    const api_url = process.env.SERVER + "/DataService/CalculateTrend/";
    const fetch_response = await fetch(api_url, requestOptions);

    if (fetch_response.status != 200) {
        res.sendStatus(503);
    } else {
        const json = await fetch_response.json();
        res.json(json);
    }
})

module.exports = router