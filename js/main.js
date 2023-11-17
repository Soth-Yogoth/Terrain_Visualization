var container;
var camera, scene, renderer;
const gridSize = 12;

init();
animate();

function init()
{
    container = document.getElementById('container');

    scene = new THREE.Scene();
    displayRegularGrid();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000); 
    camera.position.set(0, 0, 2 * gridSize);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); 
    
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    renderer.setClearColor(0x22222222, 1);
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

function displayRegularGrid()
{
    var geometry = new THREE.Geometry();

    for (let x = 0; x <= gridSize; x++)
    {
        for (let y = 0; y <= gridSize; y++)
        {
            geometry.vertices.push(new THREE.Vector3(x -gridSize/2, y - gridSize/2, 0.0));
        }
    }

    for (let j = 0.0; j < gridSize; j++)
    {
        for (let i = j * (gridSize + 1); i < (j + 1) * (gridSize + 1) - 1; i++)
        {    
            geometry.faces.push(new THREE.Face3(i, i + 1, gridSize + 1 + i));
            geometry.faces.push(new THREE.Face3(i + 1, i + gridSize + 2, gridSize + 1 + i));  
        }
    }

    for (let x = 0.0; x < 1; x += 1/gridSize)
    {
        for (let y = 0.0; y + 1/gridSize < 1.01; y += 1/gridSize)
        {    
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(x, y),
                new THREE.Vector2(x, y + 1/gridSize),
                new THREE.Vector2(x + 1/gridSize, y)]);
                
           geometry.faceVertexUvs[0].push([
                new THREE.Vector2(x, y + 1/gridSize),
                new THREE.Vector2(x + 1/gridSize, y + 1/gridSize),
                new THREE.Vector2(x + 1/gridSize, y)]);
        }
    }

    var loader = new THREE.TextureLoader();
    var texture = loader.load('pics/box_texture.jpg');

    var meshMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        wireframe: false,
        side: THREE.DoubleSide
    });

    var regularGrid = new THREE.Mesh(geometry, meshMaterial);
    regularGrid.position.set(0.0, 0.0, 0.0);

    scene.add(regularGrid);
}