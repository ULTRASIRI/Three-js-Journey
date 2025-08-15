import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'
import { roughness } from 'three/tsl'

console.log (Sky)

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()

/**
 * textures
 */
//floor
const floorColorTexture = textureLoader.load('./coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoader.load('./coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
const floorDisplacementTexture = textureLoader.load('./coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')
const floorNormalTexture = textureLoader.load('./coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')


floorColorTexture.repeat.set(8,8)
floorARMTexture.repeat.set(8,8)
floorDisplacementTexture.repeat.set(8,8)
floorNormalTexture.repeat.set(8,8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorColorTexture.colorSpace = THREE.SRGBColorSpace

//house

//walls
const wallColorTexture = textureLoader.load('./castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp')
// const wallAlphaTexture = textureLoader.load('./castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg')
const wallDisplacementTexture = textureLoader.load('./castle_brick_broken_06_1k/castle_brick_broken_06_disp_1k.jpg')
const wallARMTexture = textureLoader.load('./castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp')
const wallNormalTexture = textureLoader.load('./castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

//roof
// const roofAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const roofColorTexture = textureLoader.load('./roof_slates_02_1k/roof_slates_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('./roof_slates_02_1k/roof_slates_02_arm_1k.webp')
const roofDisplacementTexture = textureLoader.load('./roof_slates_02_1k/roof_slates_02_disp_1k.jpg')
const roofNormalTexture = textureLoader.load('./roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp')

roofColorTexture.colorSpace=THREE.SRGBColorSpace
//door

const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorColorTexture = textureLoader.load('./door/color.webp')
const doorAOTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')

doorColorTexture .colorSpace = THREE.SRGBColorSpace


//bushes
const bushColorTexture = textureLoader.load('./leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('./leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushDisplacementTexture = textureLoader.load('./leaves_forest_ground_1k/leaves_forest_ground_disp_1k.webp')
const bushNormalTexture = textureLoader.load('./leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

bushColorTexture . colorSpace =THREE.SRGBColorSpace

bushColorTexture.repeat.set(2,2)
bushARMTexture.repeat.set(2,2)
bushDisplacementTexture.repeat.set(2,2)
bushNormalTexture.repeat.set(2,2)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushDisplacementTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

bushColorTexture.wrapT = THREE.RepeatWrapping
bushARMTexture.wrapT = THREE.RepeatWrapping
bushDisplacementTexture.wrapT = THREE.RepeatWrapping
bushNormalTexture.wrapT = THREE.RepeatWrapping

//graves
const graveColorTexture = textureLoader.load('./plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const graveARMTexture = textureLoader.load('./plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
const graveDisplacementTexture = textureLoader.load('./plastered_stone_wall_1k/plastered_stone_wall_disp_1k.webp')
const graveNormalTexture = textureLoader.load('./plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')

graveColorTexture.colorSpace =THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3,0.4)
graveARMTexture.repeat.set(0.3,0.4)
graveDisplacementTexture.repeat.set(0.3,0.4)
graveNormalTexture.repeat.set(0.3,0.4)

// graveColorTexture.wrapS = THREE.RepeatWrapping
// graveARMTexture.wrapS = THREE.RepeatWrapping
// graveDisplacementTexture.wrapS = THREE.RepeatWrapping
// graveNormalTexture.wrapS = THREE.RepeatWrapping

// graveColorTexture.wrapT = THREE.RepeatWrapping
// graveARMTexture.wrapT = THREE.RepeatWrapping
// graveDisplacementTexture.wrapT = THREE.RepeatWrapping
// graveNormalTexture.wrapT = THREE.RepeatWrapping



/**
 * House
 */
// group house 
const house = new THREE.Group()
scene.add(house)







//walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({ 
        roughness: 0.7,
        map:wallColorTexture,
        aoMap:wallARMTexture,
        roughnessMap:wallARMTexture,
        metalnessMap:wallARMTexture,
        displacementMap:wallDisplacementTexture,
        normalMap:wallNormalTexture,
        displacementBias:-0.19,
        displacementScale:0.25
     })
)

gui.add(walls.material,'displacementBias',-1,1,0.01).name('wallDisplacementBias')

gui.add(walls.material,'displacementScale',0,1,0.01).name('wallDisplacementScale')



walls.position.y=1.25
house.add(walls)

//roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1.5,4),
    new THREE.MeshStandardMaterial({ roughness: 0.7,
        map:roofColorTexture,
        aoMap:roofARMTexture,
        metalnessMap:roofARMTexture,
        roughnessMap:roofARMTexture,
        // displacementMap:roofDisplacementTexture,
        normalMap:roofNormalTexture,
        // displacementBias:-0.13,
        // displacementScale:0.25
     })
)
roof.position.y=2.5+.75
roof.rotation.y=Math.PI/4
house.add(roof)

//door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2,50,50),
    new THREE.MeshStandardMaterial({ roughness: 0.7,
        alphaMap:doorAlphaTexture,
        transparent:true,
        map:doorColorTexture,
        // wireframe:true,
        metalnessMap:doorMetalnessTexture,
        normalMap:doorNormalTexture,
        roughnessMap:doorRoughnessTexture,
        displacementMap:doorHeightTexture,
        displacementScale:0.1,
        displacementBias:-0.03
        
     })
)

