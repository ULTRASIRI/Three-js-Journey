import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'

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
 * texture loader to load the baked shadow textures
 * ———————————————————————————————————————————————––
 */
const textureLoader = new THREE.TextureLoader()

const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.2)
scene.add(directionalLightHelper)
// ///enable shadow in light 
// //only 3 types of light support shadow pointLight , SpotLight , directionalLight
// directionalLight.castShadow=true
// /**
//  * to control near and far of camera
//  *              /|——————————————|
//  *             / |              |
//  *     /|—————|  |              |
//  * |=>  | near|  |    far       |
//  *     \|_____|  |              | 
//  *             \ |              |
//  *              \|______________|
//  */
// directionalLight.shadow.camera.near=1
// directionalLight.shadow.camera.far=6
// /**
//  * camerahelper
//  */
// const directionalLightCameraHelper =new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

// /**
//  * adding BLUR
//  * with radious method |
//  *                     \/
//  */
// // directionalLight.shadow.radius=10

// /**
//  * change the "shadow_map size"
//  */
// directionalLight.shadow.mapSize.width=1024
// directionalLight.shadow.mapSize.height=1024





// /**
//  * spot light
//  * spot light uses prespective camera
//  */

// const spotLight = new THREE.SpotLight(0xfa0000,2)
// gui.add(spotLight,'intensity',1,4,0.2).name('spotLight_intensity')
// /**cast shadow 
//  */
// spotLight.castShadow=true

// scene.add(spotLight)
// scene.add(spotLight.target)
// /**
//  * control field of view of spot light
//  * ------————————————————
//  */
// spotLight.shadow.camera.fov=30
// //camerahelper
// spotLight.shadow.camera.far=3
// const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
// scene.add(spotLightCameraHelper)

// /**
//  * point light
//  */
// const pointLight = new THREE.PointLight(0x0000fa,1)

// pointLight.position.set(0,0,1)
// // const pointLightCameraHelper= new THREE.CameraHelper(pointLight.shadow.camera)
// pointLight.shadow.camera.far=6
// pointLight.shadow.camera.near=1
// // scene.add(pointLightCameraHelper)
// scene.add (pointLight)


/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
/**
 * for sphere to cast shadow 
 *     @
 * _____,,,,___
 *   */
sphere.castShadow=true

  

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material //erase this material and activate the material below for static shadow
    // new THREE.MeshBasicMaterial({map:bakedShadow})// but if sphere moves shadow disent move with it

)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
/**
 * for plane to receive shadow
 */
plane.receiveShadow=true

scene.add(sphere, plane)

/**
 * baked shadow alternative
 * sphereshadow function 
 * high performance
 */
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5,1.5), 
    new THREE.MeshBasicMaterial({
        color:0x000000,
        transparent:true,
        alphaMap:simpleShadow
    })
    )
sphereShadow.rotation.x= -(Math.PI*0.5)
sphereShadow.position.y = plane.position.y+0.01 //to avoid z fighting
scene.add(sphereShadow)  
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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 4
camera.position.z = 5
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
renderer.shadowMap.enabled=false
// /**
//  * to enable shadow maps
//  */
// renderer.shadowMap.enabled=true
/**
 * shadow map 
 */

renderer.shadowMap.type=THREE.PCFSoftShadowMap
/**
 * Animaten
 */
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

/**
 * shadow maps
 * basic >performance <quality
 * PCFShadowMap <per >qua
 * PCFSoft  <<per >>qua
 * VSM  <<<per >>>qua
 */
/**
 * Z-fighting
 * wnen we add 2 planes at same place and render them
 * gpu dosent decide which plane is above and gliches
 */