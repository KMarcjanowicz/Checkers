/*
    klasa Game
*/
var scene;
var camera;
var renderer;
var c_1st = false;
var c_2nd = false;
var o_1st;
var o_2nd;
var positions = [
    [450, 50, 0],
    [-450, 50, 0]
]
var szachownica = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
];
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
var figury = [];
function Game() {
    this.player;
    this.obj;
    this.intersects = [];
    this.board = pionki;
    console.log(this.board)
    /*
        zmienna prywatna widoczna tylko w tym pliku / klasie
    */

    var test = 10;

    /*
        zmienna publiczna, dostępna z innych klas, nie używać
    */

    //this.test = 0; 

    /*
        funkcja prywatna widoczna tylko w tej klasie
    */
    var init = function () {
        var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
        var mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            45, // kąt patrzenia kamery (FOV - field of view)
            16 / 9, // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1, // minimalna renderowana odległość
            10000 // maxymalna renderowana odległość
        );
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x000000);
        renderer.setSize($(window).width(), $(window).height());
        $("#root").append(renderer.domElement);
        camera.position.set(800, 800, 800)
        camera.lookAt(scene.position)
        var axes = new THREE.AxesHelper(1000)
        scene.add(axes)

        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
                var material;
                if (szachownica[i][j] == 1) {
                    material = new THREE.MeshBasicMaterial({
                        map: new THREE.TextureLoader().load("Static/mats/dark_wood.jpg"),
                        side: THREE.DoubleSide,
                        wireframe: false,
                    });
                    var color = "dark_wood";
                }
                else {
                    material = new THREE.MeshBasicMaterial({
                        map: new THREE.TextureLoader().load("Static/mats/lightwood.jpg"),
                        side: THREE.DoubleSide,
                        wireframe: false,
                    });
                    var color = "white_wood";
                }
                var plane = new THREE.Mesh(geometry, material);
                plane.userData.color = color;
                plane.rotateX(Math.PI / 2)
                plane.position.x = i * 100 - 350
                plane.position.z = j * 100 - 350
                plane.userData.X = plane.position.x;
                plane.userData.Z = plane.position.z;
                plane.userData.i = i;
                plane.userData.j = j;
                scene.add(plane);
            }
        }
        function c(_) {
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    var geometry = new THREE.CylinderGeometry(30, 30, 20, 32);
                    if (_[i][j] == 2) {
                        var material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("Static/mats/metal.jpg"), });
                        var cylinder = new THREE.Mesh(geometry, material);
                        var color = "white";
                        cylinder.userData.color = color;
                        cylinder.position.x = i * 100 - 350
                        cylinder.position.z = j * 100 - 350
                        cylinder.userData.X = cylinder.position.x;
                        cylinder.userData.i = i;
                        cylinder.userData.j = j;
                        cylinder.userData.new_i = 0;
                        cylinder.userData.new_j = 0;
                        cylinder.userData.Z = cylinder.position.z;
                        cylinder.position.y = 10;
                        figury.push(cylinder);
                        scene.add(cylinder);
                    }
                    else if (_[i][j] == 1) {
                        material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("Static/mats/metal2.jpg"), });
                        var cylinder = new THREE.Mesh(geometry, material);
                        var color = "black";
                        cylinder.userData.color = color;
                        cylinder.position.x = i * 100 - 350
                        cylinder.position.z = j * 100 - 350
                        cylinder.userData.i = i;
                        cylinder.userData.j = j;
                        cylinder.userData.new_i = 0;
                        cylinder.userData.new_j = 0;
                        cylinder.userData.X = cylinder.position.x;
                        cylinder.userData.Z = cylinder.position.z;
                        cylinder.position.y = 10;
                        figury.push(cylinder);
                        scene.add(cylinder);
                    }
                }
            }
        }
        c(pionki);

        $(document).mousedown(function (event) {
            mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera);
            if (c_1st == false && c_2nd == false) {
                intersects = raycaster.intersectObjects(scene.children);
                if (intersects.length > 0) {
                    if (obj.color == intersects[0].object.userData.color) {
                        o_1st = intersects[0];
                        console.log("Obiekt 1: ")
                        console.log(o_1st)
                        c_1st = true;
                        o_1st.object.material.color.set(0xADFF2F);
                    }
                }
                else {
                    o_1st = null;
                }
            }
            else if (c_1st && c_2nd == false) {
                intersects = raycaster.intersectObjects(scene.children);
                if (intersects.length > 0) {
                    if (intersects[0].object.userData.color == "dark_wood" || o_1st.object.userData.color == intersects[0].object.userData.color) {
                        if (o_1st.object.uuid == intersects[0].object.uuid) {
                            o_1st.object.material.color.set(0xffffff);
                            o_1st = null;
                            o_2nd = null;
                            c_1st = false;
                            c_2nd = false;
                        }
                        else if (o_1st.object.userData.color == intersects[0].object.userData.color) {
                            o_1st.object.material.color.set(0xffffff);
                            o_1st = intersects[0]
                            o_1st.object.material.color.set(0xADFF2F);
                            c_2nd = false;

                        }
                        else if (intersects[0].object.userData.color == "dark_wood") {
                            o_2nd = intersects[0];
                            o_1st.object.userData.new_i = o_2nd.object.userData.i;
                            o_1st.object.userData.new_j = o_2nd.object.userData.j;
                            console.log("Obiekt 2: ")
                            console.log(o_2nd)
                            c_2nd = true;
                            o_2nd.object.material.color.set(0xADFF2F);
                        }
                    }
                }
                else {
                    o_2nd = null;
                }
            }
            if (c_1st && c_2nd) {
                $.ajax({
                    url: "/movement",
                    data: o_1st.object.userData,
                    type: "POST",
                    success: function (data) {
                        obj = JSON.parse(data)
                        console.log(obj)
                        for(var i = 0; i < figury.length; i++){
                            scene.remove(figury[i]);
                        }
                        c(obj);
                        
                        o_1st.object.material.color.set(0xffffff);
                        o_2nd.object.material.color.set(0xffffff);
                        o_1st.object.position.x = o_2nd.object.userData.X
                        o_1st.object.position.z = o_2nd.object.userData.Z
                        o_1st.object.userData.i = o_1st.object.userData.new_i;
                        o_1st.object.userData.j = o_1st.object.userData.new_j;
                        o_1st.object.userData.new_i = 0;
                        o_1st.object.userData.new_j = 0;
                        o_1st = null;
                        o_2nd = null;
                        c_1st = false;
                        c_2nd = false;
                    },
                    error: function (xhr, status, error) {
                        console.log('Error: ' + error);
                    },
                });
                //console.log(o_1st)
                //console.log(o_2nd)
            }
        });

        function render() {



            //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
            //np zmieniająca się wartość rotacji obiektu

            //mesh.rotation.y += 0.01;

            //wykonywanie funkcji bez końca ok 60 fps jeśli pozwala na to wydajność maszyny

            requestAnimationFrame(render);

            //ciągłe renderowanie / wyświetlanie widoku sceny nasza kamerą

            renderer.render(scene, camera);
        }
        render();
        $("#login").on("click", function () {
            player = $("#login-input").val();
        });
    }

    init();

    /*
        funkcje publiczne możliwe do wywołania z innych klas
    */

    this.setTest = function (val) {
        test = val;
        $("h1").html("ustawiam test w klasie Game na: " + test)
    }

    this.getTest = function () {
        return test;
    }
    this.cameraFront = function () {
        camera.position.set(800, 400, 0)
        camera.lookAt(scene.position)
    }
    this.cameraBack = function () {
        camera.position.set(-800, 400, 0)
        camera.lookAt(scene.position)
    }
    this.cameraTop = function () {
        camera.position.set(0, 1000, 0)
        camera.lookAt(scene.position)
    }
    this.cameraSide = function () {
        camera.position.set(0, 0, 1000)
        camera.lookAt(scene.position)
    }
}