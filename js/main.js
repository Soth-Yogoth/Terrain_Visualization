var container;
var camera, scene, renderer;

init();
animate();

function init()
{
    container = document.getElementById('container');

    scene = new THREE.Scene();
    displayTriangle();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000); 
    camera.position.set(0, 0, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); 
    
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    renderer.setClearColor(0x000000ff, 1);
    container.appendChild(renderer.domElement);
    
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate()
{
    requestAnimationFrame(animate);
    render(); 
}

function render()
{
    renderer.render(scene, camera);
}

function displayTriangle()
{
    var geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(-3.0, -3.0, 0.0));
    geometry.vertices.push(new THREE.Vector3(3.0, -3.0, 0.0));
    geometry.vertices.push(new THREE.Vector3(0.0, 3.0, 0.0));

    geometry.faces.push(new THREE.Face3(0, 1, 2));

    geometry.faces[0].vertexColors[0] = new THREE.Color(0xff0000);
    geometry.faces[0].vertexColors[1] = new THREE.Color(0x00ff00);
    geometry.faces[0].vertexColors[2] = new THREE.Color(0xff00ff);

    var triangleMaterial = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        wireframe: false,
        side: THREE.DoubleSide
    });
    
    var triangleMesh = new THREE.Mesh(geometry, triangleMaterial);
    triangleMesh.position.set(0.0, 0.0, 0.0);
    
    scene.add(triangleMesh);
}