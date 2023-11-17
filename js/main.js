var container;
var camera, scene, renderer;

var gridSize;
var height;
var width;
var terrainMesh;

var imagedata;
var img = new Image()
var src = 'pics/Map3.jpg';

init();
animate();

function init()
{
    container = document.getElementById('container');

    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x22222222, 1);
    container.appendChild(renderer.domElement);

    img.onload = function()
    {
        gridSize = Math.max(img.height, img.width);
        length = img.height;
        width = img.width;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = length;
        
        context.drawImage(img, 0 , 0);
        imagedata = context.getImageData(0, 0, width, length);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000); 
        camera.position.set(0, -gridSize, gridSize);
        camera.lookAt(new THREE.Vector3(0, -gridSize/8, 0)); 

        var spotlight = new THREE.PointLight(0xEEE8AA);
        spotlight.position.set(-gridSize, -gridSize, 2*gridSize);
        scene.add(spotlight);

        terrainMesh = createTerrain();
        scene.add(terrainMesh);
    }
    img.src = src;

    window.addEventListener('resize', onWindowResize, false);
}

function getPixel(imagedata, x, y)
{
    var position = (imagedata.width * y + x) * 4, data = imagedata.data;
    return data[position];
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

    terrainMesh.rotateZ(0.002);
}

function render()
{
    renderer.render(scene, camera);
}

function createTerrain()
{
    var geometry = new THREE.Geometry();

    for (let x = 0; x <= width; x++)
    {
        for (let y = 0; y <= length; y++)
        {
            var height = getPixel(imagedata, x, y) / 2550 * gridSize;
            geometry.vertices.push(new THREE.Vector3(x - width/2, y - length/2, height));
        }
    }

    for (let j = 0.0; j < width; j++)
    {
        for (let i = j * (length + 1); i < (j + 1) * (length + 1) - 1; i++)
        {    
            geometry.faces.push(new THREE.Face3(i, i + 1, length + 1 + i));
            geometry.faces.push(new THREE.Face3(i + 1, i + length + 2, length + 1 + i));   
        }
    }

    for (let x = 0.0; x < 1; x += 1/width)
    {
        for (let y = 0.0; y < 1; y += 1/length)
        {    
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(x, y),
                new THREE.Vector2(x, y + 1/length),
                new THREE.Vector2(x + 1/width, y)]);
                
           geometry.faceVertexUvs[0].push([
                new THREE.Vector2(x, y + 1/length),
                new THREE.Vector2(x + 1/width, y + 1/length),
                new THREE.Vector2(x + 1/width, y)]);
        }
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var loader = new THREE.TextureLoader();
    var texture = loader.load('pics/grass.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);

    var terrainMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        wireframe: false,
        side: THREE.DoubleSide
    });

    var terrainMesh = new THREE.Mesh(geometry, terrainMaterial);
    terrainMesh.position.set(0.0, 0.0, 0.0);

    return terrainMesh;
}