import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GroundedSkybox } from 'three/examples/jsm/Addons.js'
import { objectDirection } from 'three/tsl'


/**
 * Base
 */
// consts
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()


// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/**
 * flight Helmet
 */
gltfLoader.load ('./models/FlightHelmet/glTF/FlightHelmet.gltf' ,(gltf) =>
{
    gltf.scene.scale.set(10,10,10)
    scene.add(gltf.scene)
})

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 1,
        color: 0x999999
    })
)
torusKnot.position.y = 4
torusKnot.position.x = -4
scene.add(torusKnot)

// HolyDonut

const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8,0.5),
    new THREE.MeshBasicMaterial({color: 'white'})
)
holyDonut.position.y=3.5
scene.add(holyDonut)
holyDonut.layers.enable(1)

/**
 * envirenmentMap and textures
 */
// const environmentMap = cubeTextureLoader.load([
//     '/environmentMaps/0/px.png',
//     '/environmentMaps/0/nx.png',
//     '/environmentMaps/0/py.png',
//     '/environmentMaps/0/ny.png',
//     '/environmentMaps/0/pz.png',
//     '/environmentMaps/0/nz.png',

// ])
// scene.environment = environmentMap
// scene.background = environmentMap
// scene.environmentIntensity = 1
// scene.backgroundBlurriness = 0
// scene.backgroundIntensity = 1
// scene.backgroundRotation.y = 0
// scene.environmentRotation.y = 0


// //tweaks
// gui.add(scene , 'environmentIntensity',0,10,0.01)
// gui.add(scene , 'backgroundBlurriness',0,1,0.001)
// gui.add(scene , 'backgroundIntensity',0,10,0.001)
// gui.add(scene.backgroundRotation , 'y',0,Math.PI*2,0.001).name('backgroundRotation')
// gui.add(scene.environmentRotation , 'y',0,Math.PI*2,0.001).name('environmentRotation')

//// Equirectangular Environment Map
// rgbeLoader.load('./environmentMaps/0/2k.hdr', (environmentMap) => 
// {
//     environmentMap.mapping =THREE.EquirectangularReflectionMapping
//     scene.background = environmentMap
//     scene.environment= environmentMap

//     const skybox = new GroundedSkybox(environmentMap,15,70)
//     skybox.position.y=15
//     scene.add(skybox)
// })

//// using textureloader

const environmentMap = textureLoader.load ('./environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace
scene.background = environmentMap
// scene.environment = environmentMap

//// cube render target 
//// We need to use a WebGLCubeRenderTarget
//// rendering the scene inside our own map texture "cube texture"  - render targets are textures in which we can store renders of any scene 
const cubeRendertarget = new THREE.WebGLCubeRenderTarget (256 , { type: THREE.HalfFloatType})   // 256 is resolution of each face in 6 faces of cube , halfFloatType and floatType are of 16 and 32 bit to store values
scene.environment = cubeRendertarget.texture

//// need to render 6 textures 1 for each face of cube 
//// use threeJs CubeCamera
const cubeCamera = new THREE.CubeCamera(0.1 , 100 , cubeRendertarget) 

//// we can see the torus as reflection on torus which is not realistic so we have to use layers  by using layers camera will only set objects matching layers
//// layers
cubeCamera.layers.set (1)



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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
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
    // Time
    const elapsedTime = clock.getElapsedTime()

    // holyDonut Rotation
    if(holyDonut){
        holyDonut.rotation.x = Math.sin(elapsedTime*2)
        cubeCamera.update(renderer, scene)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()