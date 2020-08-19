const hackerEarthNode = require('hackerearth-node');
const express = require('express');
const router = express.Router();


const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const hackerEarth = new hackerEarthNode(process.env.HACKER_EARTH
    //Your Client Secret Key here this is mandatory
    //mode sync=1 or async(optional)=0 or null async is by default and preferred for nodeJS
);

router.post("/", (req, res) => {

    var config = {};
    config.time_limit = 1;  //your time limit in integer
    config.memory_limit = 323244;  //your memory limit in integer
    config.source = req.body.source;  //your source code for which you want to use hackerEarth api
    config.input = req.body.inputs;  //input against which you have to test your source code
    config.language = req.body.lang; //optional choose any one of them or none

    hackerEarth.run(config, function (err, response) {
        if (err)
            res.send(err);
        else
            //deal with response
            res.json(JSON.parse(response));  //you can use it in your own way
    });
})


module.exports = router;