const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

// In order to serve the static files/images from our server to browser, then we use special function of express i.e :-
app.use(express.static(__dirname + "/public/"));  // for I just replaced "public" to __dirname + "/public/"

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;
    // console.log(firstName, lastName, email);
    
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    
    // convert js object to flatpack json:-
    var jasonData = JSON.stringify(data);
    
    var options = {
        url : 'https://us21.api.mailchimp.com/3.0/lists/77defe0514',
        method: 'POST',
        headers: {
            "Authorization": "rahulraj22 f00875bb9027f44534565621861bb685-us21"
        },
        body: jasonData
    };
    
    request(options, function(error, response, body){
        if(error){
            // res.send("There was an error with signing up");
            console.log(error);
            res.sendFile(__dirname + "/failure.html");
        }
        else{
            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            }
            else {
                // res.send("There was an error with signing up, Please try again!");
                console.log(res.statusCode);
                res.sendFile(__dirname + "/failure.html");
            }
            // res.send("Success");
            // console.log(res.statusCode);
        }
    });
    
});


// after post request for home("/") route & now we want another request of failure route
app.post("/failure", function(req, res){
    res.redirect("/");
});

// we have to remove the local port i.e 3000 when deploying this app in heroku. So, replace 3000 with process.env.PORT
app.listen(process.env.PORT || 3000, function(){ 
    // console.log("Server is running on port 3000");
    console.log("Server is running on port " + process.env.PORT);
});

// putting porcess.env.PORT || 3000 => this will allow our app to listen to port in both local(3000) and heroku(process.env.PORT) 

// mailchimp api key : f00875bb9027f44534565621861bb685-us21 (our new api key)
// list id : 77defe0514
