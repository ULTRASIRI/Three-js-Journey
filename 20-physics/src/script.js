import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import CANNON from 'cannon'
import { deltaTime } from 'three/tsl'

/**
 * Debug
 */
const gui = new GUI()
const debugObject ={}

debugObject.createSphere = ()=>
{
    createSphere(
        Math.random()*0.5,
        {
            x:(Math.random()-0.5)*3,
            y:3,
            z:(Math.random()-0.5)*3
        }
    )
}
gui.add(debugObject,'createSphere')

debugObject.createBox = ()=>
    {
        createBox(
            Math.random()*0.5,
            Math.random()*0.5,
            Math.random()*0.5,
            {
                x:(Math.random()-0.5)*3,
                y:3,
                z:(Math.random()-0.5)*3
            }
        )
    }
    gui.add(debugObject,'createBox')

debugObject.reset = () =>
    {
        for(const object of objectsToUpdate){
            object.body.removeEventListener('collide', playHitSound)           
            scene.remove(object.mesh)
        }
        objectsToUpdate.splice(0,objectsToUpdate.length)

    }
    gui.add(debugObject,'reset')



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**sound
 * 
 */
const hitsound = new Audio('./sounds/hit.mp3')

const playHitSound = (collision) =>{
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if (impactStrength > 1.5)
    {
        hitsound.volume=Math.random()
        hitsound.currentTime=0
        hitsound.play()

    }
}

//physics world
const world = new CANNON.World()
world.gravity.set(0,-9.82,0)  //gravity is Vec3 (vector3) means -9.82 in y axis like earths gravity pulling down in -ve y axis
//broadphase - how objects interact with each other 
// 3 types - 
// 1)naive broadphase - everyone interact with everyone 
// 2)GridBroadphase - quadrills the world and only test bodies in same grid or box 
// 3)SAPBroadphase - test bodies on arbitary axis during multiple steps
const broadphase = new CANNON.SAPBroadphase(world)

//sleep - does not calculate the collision for bodies that dosent move in specific time 
world.allowSleep=true
 // we can control sleepTime for objects in world


/**
 * materials and contact material
 */
const defaultMaterial = new CANNON.Material('default') 


//contact material when concrete and plastic collide 
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction:0.1,
        restitution:0.7
    }
)

world.addContactMaterial(defaultContactMaterial)

//floor physics
const floorShape = new CANNON.Plane()
const floorbody = new CANNON.Body({
    shape: floorShape,
    mass: 0,
    material:defaultMaterial
})
world.addBody(floorbody)
floorbody.quaternion.setFromAxisAngle(   //connon.js does not support rotation()
    new CANNON.Vec3(-1,0,0),
    Math.PI*0.5 //initially plane is facing the camera we have to rotate it
)

/**
 * utils
 */
const objectsToUpdate =[]

const createSphere = (radious,position) =>
{
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1,20,20),
        new THREE.MeshStandardMaterial({
            metalness:0.3,
            roughness:0.4,
            envMap:environmentMapTexture
        }),
        

    )
    mesh.scale.set(radious,radious,radious) //optimizations
    mesh.castShadow= true,
    mesh.position.copy(position),
    scene.add(mesh)

//cannon physics 

    const shape = new CANNON.Sphere(radious)
    const body = new CANNON.Body({
    mass:1,
    position: new CANNON.Vec3(0,3,0),
    shape:shape,
    material:defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide',playHitSound)
    world.addBody(body)

objectsToUpdate.push({
    mesh:mesh,
    body:body
})
}

createSphere(0.5,{x:0,y:3,z:0})


/**
 * boxes
 */
const boxGeometry = new THREE.BoxGeometry(1,1,1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness:0.3,
    roughness:0.4,
    envMap:environmentMapTexture
})

const createBox = (width,height,depth,position) =>
    {
        const mesh = new THREE.Mesh(
            boxGeometry,
            boxMaterial
        )
        mesh.scale.set(width,height,depth) //optimizations
        mesh.castShadow= true,
        mesh.position.copy(position),
        scene.add(mesh)
    
    //cannon physics 
    
        const shape = new CANNON.Box(new CANNON.Vec3(width*0.5,height*0.5,depth*0.5))
        const body = new CANNON.Body({
        mass:1,
        position: new CANNON.Vec3(0,3,0),
        shape:shape,
        material:defaultMaterial
        })
        body.position.copy(position)
        body.addEventListener('collide',playHitSound)
        world.addBody(body)
    
    objectsToUpdate.push({
        mesh:mesh,
        body:body
    })
    }
    
    // createBox(0.5,0.5,0.5,{x:0,y:3,z:0}) //demo to create box 
    

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    let oldElapsedTime=0
    const deltaTime = elapsedTime-oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1/60,deltaTime,3) //1/6 - a fixed timestamp , deltatime- time since last call , 3 - max substeps allowed  // sphere.position.copy(sphereBody.position) // merging the co-ordinates of three.body and cannon.body

    for (const object of objectsToUpdate)
    {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
                                                         
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// const sphereShape = new CANNON.Sphere(0.5) // 0.5 is radious of sphere

// //mass of body
// const sphereBody = new CANNON.Body({
//     mass:1,
//     position: new CANNON.Vec3(0,3,0),
//     shape: sphereShape,
//     material:defaultMaterial
// })
// world.addBody(sphereBody)

// // apply forces wind effect 

// // sphereBody.applyLocalForce //applies force locally
// // (new CANNON.Vec3(150,0,0),  
// // new CANNON.Vec3(0,0,0))
// sphereBody.applyForce(new CANNON.Vec3(-0.5,0,0),
// sphereBody.position)

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)
