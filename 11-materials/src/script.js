import * as THREE from 'three'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
const gui = new GUI()
 
const textureLoader= new THREE.TextureLoader
const matcaptexture = textureLoader.load('textures/matcaps/1.png')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const matcapTexture = textureLoader.load('textures/matcaps/3.png')
const gradientMapTexture = textureLoader.load('textures/gradients/3.jpg')
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//objects 
const material = new THREE.MeshStandardMaterial()

const sphere= new THREE.Mesh(
    new THREE.SphereGeometry(0.5,16,16),
    material
)
sphere.position.x=-1.5
const plane= new THREE.Mesh(
    new THREE.PlaneGeometry(),
    material
)
const torus= new THREE.Mesh(
    new THREE.TorusGeometry(0.3,0.2),
    material
)
torus.position.x=1.5
scene.add(sphere,plane,torus)
//material.transparent=true
//material.opacity=0.5
//material.alphaMap=doorAlphaTexture
//material.side=THREE.DoubleSide //to see all the faces of an object
// material.matcap= matcapTexture
// material.gradientMap = gradientMapTexture //to add cartoonish effect
// gradientMapTexture.minFilter=THREE.NearestFilter 
// gradientMapTexture.maxFilter=THREE.NearestFilter
// material.metalness=0.5
// material.roughness=0.5



gui.addColor(material,'color')
gui.add(material,'roughness',0,1,0.01)
gui.add(material,'metalness',0,1,0.01)
/**
 * Sizes
 */
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
//light
const ambientLight = new THREE.AmbientLight(0xffffff,1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff,30)
scene.add(pointLight)
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    sphere.rotation.x=elapsedTime*-0.5
    plane.rotation.x=elapsedTime*-0.5
    torus.rotation.x=elapsedTime*-0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()