'use strict'
// 
//import expressCache from 'cache-express';

require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch').default;
const {setupLogging} = require("./logging");
const expressCache = require('cache-express')

// Swagger requiments
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Factory Cockpit API',
            description: 'This api connectes to Siemens Edge IED',
            version: '1.0.0'
        },
        servers: [
            {
                url: '/'
            }
        ]
    },
    apis: [
        './routes/Users.js',
        './routes/Dashboards.js',
        './routes/Resources.js',
        './routes/Attributes.js',
        './routes/Assets.js',
        './routes/AlarmChannels.js',
    ]
}

const app = express();

const swaggerSpec = swaggerJSDoc(options)

const port = Number(process.env.port) || 3000;

setupLogging(app);

app.use( express.json() );
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

const userRoute = require('./routes/Users').default;
const attributesRoute = require('./routes/Attributes');
const resourcesRoute = require('./routes/Resources');
const assetsRoute = require('./routes/Assets');
const alarmChannelsRoute = require('./routes/AlarmChannels');
const dashboardsRoute = require('./routes/Dashboards').default;

app.use('/api/users', userRoute)
app.use('/api/dashboards', dashboardsRoute)
app.use('/api/attributes', attributesRoute)
app.use('/api/ied/resources', resourcesRoute)
app.use('/api/assets', assetsRoute)
app.use('/api/alarmchannels', alarmChannelsRoute)

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, (error) => {
    if (!error){
        console.log(`Factory Cockpit API listening on port ${port}`);
    } else {
        console.log("Error occurred, server can't start ", error);
    }
    
});


