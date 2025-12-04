// Edge API auth

class IedToken {

    static authToken = "";
    static expiresAt = 0;
    static refreshToken = "";

    constructor() {
    }

    static async getToken() {
        if (!IedToken.tokenValid()) {
            await IedToken.newToken().then(()=>{});
        }
        
        return IedToken.authToken;  
    }

    static async newToken() {
        // get new token
        const requestOptions = {
            method: "POST",
            redirect: "follow",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": process.env.USER,
                "password": process.env.PASSWORD  
            }),
        };

        // const api_url = process.env.SERVER + "/device/edge/api/v2/login/direct";
        // const fetch_response = await fetch(api_url, requestOptions);
        // const json = await fetch_response.json();

        console.log("New IED access token retrieved.");

        // IedToken.authToken = json['accessToken'];
        // IedToken.expiresAt = Number(json['expiresAt']);
        // IedToken.refreshToken = json['refreshToken'];
        IedToken.authToken = "asasbasbasbasab";
        IedToken.expiresAt = Number(Date.now()/100) + 3600;
        IedToken.refreshToken = "bahdausadnasduas";

    }

    static tokenValid() {
        if ((IedToken.expiresAt - (Date.now()/1000)) > 0) {
            return true
        }
        return false
    }

}

module.exports = IedToken;


