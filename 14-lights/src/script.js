import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

/**
 * lights
 */
//directional light
const directionalLight = new THREE.DirectionalLight(0xffffff,1)
scene.add(directionalLight)
gui.add(directionalLight,'intensity',0.1,2,0.1).name('directional_light_helper')
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.3)
scene.add(directionalLightHelper)

//ambient light
const ambientLight = new THREE.AmbientLight(0xfffff0,1)
scene.add(ambientLight)
gui.addColor(ambientLight,'color').name('ambient_color')

//hemispherical light
const hemisphereLight =new THREE.HemisphereLight(0xff0000,0x00ff00,1)
scene.add(hemisphereLight)
gui.add(hemisphereLight,'intensity',0.1,2,0,1).name('hemispherical_lght_intensity')
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight,0.2)
scene.add(hemisphereLightHelper)

//point light
const pointLight = new THREE.PointLight(0xff00ff,2)
scene.add(pointLight)
pointLight.position.z=-1
const pointLightHelper = new THREE.PointLightHelper(pointLight,0.4)
scene.add(pointLightHelper)
gui.addColor(pointLight,'color').name('point_light_color')
gui.add(pointLight,'intensity',1,3,0.1).name('pointLight_intensity')

//rect area light
const rectAreaLight =new THREE.RectAreaLight(0xabcdef,3,2,2)
scene.add(rectAreaLight)
rectAreaLight.position.z=1.5
rectAreaLight.position.x=1.5
rectAreaLight.rotation.y=3.14*0.25
gui.addColor(rectAreaLight,'color').name('rect_color')
//const rectAreaLightHelper =new THREE.RectAreaLightHelper(rectAreaLight)
 
/**
 * performances of these lights
 * high_performance | medium_performance | low_perforamnce
 * ambient          |  directional        |   spot
 * hamispherical    |  point              |   rectArea
 */


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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()