const express = require('express')
var csvjson = require('csvjson');
const bodyParser = require('body-parser')
var request = require('request')
let cfenv = require('cfenv');
let oAppEnv = cfenv.getAppEnv();
require('./config')
const app = express()
app.use(bodyParser.json())
const port = 5000
//console.log("App environment ::",oAppEnv);
let contentData = "";
var repliesArray = [];
var csvoptions = {
    delimiter : ',', // optional
    quote     : '"' // optional
  };
const data = JSON.stringify({
    "businessUnitList": [
        "string"
    ],
    "categoryList": [
        "string"
    ],
    "outputFormat": "CSV",
    "preferredLevelList": [
        0
    ],
    "qualificationStatusList": [
        "Unknown"
    ],
    "regionList": [
        "string"
    ],
    "registrationStatusList": [
        "Unknown"
    ],
    "withQuestionnaire": true
})
const options = {
    url: 'https://eu.openapi.ariba.com/api/supplierdataaccess/v1/sandbox/searchSupplier',
    method: 'POST',
    body :data,
    json: true,
    headers: {
        'Content-Type': 'application/json',
        'apiKey':'6nTVq1ccG565gOft0lVK0jM5pTa8Ds7e',
        'Authorization':'Basic cmFqaXYuc2hpdmRldi5wYW5kZXlAc2FwLmNvbTpidm1AUzE5Mw=='
    }
}

app.get('/searchsupplier', function (req, res) {
    console.log("Get search supplier api")

    request(
        options

    , function (error,response,body) {
        console.log("reached inside supplier search :", body)
       var jsonData= csvjson.toObject(body, options);
          // let parsedBody = JSON.parse(body)
       
        console.log("pasred json from csv :: ",jsonData)
        if (!error && response.statusCode == 200) {

           
            var outputRes = {
                "replies": jsonData,
                "conversation": {
                    "language": "en",

                }
            };
            console.log("inside success supplier response :", outputRes);
            res.json(outputRes);
            repliesArray = [];
        } else {
            console.log("Error Data:", error.message)
            res.send('Data Not Found');
        }
    }).write(data);
})


app.post('/errors', (req, res) => {
    console.log(req.body)
    res.send()
})

// //app.listen('port', oAppEnv.port);
app.listen(oAppEnv.port, () => {
    console.log('Server is running on port  :: ', oAppEnv.port)
})
//  app.listen(port, () => { 
//      console.log('Server is running on port  :: ') 
//   })