# Factorycockpit API

This API serves the project Factory Copckpit. It integrates with the API of the Edge devices.

## Run API

Run `node app.py` for a dev server.

### Run on development mode

Run `npm run devStart`


## Environmental variables

This node application uses environmental variables to run:
Create a .env file in thr root of the project with the following keys:

NODE_TLS_REJECT_UNAUTHORIZED = 0
NODE_ENV = development
PORT = 3000
SERVER = https://127.0.0.1
USER = XXXXXX
PASSWORD = XXXXX
