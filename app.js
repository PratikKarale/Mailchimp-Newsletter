const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { dirname } = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', function(req, res){

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailId = req.body.email; 

    const data = {
            members: [ {
                email_address: emailId,
                status:'subscribed',
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            } ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/ed379b5c03";

    const options = {
        method: "POST",
        auth: "pratik:d7149ec4f50951102de593c6a91a7604-us1"
    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));

            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            }else{
                res.sendFile(__dirname + "/failure.html")
            }

        })
    })

    request.write(jsonData);
    request.end();

})


app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000.");
})


//api key : 
//d7149ec4f50951102de593c6a91a7604-us1
//ListId
//ed379b5c03
//URL
//https://mandrillapp.com/api/1.0/