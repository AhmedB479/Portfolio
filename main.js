import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {BloomPass} from 'three/addons/postprocessing/BloomPass.js';
import {FilmPass} from 'three/addons/postprocessing/FilmPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import { MathUtils } from 'three/src/math/MathUtils.js';
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  andialias:true,
  alpha:true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width,sizes.height);

camera.position.setX(-18.41238);
camera.position.setY(33.91238);
camera.position.setZ(52.1121);

renderer.shadowMap.enabled = true;
renderer.render(scene,camera)

const geometry = new THREE.IcosahedronGeometry(10,0);
const material= new THREE.MeshNormalMaterial(/*{color:0x7FFFD4,roughness:0.3,metalness:0.9,flatShading:true}*/)
const dice = new THREE.Mesh(geometry,material)
dice.position.y = 10;

const outgeometry = new THREE.IcosahedronGeometry(11,0,);
const outmaterial= new THREE.MeshStandardMaterial({color:0xEC5800,wireframe:true})
const outdice = new THREE.Mesh(outgeometry,outmaterial)
outdice.position.y = 10;

const planeSize = 10;
const shadowGeo = new THREE.PlaneGeometry(planeSize, planeSize);

//adds stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshNormalMaterial()
  const star = new THREE.Mesh(geometry,material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloat(-50,50));

  star.position.set(x,y,z);
  scene.add(star)
}

Array(100).fill().forEach(addStar)

scene.add(dice,outdice,shadowGeo)


const light1 = new THREE.PointLight(0xffffff)
light1.position.set(5,5,1)
const light2 = new THREE.PointLight(0xff0000)
light2.position.set(-5,5,-1)
const ambient = new THREE.AmbientLight(0xfffff)
scene.add(light1,light2,ambient)

//const lighthelp = new THREE.PointLightHelper()
const grid = new THREE.GridHelper(200,50)
scene.add(grid)



// Add a directional light to cast shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 50, 50);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);

const controls = new OrbitControls(camera,renderer.domElement);
controls.autoRotate = true;
controls.enableDamping = true;
controls.enableRotate = false;
controls.enablePan = false;
controls.enableZoom = false;
//resize
window.addEventListener('resize', () =>{
  //update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //update camera
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth,window.innerHeight)
})
const center = new THREE.Vector3(-18.41238, 0, 0);
const radius = -18.41238;

// for blur post processing
const composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

const bloomPass = new BloomPass(
  1, // strength
  10, // kernel size
  1, // sigma ?
  8, // blur render target resolution
);
composer.addPass( bloomPass );

const filmPass = new FilmPass(
  0.5, // intensity
  false, // grayscale
);
composer.addPass( filmPass );

const outputPass = new OutputPass();
composer.addPass( outputPass );


function animate(){
  requestAnimationFrame(animate);
  

  dice.rotation.x += 0.01
  dice.rotation.y += 0.01
  dice.rotation.z += 0.005
  
  outdice.rotation.x += -0.01
  outdice.rotation.y += -0.01
  outdice.rotation.z += -0.005
  controls.update()

  renderer.render(scene,camera);
  //composer.render()
}
animate()


