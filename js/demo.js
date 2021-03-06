var keyboard = new THREEx.KeyboardState();
var step = 0.0;
var stats, scene, renderer, composer;
var camera;
//var song = document.getElementById("the-song");
var cubes = {};
var cube = undefined;
var demo = true;
var song = new Tune("assets/big.mp3");
var tickerPointer = document.getElementById('ticker_pointer');

var cubeTexture = new TG.Texture( 256, 256).
                add(new TG.SinX().frequency(0.1).offset(4.64).tint(54.0/255, 191/255, 1.0)).
add(new TG.SinY().frequency(0.1).offset(4.64).tint(1.0, 235.0/255, 212.0/255)).
set(new TG.Twirl().radius(220.0).position(128, 128).strength(20.92).tint(247.0/255, 112/255.0, 0.0));

// create THREE.Texture from TG.Texture
var cubeTexture3JS = new THREE.Texture(cubeTexture.toCanvas());
cubeTexture3JS.needsUpdate = true;

//This is the API you'll use
var syncDevice = new JSRocket.SyncDevice(),

//Beats per minute of your demo tune
                BPM = 130,

//The resolution between two beats, four is usually fine,- eight adds a bit more finer control
                ROWS_PER_BEAT = 8,

//we calculate this now, so we can translate between rows and seconds later on
                ROW_RATE = BPM / 60 * ROWS_PER_BEAT,

//your variable that needs tuning in Rocket
                awesomeness,
                piano,
                cameraTween,
                cubeScale,
                coreBeat,

//the current row we're on
                row = 0;

//syncDevice.setConfig({socketURL:"ws://lolcathost:1338"});
//initialize the connection, default URL is ws://localhost:1338/

if(demo) {
        syncDevice.setConfig({'rocketXML':'swampdemo.rocket'});
        syncDevice.init("demo");
} else {
        syncDevice.init();
}

//-- set up all the things --
//this is also triggered when the Rocket XML is done, so make sure your ogg is ready
syncDevice.on('ready', onSyncReady);
//whenever you change the row, a value or interpolation mode this will get called
syncDevice.on('update', onSyncUpdate);
//[Spacebar] in Rocket calls one of those
syncDevice.on('play', onPlay);
syncDevice.on('pause', onPause);

function onSyncReady(){
        //jsRocket is done getting all the info you already have in Rocket, or is done parsing the .rocket file

        //this either adds a track to Rocket, or gets it for you
        awesomeness = syncDevice.getTrack('AmountOfAwesome');
        piano = syncDevice.getTrack('Piano');
        cameraTween = syncDevice.getTrack('Camera');
        cubeScale = syncDevice.getTrack('Scale');
        coreBeat = syncDevice.getTrack('CoreBeat');

        initScene();
        if(demo)
            startAnimation();
}

function onSyncUpdate(newRow){
        //row is only given if you navigate, or change a value on the row in Rocket
        //on interpolation change (hit [i]) no row value is sent, as the current there is the upper row of your block
        if(!isNaN(row)){
                row = newRow;
        }

        console.log("[onSyncUpdate] row " + row);

        //console.log("[onSyncUpdate] seeking", row / ROW_RATE);
        //song.seek(row / ROW_RATE);
        console.log("[onSyncUpdate] song time in seconds", song.position());


        // rerender the view
        animate();
}

function startAnimation() {
        song.start();
        animate();
}

function playAnimation() {
        song.seek(row / ROW_RATE);
        song.play(function() { animate() });
        //animate();
}

function pauseAnimation() {
        row = song.position() * ROW_RATE;
        window.cancelAnimationFrame(animate);
        song.pause();
}

function onPlay(){
        console.log("[onPlay] song time in seconds", song.position());
        console.log("[onPlay] row =", row);
        playAnimation();

        //you could also set tune.currentTime here
        console.log("[onPlay] time in seconds", row / ROW_RATE);
}

function onPause(){
        pauseAnimation();

        //pause your tune
        console.log("[onPause] time in seconds", row / ROW_RATE);
        console.log("[onPause] time in seconds", song.position());
}

