/**
 * Created by xiawei on 2015/1/6.
 */
EarthApp = function(){
    Sim.App.call(this);
}

EarthApp.prototype = new Sim.App();

EarthApp.prototype.init = function(param){
    Sim.App.prototype.init.call(this, param);
    var earth = new Earth();
    earth.init();
    this.addObject(earth);

    var sun = new Sun();
    sun.init();
    this.addObject(sun);

    this.camera.position.z += 1.667;
}

Earth = function(){
    Sim.Object.call(this);
}

Earth.prototype = new Sim.Object();

Earth.prototype.init = function(){
    var earthGroup = new THREE.Object3D();
    this.setObject3D(earthGroup);
    this.createGlobe();
    this.createClouds();
    this.createMoon();
}

Earth.prototype.createGlobe = function(){
    var surfaceMap = THREE.ImageUtils.loadTexture("../images/earth_surface_2048.jpg");
    var normalMap = THREE.ImageUtils.loadTexture("../images/earth_normal_2048.jpg");
    var specularMap = THREE.ImageUtils.loadTexture("../images/earth_specular_2048.jpg");
    var shader = THREE.ShaderUtils.lib[ "normal" ],
        uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    uniforms["tNormal"].texture = normalMap;
    uniforms["tDiffuse"].texture = surfaceMap;
    uniforms["tSpecular"].texture = specularMap;
    uniforms["enableDiffuse"].value = true;
    uniforms["enableSpecular"].value = true;
    var shaderMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: uniforms,
        lights: true
    });
    var globeGeometry = new THREE.SphereGeometry(1, 32, 32);
    globeGeometry.computeTangents();
    var globeMesh = new THREE.Mesh(globeGeometry, shaderMaterial);
    globeMesh.rotation.z = Earth.TILT;
    this.object3D.add(globeMesh);
    this.globeMesh = globeMesh;
}

Earth.prototype.createClouds = function(){
    var cloudsMap = THREE.ImageUtils.loadTexture("../images/earth_clouds_1024.png");
    var cloudsMaterial = new THREE.MeshLambertMaterial({
        color:0xffffff, map:cloudsMap, transparent:true
    });
    var cloudsGeometry = new THREE.SphereGeometry(Earth.CLOUDS_SCALE, 32, 32);
    var cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMesh.rotation.z = Earth.TILT;
    this.object3D.add(cloudsMesh);
    this.cloudsMesh = cloudsMesh;
}

Earth.prototype.createMoon = function(){
    var moon = new Moon();
    moon.init();
    this.addChild(moon);
    //
    ////另一个月亮
    //var moon2 = new Moon();
    //moon2.init();
    //moon2.object3D.translateX(1);
    //this.addChild(moon2);
}

Earth.prototype.update = function(){
    this.globeMesh.rotation.y += Earth.ROTATION_Y;
    this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y;
    Sim.Object.prototype.update.call(this);
}

Earth.ROTATION_Y = 0.003;
Earth.TILT = 0.41;
Earth.RADIUS = 6371;
Earth.CLOUDS_SCALE = 1.005;
Earth.CLOUDS_ROTATION_Y = Earth.ROTATION_Y * 0.95;

Sun = function(){
    Sim.Object.call(this);
}
Sun.prototype = new Sim.Object();
Sun.prototype.init = function(){
    var light = new THREE.PointLight(0xffffff, 2, 100);
    light.position.set(-10, 0, 20);
    this.setObject3D(light);
}

/**
 * Created by xiawei on 2015/1/7.
 */
Moon = function()
{
    Sim.Object.call(this);
}

Moon.prototype = new Sim.Object();

Moon.prototype.init = function()
{
    var moonMap = "images/moon_1024.jpg";

    var geometry = new THREE.SphereGeometry(Moon.SIZE_IN_EARTHS, 32, 32);
    var texture = THREE.ImageUtils.loadTexture(moonMap);
    var material = new THREE.MeshPhongMaterial( { map: texture,
        ambient:0x888888 } );
    var mesh = new THREE.Mesh( geometry, material );

    // Let's get this into earth-sized units (earth is a unit sphere)
    var distance = Moon.DISTANCE_FROM_EARTH / Earth.RADIUS;
    mesh.position.set(Math.sqrt(distance / 2), 0, -Math.sqrt(distance / 2));

    // Rotate the moon so it shows its moon-face toward earth
    mesh.rotation.y = Math.PI;

    // Create a group to contain Earth and Satellites
    var moonGroup = new THREE.Object3D();
    moonGroup.add(mesh);

    // Tilt to the ecliptic
    moonGroup.rotation.x = Moon.INCLINATION;

    // Tell the framework about our object
    this.setObject3D(moonGroup);

    // Save away our moon mesh so we can rotate it
    this.moonMesh = mesh;
}

Moon.prototype.update = function()
{
    // Moon orbit
    this.object3D.rotation.y += (Earth.ROTATION_Y / Moon.PERIOD);

    Sim.Object.prototype.update.call(this);
}

Moon.DISTANCE_FROM_EARTH = 356400;
Moon.PERIOD = .28;
Moon.EXAGGERATE_FACTOR = 1.2;
Moon.INCLINATION = 0.089;
Moon.SIZE_IN_EARTHS = 1 / 3.7 * Moon.EXAGGERATE_FACTOR;