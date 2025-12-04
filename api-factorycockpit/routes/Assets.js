const express = require("express");
const router = express.Router();
const fetch = require('node-fetch').default;
const auth = require('../services/authentication');

/**
 * @swagger
 *  components:
 *      schema:
 *          Asset:
 *              type: object
 *              properties:
 *                  $anchor:
 *                      type: string
 *                  $name:
 *                      type: string
 *                  $displayname:
 *                      type: object
 *                      properties:
 *                          xx-XX:
 *                              type: string
 */

/**
 * @swagger
 * /api/assets/:
 *  get:
 *      tags:
 *          - Assets
 *      summary: Get the list of assets in the IED
 *      responses:
 *          200:
 *              description: Return the attribute properties and last value recorded
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Asset'
 */
router.get("/", async (req, res) => {

    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const api_url = process.env.SERVER + "/DataService/anchor/v1/assets?take=10000&offset=0&selectors=+$displayname,+$name,-$attributes";
    const fetch_response = await fetch(api_url, requestOptions);

    console.log(fetch_response);

    if (fetch_response.status != 200) {
        res.sendStatus(503);
    } else {
        const json = await fetch_response.json();
        res.json(json);
    }

});

/**
 * @swagger
 * /api/assets/root:
 *  get:
 *      tags:
 *          - Assets
 *      summary: Get the root asset in the IED
 *      responses:
 *          200:
 *              description: Return the asset properties
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              $anchor:
 *                                  type: string
 *                              $type:
 *                                  type: string
 *                              $name:
 *                                  type: string
 *                              $concept:
 *                                  type: string                            
 */
router.get("/root", async (req, res) => {
    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const api_url = process.env.SERVER + "/DataService/anchor-ex/v1/assets/root";
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
 * /api/assets/{anchor}:
 *  get:
 *      tags:
 *          - Assets
 *      summary: Get one specific asset in the IED
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *              description: The anchor id of the asset
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
 *                              $displayname:
 *                                  type: object
 *                                  properties:
 *                                      xx-XX:
 *                                          type: string
 *                              $variable_1:
 *                                  type: string
 *                              $variable_2:
 *                                  type: string
 *                              $variable_3:
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

    var assetId = req.params.id;

    const api_url = process.env.SERVER + "/DataService/anchor/v1/assets/" + assetId + "?take=10000&offset=0&selectors=+$displayname,+$name,+$attributes";
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
 *          AssetTree:
 *              type: object
 *              properties:
 *                  $anchor:
 *                      type: string
 *                  $name:
 *                      type: string
 *                  $_entity:
 *                      type: object
 *                      properties:
 *                          $anchor:
 *                              type: string
 *                          $concept:
 *                              type: string
 *                  $_hasChildren:
 *                      type: boolean
 */

/**
 * @swagger
 * /api/assets/{anchor}/tree:
 *  get:
 *      tags:
 *          - Assets
 *      summary: Get the child assets
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *              description: The anchor id of the asset
 *      responses:
 *          200:
 *              description: Return the child assets
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/AssetTree'
 */
router.get("/:id/tree", async (req, res) => {
    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    var assetId = req.params.id;
    // https://127.0.0.1/iih-essentials/DataService/anchor-ex/v1/treeitems?_viewPoint=b435cd3c-9cfb-b3ee-6b3b-bab9cad784b1&offset=0&take=100&namefilter=%2A&_includeHasChildren=true&_includeHasAttributes=true&_includeNulls=true
    const api_url = process.env.SERVER + "/DataService/anchor-ex/v1/treeitems?_viewPoint=" + assetId + "&namefilter=%2A&_includeHasChildren=true&_includeHasAttributes=true&_includeNulls=true";
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
 *  components:
 *      schema:
 *          Attribute:
 *              type: object
 *              properties:
 *                  $anchor:
 *                      type: string
 *                  $name:
 *                      type: string
 *                  $abstraction:
 *                      type: string
 *                  $concept:
 *                      type: string
 *                  $displayname:
 *                      type: object
 *                      properties:
 *                          xx-XX:
 *                              type: string
 *                  $metadata:
 *                      type: object
 *                  $type:
 *                      type: string
 *                  $datatype:
 *                      type: string
 *                  $array:
 *                      type: boolean
 *                  $unit:
 *                      type: string
 *                  $value:
 *                      type: number
 */

/**
 * @swagger
 * /api/assets/{anchor}/attributes:
 *  get:
 *      tags:
 *          - Assets
 *      summary: Get the attributes of the asset
 *      parameters:
 *          -
 *              name: anchor
 *              in: path
 *              schema:
 *                  type: string
 *                  format: uuid
 *              required: true
 *              description: The anchor id of the asset
 *      responses:
 *          200:
 *              description: Return the child assets
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Attribute'
 */
router.get("/:id/attributes", async (req, res) => {
    await auth.getToken().then(async () => {})

    const myHeaders = new Headers();
    myHeaders.append("Cookie", "authToken=" + auth.authToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    var assetId = req.params.id;
    const api_url = process.env.SERVER + "/DataService/anchor/v1/assets/" + assetId + "/attributes";
    const fetch_response = await fetch(api_url, requestOptions);

    if (fetch_response.status != 200) {
        res.sendStatus(503);
    } else {
        const json = await fetch_response.json();
        res.json(json);
    }

})


module.exports = router