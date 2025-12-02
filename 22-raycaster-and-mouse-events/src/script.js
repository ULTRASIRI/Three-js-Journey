import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * gltf
 */
const gltfLoader = new GLTFLoader()

let model = null

gltfLoader.load ('./models/Duck/glTF-Binary/Duck.glb',(gltf) =>
{
    model= gltf.scene
    gltf.scene.position.y = -1.2
    scene.add(gltf.scene)
})

/**
 * light
 */
const ambientLight = new THREE.AmbientLight('#ffffff',4)
ambientLight.position.set(1,2,3)
scene.add(ambientLight)


// raycaster 
// const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3,0,0)
// const rayDirectiion = new THREE.Vector3(10,0,0)
// rayDirectiion.normalize()  //always normalise
// raycaster.set(rayOrigin,rayDirectiion)

// // const intersect = raycaster.intersectObject(object1) //for 1 object
// const intersects = raycaster.intersectObjects([object1,object2,object3]) //for many objects 
// console.log(intersects)



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
camera.position.z = 3
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
 * mousemove 
 */ 
const mouse = new THREE.Vector2()
window.addEventListener ('mousemove',(_Event) => 
{
    mouse.x=_Event.clientX / sizes.width *2 -1
    mouse.y=-(_Event.clientY / sizes.height) *2 +1
})

const raycaster = new THREE.Raycaster()

let currentIntersect =null

/**
 * mouse click
 */
window.addEventListener ('click',()=>
{
    if (currentIntersect){
        if (currentIntersect.object=== object1){
            console.log('obj1')
        }
        else if (currentIntersect.object=== object2){
            console.log('obj2')
        }
        else if (currentIntersect.object=== object3){
            console.log('obj3')
        }
    }
})


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime*0.7)*1.5
    object2.position.y = Math.sin(elapsedTime)*1.5
    object3.position.y = Math.sin(elapsedTime*1.3)*1.5


    raycaster.setFromCamera(mouse,camera)  //make sure you only have 1 camera

    // const intersect = raycaster.intersectObject(object1) //for 1 object
    const objectToTest =[object1,object2,object3]
    const intersects = raycaster.intersectObjects(objectToTest) //for multiple objects 

    
    //Witness Variable
    if (intersects.length){
        if (currentIntersect === null){
            console.log ('mouse enter')
        }
        currentIntersect=intersects[0]
    }else {
        if (currentIntersect)
        {
            console.log('mouse leave')
        }
        currentIntersect=null
    }
     
    for (const object of objectToTest){
        object.material.color.set('#ff0000')
    }
    for (const intersect of intersects){
        intersect.object.material.color.set('#0000ff')
    }
    //model intersects
    if (model)
    {
        const modelIntersects = raycaster.intersectObject(model)
        if(modelIntersects.length){
            model.scale.set(1.2,1.2,1.2)
        }
        else{
            model.scale.set(1,1,1)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()