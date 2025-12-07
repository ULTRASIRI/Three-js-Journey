import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { ACESFilmicToneMappingShader } from 'three/examples/jsm/Addons.js'
import { acesFilmicToneMapping, normalMap } from 'three/tsl'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

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
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh)
        {
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
// Intensity
scene.environmentIntensity = 1
gui
    .add(scene, 'environmentIntensity')
    .min(0)
    .max(10)
    .step(0.001)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Models
 */
// Helmet
// gltfLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(10, 10, 10)
//         scene.add(gltf.scene)

//         updateAllMaterials()
//     }
// )
gltfLoader.load(
    '/models/hamburger.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(0.4,0.4,0.4)
        gltf.scene.position.set(0,2.5,0)
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * textures
 */
const wallColorTexture = textureLoader.load('./textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg')
const wallNormalTexture = textureLoader.load('./textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.jpg')
const wallAORoughnessMetalnessTexture = textureLoader.load('./textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg')
wallColorTexture.colorSpace = THREE.SRGBColorSpace

const floorColorTexture = textureLoader.load('./textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg')
const floorNormalTexture = textureLoader.load('./textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png')
const floorAORoughnessMetalnessTexture = textureLoader.load('./textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg')
floorColorTexture.colorSpace = THREE.SRGBColorSpace

const floor = new THREE.Mesh (
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map : floorColorTexture,
        normalMap : floorNormalTexture,
        aoMap : floorAORoughnessMetalnessTexture,
        roughnessMap : floorAORoughnessMetalnessTexture,
        metalnessMap : floorAORoughnessMetalnessTexture
    })
)
floor.rotation.x = -Math.PI*0.5
scene.add(floor)
floor.receiveShadow = true


const wall = new THREE.Mesh (
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map : wallColorTexture,
        normalMap : wallNormalTexture,
        aoMap : wallAORoughnessMetalnessTexture,
        roughnessMap : wallAORoughnessMetalnessTexture,
        metalnessMap : wallAORoughnessMetalnessTexture
    })
)
wall.position.set (0,4,-4)
wall.receiveShadow=true
scene.add(wall)


/**
 * light 
 */
const directionalLight = new THREE.DirectionalLight('#ffffff',1)
directionalLight.position.set(-4 , 6.5 , 2.5)
directionalLight.intensity = 4
scene.add(directionalLight) 
directionalLight.castShadow=true  //enable shadows

directionalLight.target.position.set(0,4,0)  //to change the target
directionalLight.target.updateWorldMatrix()  // to update the matrices after changing the target - after object is rendered
scene.add(directionalLight.target)

directionalLight.shadow.camera.far = 15  //far limit
directionalLight.shadow.mapSize.set(512,512)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

////bias
directionalLight.shadow.normalBias = 0.019
directionalLight.shadow.bias = -0.007

gui.add(directionalLight , 'intensity' , 0, 10, 0.001)
gui.add(directionalLight.position , 'x' ,-10, 10, 0.001).name('lightX')
gui.add(directionalLight.position , 'y' ,-10, 10, 0.001).name('lightY')
gui.add(directionalLight.position , 'z' ,-10, 10, 0.001).name('lightZ')
gui.add(directionalLight , 'castShadow')
gui.add(directionalLight.shadow , 'normalBias',-0.05,0.05,0.001)
gui.add(directionalLight.shadow , 'bias',-0.05,0.05,0.001)

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
    antialias: true, //removes stairlike effect form models
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//toneMapping  to convert HDR into Low Dynamic Range (LDR)
renderer.toneMapping = THREE.ReinhardToneMapping
gui.add(renderer , 'toneMapping' ,{
    No : THREE.NoToneMapping,
    ACESFilmic : THREE.ACESFilmicToneMapping,
    Linear : THREE.LinearToneMapping,
    Cineon : THREE.CineonToneMapping,
    Reinhard : THREE.ReinhardToneMapping
})
renderer.toneMappingExposure = 1
gui.add(renderer, 'toneMappingExposure' ,0,10,0.001)

//shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()