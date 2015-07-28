/**
 * Created by xiawei on 2015/1/16.
 */
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

    this.camera.position.z += 20;
    this.camera.position.y += 5;
}

Earth = function(){
    Sim.Object.call(this);
}

Earth.prototype = new Sim.Object();

Earth.prototype.init = function(){
    var earthGroup = new THREE.Object3D();
    this.setObject3D(earthGroup);
    this.createGlobe();

    //var lightD = new THREE.DirectionalLight(0xffffff, 1);
    //lightD.position.set(0, 10, 10);
    //this.object3D.add(lightD);
    //var lightA = new THREE.AmbientLight(0xffffff);
    //this.object3D.add(lightA);
    var lightP = new THREE.PointLight(0xffffff, 1, 0);
    lightP.position.set(0, 10, 10);
    this.object3D.add(lightP);
}

Earth.prototype.createGlobe = function(){
    var surfaceMap = THREE.ImageUtils.loadTexture("images/sz_surface.jpg");
    var normalMap = THREE.ImageUtils.loadTexture("images/sz_normal.jpg");
    var specularMap = THREE.ImageUtils.loadTexture("images/sz_specular.jpg");
    var shader = THREE.ShaderUtils.lib[ "normal" ],
        uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    uniforms["tDiffuse"].texture = surfaceMap;
    uniforms["tNormal"].texture = normalMap;
    uniforms["tSpecular"].texture = specularMap;
    uniforms["enableDiffuse"].value = true;
    uniforms["enableSpecular"].value = true;
    var shaderMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: uniforms,
        lights: true
    });
    var globeGeometry = new THREE.CubeGeometry(32, 2, 16);
    globeGeometry.computeTangents();
    var globeMesh = new THREE.Mesh(globeGeometry, shaderMaterial);
    globeMesh.rotation.x += 0.5;
    this.object3D.add(globeMesh);
    this.globeMesh = globeMesh;
}

Earth.prototype.update = function(){
    this.globeMesh.rotation.y += 0.003;
    //this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y;
    Sim.Object.prototype.update.call(this);
}

Sun = function(){
    Sim.Object.call(this);
}
Sun.prototype = new Sim.Object();
Sun.prototype.init = function(){
    var light = new THREE.PointLight(0xffffff, 2, 100);
    light.position.set(-10, 0, 20);
    this.setObject3D(light);
    console.log('this is ' + this.toString());
}