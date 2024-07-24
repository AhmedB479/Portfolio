import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width,sizes.height);
camera.position.setZ(30);
camera.position.setY(10);
camera.rotateZ(-2)
renderer.render(scene,camera)

const geometry = new THREE.IcosahedronGeometry(10,0);
const material= new THREE.MeshStandardMaterial({color:colorchange()},{roughness:0.199})
const dice = new THREE.Mesh(geometry,material)

const outgeometry = new THREE.IcosahedronGeometry(10,0);
const outmaterial= new THREE.MeshStandardMaterial({color:colorchange()},{roughness:0.199})
const outdice = new THREE.Mesh(outgeometry,outmaterial)



scene.add(dice,outdice)

function colorchange(){

  const r = 0;
  const g = Math.random();
  const b = Math.random();
  return new THREE.Color().setRGB(r, g, b);
}
function updateColorGradually(mesh) {
  const targetColor = colorchange();
  const currentColor = mesh.material.color;

  // Gradually transition to the target color
  currentColor.lerp(targetColor, 0.01);
}

const light1 = new THREE.PointLight(0xffffff)
light1.position.set(10,5,1)
const light2 = new THREE.PointLight(0xffffff)
light2.position.set(-10,5,-1)
const ambient = new THREE.AmbientLight(0xffffff)
scene.add(light1,light2,ambient)

//const lighthelp = new THREE.PointLightHelper()
const grid = new THREE.GridHelper(200,50)
scene.add(grid)

//const controls = new OrbitControls(camera,renderer.domElement);

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

function animate(){
  requestAnimationFrame(animate);
  dice.rotation.x += 0.01
  dice.rotation.y += 0.01
  dice.rotation.z += 0.005



  updateColorGradually(dice)
  renderer.render(scene,camera);
}
animate()


