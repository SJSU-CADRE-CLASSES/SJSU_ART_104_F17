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
    // 保存鼠标位置
    this.mouse = new THREE.Vector2();
    // 查找intersection
    this.raycaster;
    // 当前intersection
    this.intersection;

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

    // 初始化raycaster**为什么要初始化这个
    this.raycaster = new THREE.Raycaster();

    //create and add camera
    this.camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.1, 20000);
    this.camera.position.set(0, 45, 0);
    this.scene.add(this.camera);

    var that = this;

    // 注册鼠标移动事件处理函数
    document.addEventListener( 'mousemove',
        // 鼠标移动事件处理函数，时刻更新鼠标位置
        function ( event ) {

            event.preventDefault();

            that.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1.025;
            that.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1.025;

        },
        false
    );
    // 注册鼠标点击事件处理函数
    document.addEventListener( 'click',
        // 鼠标点击事件处理函数
        function ( event ) {

            event.preventDefault();

            if (that.intersection) window.open("https://www.google.com");

        },
        false
    );

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
    light.position.set(-100, 100, 100);
    this.scene.add(light);

    var light1 = new THREE.PointLight(0x888888);
    light.position.set(-100, 400, 100);
    this.scene.add(light1);

    //Add interation capability to the scene
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
};


DataVisualization.prototype.createBars = function () {

    //iterate and create bars
    for (var i = 0; i < this.numberOfBars; i++) {

        //create a bar
        var barGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

        //create a material
        var material = new THREE.MeshLambertMaterial({
            color: this.getRandomColor(),
            ambient: 0x808080,
            specular: 0xffffff
        });

        // mesh = new THREE.Mesh(barGeometry, material);
        // mesh.position.y = 0
        // mesh.position.y = 0

        //create the geometry and set the initial position
        this.bars[i] = new THREE.Mesh(barGeometry, material);
        this.bars[i].position.x = i - this.numberOfBars/2;

        this.bars[i].position.y = 0;
        this.bars[i].position.z = 0;
        //add the created bar to the scene
        this.scene.add(this.bars[i]);
    }

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

        // 查找intersection
        visualizer.findIntersection();
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

// 查找intersection并改变颜色
DataVisualization.prototype.findIntersection = function () {
    this.raycaster.setFromCamera( this.mouse, this.camera );

    var intersects = this.raycaster.intersectObjects( this.scene.children );

    if ( intersects.length > 0 ) {
      if ( this.intersection != intersects[ 0 ].object ) {
        if ( this.intersection ) this.intersection.material.emissive.setHex( this.intersection.currentHex );

        this.intersection = intersects[ 0 ].object;
        this.intersection.currentHex = this.intersection.material.emissive.getHex();
        this.intersection.material.emissive.setHex( 0xffff );
      }

    } else {
      if ( this.intersection ) this.intersection.material.emissive.setHex( this.intersection.currentHex );

      this.intersection = null;
    }
};
