var express = require('express');
var app = express();
const MongoClient = require('mongodb').MongoClient;
const MongoUrl = "mongodb+srv://node005:node005@cluster0.yov5l.mongodb.net/pointsofinterest";
const client = new MongoClient(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
var qs = require("querystring");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Webservice-Message");
    res.header("Access-Control-Expose-Headers", "X-Webservice-Message");
    next();
});

app.get('/', function(req, res) {
    client.connect(MongoUrl, function(err, db) {
        if (!err) {
            const poi = client.db("pointsofinterest").collection('pointsofinterest');
            poi.find().toArray(
                function(err, results) {
                    res.json(results);
                });
        } else {
            console.log("ERROR: " + err);
        }
    });
});

app.get('/search', function(req, res) {
    let region;
    let searchType;
    //If either TYPE and REGION is set then carry on.
    if (req.query.region || req.query.type) {
        //If both TYPE and REGION is set
        if (req.query.region && req.query.type) {
            region = req.query.region;
            searchType = req.query.type;
            client.connect(err => {
                if (!err) {
                    const poi = client.db("pointsofinterest").collection('pointsofinterest');
                    poi.find({
                        "region": region,
                        "type": searchType
                    }).toArray(
                        function(err, results) {
                            if (results.length > 0) {
                                res.json(results);
                            } else {
                                res.header("X-Webservice-Message", "No Data Returned");
                                res.status(204);
                                res.end();
                            }
                        });
                } else {
                    console.log("ERROR: " + err);
                    res.status(500);
                    res.end();
                }
            });
        }
        //If only REGION is set
        else if (req.query && req.query.region) {
            region = req.query.region;
            client.connect(err => {
                if (!err) {
                    const poi = client.db("pointsofinterest").collection('pointsofinterest');
                    poi.find({
                        "region": region
                    }).toArray(
                        function(err, results) {
                            if (results.length > 0) {
                                res.json(results);
                            } else {
                                //  res.header("X-Webservice-Message", "No Data Returned");
                                res.status(204);
                                res.end();
                            }
                        });
                } else {
                    console.log("ERROR: " + err);
                    res.status(500);
                    res.end();
                }
            });
        }
        //If only type is set
        else if (req.query.type) {
            searchType = req.query.type;
            client.connect(err => {
                if (!err) {
                    const poi = client.db("pointsofinterest").collection('pointsofinterest');
                    poi.find({
                        "type": searchType
                    }).toArray(
                        function(err, results) {
                            if (results.length > 0) {
                                res.json(results);
                            } else {
                                //  res.header("X-Webservice-Message", "No Data Returned");
                                res.status(204);
                                res.end();
                            }
                        });
                } else {
                    console.log("ERROR: " + err);
                    res.status(500);
                    res.end();
                }
            });
        }
    } else {
        res.status(400);
        res.end();
    }
});
// ------------------------------------------------------------- ADD END POINT STARTS ------------------------------------------------

app.post('/add', function(req, res) {
    let postdata = "";
    req.on("data", function(data) {
        postdata += data;
    });
    req.on("end", function() {
        //Parse Post Data
        if (!postdata) {
            console.log("POSTDATA is not set");
            res.status(400);
            res.end();
        }
        //Setting Variables from Post Data
        const post = qs.parse(postdata);
        //Check if variables are set
        var varcheck = ["name", "type", "country", "region", "lon", "lat", "desc"];
        for (var i = 0; i < varcheck.length; i++) {
            if (!post[varcheck[i]]) {
                //  res.header("X-Webservice-Message", varcheck[i] + " is not set");
                console.log(varcheck[i] + " is not set");
                res.status(400);
                res.end();
            }
        }
        const name = post.name;
        const type = post.type;
        const country = post.country;
        const region = post.region;
        const lon = parseFloat(post.lon);
        const lat = parseFloat(post.lat);
        const desc = post.desc;
        //Checking Lat and Lon
        //lon check
        if (parseFloat("-180") >= lon || parseFloat("180") <= lon) {
            res.header("X-Webservice-Message", "Longitude is invalid");
            res.status(400);
            res.end();
        }
        //lat check
        if (parseFloat("-90") >= lat || parseFloat("90") <= lat) {
            res.header("X-Webservice-Message", "Latitude is invalid");
            res.status(400);
            res.end();
        }

        client.connect(MongoUrl, function(err, db) {
            if (!err) {
                const poi = client.db("pointsofinterest").collection('pointsofinterest');
                poi.insertOne({
                    "name": name,
                    "type": type,
                    "country": country,
                    "region": region,
                    "lon": lon,
                    "lat": lat,
                    "description": desc
                }, function(err, db) { //CallBack Function for Add to DB
                    if (!err) {
                        res.header("X-Webservice-Message", "Added Database Entrie");
                        res.status(201);
                        res.end();
                        //IF ERROR IN ADDING TO DB
                    } else {
                        console.log("ERROR: " + err);
                        res.status(500);
                        res.end();
                    }
                });
                //IF ERROR CONNECTING TO DB
            } else {
                console.log("ERROR: " + err);
                res.status(503);
                res.end();
            }
        });
    });
});
// ------------------------------------------------------------- ADD END POINT END -----------------------------------------------------

// ------------------------------------------------------------- REVIEW END POINT START ------------------------------------------------
app.post('/review', function(req, res) {
    // GRAB POST DATA
    var postdata = "";
    req.on("data", function(data) {
        postdata += data;
    });

    req.on("end", function() {
        //Parse Post Data
        if (!postdata) {
            res.writeHead(400);
            res.end();
            return;
        }
        //Setting Variables from Post Data
        var post = qs.parse(postdata);
        var varcheck = ["id", "review"];
        for (var i = 0; i < varcheck.length; i++) {
            if (!post[varcheck[i]]) {
                res.status(400);
                res.end();
                return;
            }
        }

        const poi_id = post.id;
        const review = post.review;
        //Checking of the id matches any on the P:oints of interest DB. 
        client.connect(MongoUrl, function(err, db) {
            if (!err) {
                const poi = client.db("pointsofinterest").collection('pointsofinterest');
                poi.find({
                    _id: poi_id
                }).count({},
                    function(err, count){
                        if (!err) {
                            if (count > 0) {
                                client.connect(err => {
                                    if (!err) {
                                        const poi = client.db("pointsofinterest").collection('poi_reviews');
                                        poi.insertOne({
                                                "poi_id": poi_id,
                                                "review": review
                                            },
                                            function(err, db){
                                                if (!err) {
                                                    res.status(201); //Send Back 201 Created Status Code To Client
                                                    res.end();
                                                } else {
                                                    res.status(500);
                                                    console.log("ERROR: " + err);
                                                    res.end();
                                                }
                                            });
                                    } else {
                                        console.log("ERROR: " + err);
                                        res.end();
                                    }
                                });
                            } else {
								 res.status(400);
								console.log("ERROR: " + err);
								res.end();
                            }
                        }
                    }
                )
				
            }
        });
        //ADD START

        //ADD END
    });
});
// ------------------------------------------------------------- REVIEW END POINT END ------------------------------------------------

app.listen(8005, function() {
    console.log('Server Running listening on port 8005!');
});