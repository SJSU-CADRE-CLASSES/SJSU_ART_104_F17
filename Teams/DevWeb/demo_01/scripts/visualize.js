var visualizer;

$(document).ready(function () {
    visualizer = new DataVisualization();
    visualizer.initialize();
    visualizer.createBars();
    visualizer.setupDataViz();
});

function DataVisualization() {
    //constants
    this.numberOfBars = 28;

    //Rendering
    this.scene;
    this.camera;
    this.renderer;
    this.controls;

    //bars
    this.bars = new Array();

    //audio
    this.javascriptNode;
}

//initialize the visualizer elements
DataVisualization.prototype.initialize = function () {
    //generate a ThreeJS Scene
    this.scene = new THREE.Scene();

    //get the width and height
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    //get the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(WIDTH, HEIGHT);

    //append the rederer to the body
    document.body.appendChild(this.renderer.domElement);

    //create and add camera
    this.camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.1, 20000);
    this.camera.position.set(0, 45, 0);
    this.scene.add(this.camera);

    var that = this;

    //update renderer size, aspect ratio and projection matrix on resize
    window.addEventListener('resize', function () {

        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        that.renderer.setSize(WIDTH, HEIGHT);

        that.camera.aspect = WIDTH / HEIGHT;
        that.camera.updateProjectionMatrix();

    });

    //background color of the scene
    this.renderer.setClearColor(0xffffff, 1);

    //create a light and add it to the scene
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100, 200, 100);
    this.scene.add(light);

    //Add interation capability to the scene
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
};
    
    // var barGeometry1 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    //     var material = new THREE.MeshPhongMaterial({
    //         color: 0x758cb7,
    //         ambient: 0x808080,
    //         specular: 0xffffff
    //     });
    // scene.add(bar1);

    // var geometry3 = new THREE.CubeGeometry(20, 20, 20); 

    //                 var mesh3 = new THREE.Mesh( geometry3, new THREE.MeshLambertMaterial( { color: 0xD61900 } ) );

    //                 mesh3.position.x = 7;
    //                 mesh3.position.y = 5;
    //                 mesh3.position.z = 10;

    //                 mesh3.rotation.x = 3.88;
    //                 mesh3.rotation.y = 6.26;

    //                 mesh3.scale.x = 2;
    //                 mesh3.scale.y = 2;
    //                 mesh3.scale.z = 2;
                    
    //                 scene.add(mesh3);

//create the bars required to show the visualization
DataVisualization.prototype.createBars = function () {

    //iterate and create bars
    for (var i = 0; i < this.numberOfBars; i++) {

        //create a bar
        var barGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

        //create a material
        var material = new THREE.MeshPhongMaterial({
            // color: 0x00ff77,
            // ambient: 0xffffff,
            // specular: 0xffffff
        });

        // mesh = new THREE.Mesh(barGeometry, material);
        // mesh.position.y = 0
        // mesh.position.y = 0

        //create the geometry and set the initial position
        this.bars[i] = new THREE.Mesh(barGeometry, material[i]);
        this.bars[i].position.x = i - this.numberOfBars/2;
       
        // var array = [200, 200, 410,200,100,120,150,67,57,890,100,40,80,280,620,415,190,300,560,780,800,614,734,820,385,108,110,610,540,290,180,986,926,892,945,120,187,100,109,110,120,924,165,112,139,940,150]

        this.bars[i].position.y = 0;
        this.bars[i].position.z = 0;
        //add the created bar to the scene
        this.scene.add(this.bars[i]);
    }

    // var barGeometry1 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    // var material = new THREE.MeshPhongMaterial({
    //     color: this.getRandomColor(),
    //     ambient: 0x808080,
    //     specular: 0xffffff
    // });
    // this.scene.add(this.barGeometry1);

};
    



DataVisualization.prototype.setupDataViz = function () {
    //get the audio context
    this.audioContext = new AudioContext();

    //create the javascript node
    this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1); this.javascriptNode.connect(this.audioContext.destination);

    //this is where we renders the bars
    this.javascriptNode.onaudioprocess = function () {

        // Data from California Sea Lion Stranding (2012-2016)
        var array = [200, 230,200,170,140,190,167,157,190,150,160,230,200,150,190,108,110,120,230,250,180,187,100,109,120,120,165,112,139,150]
        
//        console.log(step);

        //render the scene and update controls
        visualizer.renderer.render(visualizer.scene, visualizer.camera);
        visualizer.controls.update();

        var step = Math.round(array.length / visualizer.numberOfBars);
         

        //Iterate through the bars and scale the z axis
        for (var i = 0; i < visualizer.numberOfBars; i++) {
            var value = array[i * step] / 10;
            value = value < 1 ? 1 : value;
            // var value = 30;
            visualizer.bars[i].scale.z = value;
            visualizer.bars[i].position.z = value / 4;
            // visualizer.bars[i].position.z = 0;

//------------------------------------------------------------------------
//          var arraycolor = [200, 200, 200, 200, 200 ,200 ,34,21,12,34,12,34,180,250,860,410,200,100,120,150,67,57,890,100,40,80,280,620,415,190,300,560,780,800,614,734,820,385,1080,1120,610,540,290,1800,986,926,892,945,1200,1870,1001,1099,1100,1200,924,1654,1121,1390,940,1502]
        
// //        console.log(step);

//         //render the scene and update controls
//         visualizer.renderer.render(visualizer.scene, visualizer.camera);
//         visualizer.controls.update();

//         var step2 = Math.round(arraycolor.material / visualizer.numberOfBars);
         

//         //Iterate through the bars and scale the z axis
//         for (var i = 0; i < visualizer.numberOfBars; i++) {
//             var value2 = array[i * step] / 10;
//             value2 = value2 < 1 ? 1 : value;
//             visualizer.bars[i].material = value2;
//----------------------------------------------------------------------------

        }
    }

};

//util method to get random colors to make stuff interesting
DataVisualization.prototype.getRandomColor = function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// -------------------------------------------------------
// function onDocumentMouseMove( event ) {

//                 event.preventDefault();

//                 mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//                 mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

//             }
// function animate() {

//     requestAnimationFrame( animate );

//     render();
//     stats.update();

// }

// function render() {

//     theta += 0.03;

//     camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
//     camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
//     camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
//     camera.lookAt( scene.position );

//     camera.updateMatrixWorld();

//     // find intersections

//     raycaster.setFromCamera( mouse, camera );

//     var intersects = raycaster.intersectObjects( scene.children );

//     if ( intersects.length > 0 ) {

//         if ( INTERSECTED != intersects[ 0 ].object ) {

//             if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

//             INTERSECTED = intersects[ 0 ].object;
//             INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
//             INTERSECTED.material.emissive.setHex( 0xffff66 );
              
//         }

//     } else {

//         if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

//         INTERSECTED = null;

//     }

//     renderer.render( scene, camera );

// }
