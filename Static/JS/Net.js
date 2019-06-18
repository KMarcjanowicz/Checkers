
/*
    obsługa komunikację Ajax - serwer
*/

function Net() {
    /*
        funkcja publiczna możliwa do uruchomienia 
        z innych klas
    */
    this.obj;
    this.player;
    this.board;
    var moreplayers = true;

    $("#login").on("click", function () {
        player = $("#login-input").val();
        game.player = player;
        console.log(game.player)
        if (moreplayers) {
            $.ajax({
                url: "/loginUser",
                data: {
                    user: $("#login-input").val(),
                    action: "ADD_USER"
                },
                type: "POST",
                success: function (data) {
                    obj = JSON.parse(data)
                    //console.log(obj)
                    $("h1").html(obj.action)
                    if (obj.action == "TOO_MANY_USERS") {
                        moreplayers = false;
                    }
                    if (moreplayers) {
                        if (obj.user != undefined || obj.user != "") {
                            $("h2").html("Logged in: " + obj.user + ", you play as: " + obj.color)
                        }
                        else {
                            $("h2").html("")
                        }
                        if (obj.color == "white") {
                            game.cameraBack();
                        }
                        else if (obj.color == "black") {
                            game.cameraFront();
                        }
                        else {
                            $("#overlay").show();
                        }
                    }
                },
                error: function (xhr, status, error) {
                    console.log('Error: ' + error);
                },
            });
        }
        var interval = setInterval(function () {
            $.ajax({
                url: "/check2",
                data: {
                },
                type: "POST",
                success: function (data) {
                    //console.log(data)
                    var table = JSON.parse(data)
                    //console.log(table)
                    //console.log(moreplayers)
                    if (moreplayers) {
                        if (table.length == 2 && moreplayers) {
                            
                            $("#overlay").hide();
                            if (player == table[0].user) {
                                $("h2").html("Logged in: " + table[0].user + ", you play as: " + table[0].color + ", your opponent: " + table[1].user + ", plays as: " + table[1].color)
                                game.obj = data;
                            }
                            else {
                                $("h2").html("Logged in: " + table[1].user + ", you play as: " + table[1].color + ", your opponent: " + table[0].user + ", plays as: " + table[0].color)
                                game.obj = data;
                            }
                            //clearInterval(interval);
                            moreplayers = false;
                        }
                        else {
                            $("h3").html("waiting for a 2nd player to connect!")
                        }
                    }
                },
                error: function (xhr, status, error) {
                    console.log('Error: ' + error);
                },
            });
        }, 500)
    })

    $("#reset").on("click", function () {
        $.ajax({
            url: "/resetUsers",
            data: { action: "RESET_USERS" },
            type: "POST",
            success: function (data) {
                var obj = JSON.parse(data)
                $("h1").html(obj.action)
                $("h2").html("LOGIN AS AN USER")
            },
            error: function (xhr, status, error) {
                console.log('Error: ' + error);
            },
        });
    })
    this.returnPlayer = function () {
        return player;
    }
}