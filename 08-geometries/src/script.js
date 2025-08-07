import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const loader = new FontLoader();

loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
	const geometry1 = new TextGeometry( 'Hello this is S I R I', {
		font: font,
		size: .5,
		depth: .2,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.02,
		bevelSize: 0.01,
		bevelOffset: 0,
		bevelSegments: 5
	} );
    geometry1.center()
 

const material = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    emissive: 0x911111, 
    metalness: 0.3,
    roughness: 0.5
    //wireframe :true //wireframe enabeling which allows us to see the triangle without faces

})
const mesh = new THREE.Mesh(geometry1, material)
scene.add(mesh)
} );

//object 2
const count=50
const positionArray=new Float32Array(count*3*3)
for(let i=0 ; i<count ; i++){
    positionArray[i]=(Math.random()-0.5)*3
}

const positionAttribute=new THREE.BufferAttribute(positionArray,3)
const geometry =new THREE.BufferGeometry()
geometry.setAttribute('position',positionAttribute)

const material = new THREE.MeshBasicMaterial({ 
    color: 0x0fa4af,
    wireframe:true
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)



// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)
//light
const light = new THREE.DirectionalLight(0xffffff,5)
light.position.set(1, 1, 1)
scene.add(light)
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// const count =50; //no. of triangles
// const positionArray = new Float32Array(count*3*3)  //for 1 triangle 9 co-ordinates 1*3*3
// for (let i=0 ; i<count*3*3 ; i++){
//     positionArray[i]=(Math.random() -0.5)  *4 
// }

// const positionAttribute = new THREE.BufferAttribute(positionArray,3) //to take 3 attributes from positionarray x,y,z
// const geometry = new THREE.BufferGeometry()
// geometry.setAttribute('position',positionAttribute) //'position' will be used in shaders position attributes for setting attributes

    // your text geometry code