gui.add(door.material,'displacementScale',0,1,0.01).name('doorDisplacementScale')
gui.add(door.material,'displacementBias',-1,1,0.01).name('doorDisplacementBias')

door.position.z=2.01
door.position.y=1
house.add(door)

//bushes

const bushGeometry = new THREE.SphereGeometry(1,16,16)
const bushMaterial =new THREE.MeshStandardMaterial({
    map:bushColorTexture,
    aoMap:bushARMTexture,
    metalnessMap:bushARMTexture,
    roughnessMap:bushARMTexture,
    normalMap:bushNormalTexture,
        
})

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)
house.add(bush1)
bush1.rotation.x=-0.75

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)
house.add(bush2)
bush2.rotation.x=-0.75

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.1)
house.add(bush3)
bush3.rotation.x=-0.75

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)
house.add(bush4)
bush4.rotation.x=-0.75


//graves
 const graveGeometey = new THREE.BoxGeometry(0.6,.8,.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map:graveColorTexture,
    aoMap:graveARMTexture,
    metalnessMap:graveARMTexture,
    roughnessMap:graveARMTexture,
    normalMap:graveNormalTexture,    
})

const graves = new THREE.Group()
scene.add(graves)

for (let i=0 ; i<30 ; i++)
{

    const angle = Math.random()*Math.PI*2
    const radious = 3+ Math.random() *4
    const x = Math.sin(angle) * radious
    const z = Math.cos(angle) * radious
    const grave =  new THREE.Mesh(graveGeometey,graveMaterial)
    
    grave.position.x= x
    grave.position.y= Math.random()*0.4
    grave.position.z= z
    grave.rotation.y= (Math.random()-0.5) *0.4
    grave.rotation.x= (Math.random()-0.5) *0.4
    grave.rotation.x= (Math.random()-0.5) *0.4
    graves.add(grave)
}

//floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20,100,100),
    new THREE.MeshStandardMaterial({
        alphaMap:floorAlphaTexture, transparent : true,
        map:floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
       displacementMap: floorDisplacementTexture,
       displacementScale: 0.3,
       displacementBias: -0.2
        
    })
    
)
gui.add(floor.material,'displacementScale',0,1,0.01).name('floorDisplacementScale')
gui.add(floor.material,'displacementBias',-1,1,0.01).name('floorDisplacementBias')

// floor.position.y=-0.1
floor.rotation.x=-Math.PI/2
scene.add(floor)
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)



const doorLight = new THREE.PointLight('#ff7d86',5)
doorLight.position.set(0,2.2,2.5)
house.add(doorLight)

    /**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff',6)
const ghost2= new THREE.PointLight('#ff0088',6)
const ghost3= new THREE.PointLight('#ff0000',6)
scene.add(ghost1,ghost2,ghost3)



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
camera.position.x = 15
camera.position.y = 2
camera.position.z = 4
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
 * shadows
 * 
 */
renderer.shadowMap.enabled=true
renderer.shadowMap.type= THREE.PCFSoftShadowMap

directionalLight.castShadow=true
ghost1.castShadow=true
ghost2.castShadow=true
ghost3.castShadow=true


walls.castShadow=true
walls.receiveShadow=true
roof.castShadow=true

floor.receiveShadow=true

for(const grave of graves.children){

    grave.castShadow=true
    grave.receiveShadow=true
}



/**
 * mapping
 */
directionalLight.shadow.mapSize.width=256
directionalLight.shadow.mapSize.height=256

directionalLight.shadow.camera.top=9
directionalLight.shadow.camera.bottom=-8
directionalLight.shadow.camera.right=8
directionalLight.shadow.camera.left=-8
directionalLight.shadow.camera.near=1
directionalLight.shadow.camera.far=20

ghost1.shadow.mapSize.width=256
ghost1.shadow.mapSize.height=256
ghost1.shadow.camera.far=10

ghost2.shadow.mapSize.width=256
ghost2.shadow.mapSize.height=256
ghost2.shadow.camera.far=10

ghost3.shadow.mapSize.width=256
ghost3.shadow.mapSize.height=256
ghost3.shadow.camera.far=10



/**
 * sky
 */
const sky = new Sky()
sky.scale.set(100,100,100)
scene.add(sky)
//sky shaders
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)


/**
 * fog
 * 
 */

scene.fog = new THREE.FogExp2('#0a343f',0.1)

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()
 
  
// //position
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x= Math.cos(ghost1Angle) * 4
    ghost1.position.z= Math.sin(ghost1Angle) * 4
    ghost1.position.y= Math.sin(ghost1Angle) *  Math.sin(ghost1Angle*2.5)*  Math.sin(ghost1Angle*3.5)

    const ghost2Angle = -elapsedTime * 0.38 
    ghost2.position.x= Math.cos(ghost2Angle) * 5
    ghost2.position.z= Math.sin(ghost2Angle) * 5
    ghost2.position.y= Math.sin(ghost2Angle) *  Math.sin(ghost2Angle*2.5)*  Math.sin(ghost2Angle*3.5)

    const ghost3Angle = -elapsedTime*0.23
    ghost3.position.x= Math.cos(ghost3Angle) * 6
    ghost3.position.z= Math.sin(ghost3Angle) * 6
    ghost3.position.y= Math.sin(ghost3Angle) *  Math.sin(ghost3Angle*2.5)*  Math.sin(ghost3Angle*3.5)
// console.log(elapsedTime)

// Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()