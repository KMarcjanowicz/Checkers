var http = require("http");
var qs = require("querystring")
var fs = require("fs");
var users = [];
var pionki = [
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
];
var server = http.createServer(function (request, response) {
    // parametr res oznacza obiekt odpowiedzi serwera (response)
    // parametr req oznacza obiekt żądania klienta (request)
    if (request.url == "/") {
        fs.readFile("Static/index.html", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/JS/Game.js") {

        fs.readFile("Static/JS/Game.js", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'application/javascript' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/movement") {
        var allData = "";
        request.on("data", function (data) {
            allData += data;
        })
        request.on("end", function (data) {
            var finish = qs.parse(allData)
            pionki[parseInt(finish.i)][parseInt(finish.j)] = 0;
            if(finish.color == "black")
            {
                pionki[parseInt(finish.new_i)][parseInt(finish.new_j)] = 1;
            }
            else if(finish.color == "white")
            {
                pionki[parseInt(finish.new_i)][parseInt(finish.new_j)] = 2;
            }
            //console.log(finish)
            console.log(pionki)
            response.end(JSON.stringify(pionki));
        })
    }
    else if (request.url == "/JS/Main.js") {

        fs.readFile("Static/JS/Main.js", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'application/javascript' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/JS/Net.js") {

        fs.readFile("Static/JS/Net.js", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'application/javascript' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/JS/UI.js") {

        fs.readFile("Static/JS/UI.js", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'application/javascript' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/CSS/style.css") {

        fs.readFile("Static/CSS/style.css", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/libs/three.js") {

        fs.readFile("Static/libs/three.js", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'application/javascript' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/Static/mats/dark_wood.jpg") {

        fs.readFile("Static/mats/dark_wood.jpg", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'image/jpeg' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/Static/mats/lightwood.jpg") {

        fs.readFile("Static/mats/lightwood.jpg", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'image/jpeg' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/Static/mats/metal.jpg") {

        fs.readFile("Static/mats/metal.jpg", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'image/jpeg' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/Static/mats/metal2.jpg") {

        fs.readFile("Static/mats/metal2.jpg", function (error, data) {
            response.writeHead(200, { 'Content-Type': 'image/jpeg' });
            response.write(data);
            response.end();
        })
    }
    else if (request.url == "/loginUser") {
        console.log("OK");
        if (users.length == 0) {
            var allData = "";
            request.on("data", function (data) {
                data += "&color=white"
                allData += data;
            })
            request.on("end", function (data) {
                var finish = qs.parse(allData)
                response.end(JSON.stringify(finish));
                users.push(finish)
            })
        }
        else if (users.length == 1) {
            var allData = "";
            request.on("data", function (data) {
                data += "&color=black"
                console.log("data: " + data)
                allData += data;
            })
            request.on("end", function (data) {
                var finish = qs.parse(allData)
                users.push(finish)
                if (users[0].user != users[1].user) {
                    response.end(JSON.stringify(finish));
                }
                else {
                    response.end(JSON.stringify({ action: 'USER_ALREADY_EXISTS' }))
                    users.pop();
                    console.log(users)
                }
            })
        }
        else if (users.length >= 2) {
            response.end(JSON.stringify({ action: 'TOO_MANY_USERS' }));
        }
    }
    else if (request.url == "/check2") {
        response.end(JSON.stringify(users));
    }
    else if (request.url == "/resetUsers") {
        var allData = "";
        request.on("data", function (data) {
            console.log("data: " + data)
            allData += data;
        })
        request.on("end", function (data) {
            var finish = qs.parse(allData)
            users = [];
            response.end(JSON.stringify(finish));
            console.log(users);
        })
    }
    else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.write("<h1>404 - brak takiej strony</h1>");
        response.end();

    }

})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});