// init the scene
function initScene(){

        if( Detector.webgl ){
                renderer = new THREE.WebGLRenderer({
                        antialias		: true,	// to get smoother output
                        preserveDrawingBuffer	: true	// to allow screenshot
                });
                renderer.setClearColor(0x0);

                //console.log("[renderer] using OpenGL")
        } else {
                renderer	= new THREE.CanvasRenderer();
        }

        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('container').appendChild(renderer.domElement);

        // add Stats.js - https://github.com/mrdoob/stats.js
        stats = new Stats();
        stats.domElement.style.position	= 'absolute';
        stats.domElement.style.bottom	= '0px';

        if(!demo)
document.body.appendChild( stats.domElement );

        // create a scene
        scene = new THREE.Scene();

        // put a camera in the scene
        camera	= new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set(0, 1, 5);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);

        // transparently support window resize
        THREEx.WindowResize.bind(renderer, camera);
        // allow 'p' to make screenshot
        THREEx.Screenshot.bindKey(renderer);
        // allow 'f' to go fullscreen where this feature is supported
        if( THREEx.FullScreen.available() ){
                THREEx.FullScreen.bindKey();
                document.getElementById('inlineDoc').innerHTML	= "<i>f</i> for fullscreen";
        }

        // here you add your objects
        // - you will most likely replace this part by your own
        var light	= new THREE.AmbientLight( Math.random() * 0xffffff );
        scene.add( light );
        var light	= new THREE.DirectionalLight( Math.random() * 0xffffff );
        light.position.set( Math.random(), Math.random(), Math.random() ).normalize();
        scene.add( light );

        var geometry	= new THREE.CubeGeometry( 2, 2, 2 );
        //var material	= new THREE.MeshBasicMaterial( {color : 0x00ffff});
        var material	= new THREE.MeshBasicMaterial( {map : cubeTexture3JS});
        //var material	= new THREE.MeshNormalMaterial();

        cube	= new THREE.Mesh( geometry, material );
        cube.position.z = -40;
        cube.position.y = 2.0;

        var edgesCube = new THREE.EdgesHelper(cube, 0x00ff00);
        edgesCube.material.linewidth = 4.0;
        scene.add(cube);
        scene.add(edgesCube);

        var size = 75;
        var step = 1;

        var gridHelper = new THREE.GridHelper( size, step );
        gridHelper.setColors(0x00ffff, 0x00ffff);
        gridHelper.position.z = -40;

        //for(var i = 0; i < gridHelper.geometry.vertices.length; i++) {
        //	gridHelper.geometry.morphTargets.push( { name: "target" + i, vertices: gridHelper.geometry.vertices[i]} );
        //}

        //console.log(gridHelper);
        for(var i = 0; i < gridHelper.geometry.vertices.length; i++) {
                //gridHelper.geometry.vertices[i].setY(Math.sin(i * Math.PI / 8) * 1.0);
        }

        scene.add( gridHelper );
        scene.fog = new THREE.FogExp2(0x0, 1.0);
}


// animation loop
function animate() {

        // loop on request animation loop
        // - it has to be at the begining of the function
        // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
        if(song.isPaused() === false)
requestAnimationFrame( animate );


        // update the current row
        if(song.isPaused() === false) {
                row = song.position() * ROW_RATE;
                //console.log("row =", row);
                syncDevice.update(row);
        }

        var time	= song.position();

        if(time <= 15) {
                var intro = document.getElementById("intro-credits");

                var theTitle = intro.children[0];
                var creds = [];

                creds.push(intro.children[1]);
                creds.push(intro.children[2]);
                creds.push(intro.children[3]);

                if(time < 4.5)
    theTitle.style.opacity = Math.max(Math.sin(time-3.0), 0);
                else if(time <= 13.0)
                        theTitle.style.opacity = 1.0
                else
                        theTitle.style.opacity = Math.max(Math.cos(time-13.0), 0);

                for(var i = 0; i < 3; i++) {
                        var timeBase = 5 + 2*i;
                        if(time < timeBase + 3.5)
        creds[i].style.opacity = Math.max(Math.sin(Math.max(time-timeBase, 0)), 0);
                        else
        creds[i].style.opacity = 0.0;
                }
        }


        scene.fog.density = awesomeness.getValue(row);

        cube.material.color.setHex(0x00ff00 | (0xff*piano.getValue(row) << 16));

        var tween = cameraTween.getValue(row)*Math.PI;

        if(time < 120)
camera.position.z = Math.sin(tween/4.0)*20.0 - 0.5*time;
        else
                camera.position.z = Math.sin(tween/4.0)*20.0 - 0.5*(240-time);

        //if(tween > 0.0) {
        camera.lookAt(cube.position);
        //	camera.position.y = Math.sin(tween)*2.0 + 3.5;
        //}

        cube.rotation.y = time*Math.PI/4.0;
        cube.rotation.x = time*Math.PI/4.0;

        var localScale = cubeScale.getValue(row);
        cube.scale.set(localScale, localScale, localScale);

        ////////////////////////////
        // HOTKEYS
        //////////////////////////
        //if(keyboard.pressed("r"))
        //	restart();
        //if(keyboard.pressed("space"))
        //	togglePause();

        // do the render
        render();

        // update stats
        stats.update();

        tickerPointer.style.left = (song.position() * 100 / song.duration()) + '%';
}

// render the scene
function render() {
        // actually render the scene
        renderer.render( scene, camera );
}
