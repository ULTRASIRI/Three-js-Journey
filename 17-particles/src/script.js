import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { bufferAttribute } from 'three/tsl'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('./textures/particles/2.png')
/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)



/**
 * Particles
 */


//geometry

const particleGeometry = new THREE.BufferGeometry() //SphereBufferGeometry
const count = 2000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i=0 ; i<count * 3 ; i++)
{
    positions[i]= (Math.random()-0.5)*10
    colors[i]= Math.random()
}
particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions,3)

)
particleGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors,3)

)



//material
const particleMaterial = new THREE.PointsMaterial({
    size:0.1,
    // color:"#ff88cc",
    alphaMap:particleTexture,
    transparent:true,
    sizeAttenuation:true,
    //alphaTest:0.001 // will not render alpha below 0.001  (alpha for black is 0)
    // depthTest:false
    depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexColors:true //to allow clors in material
    
})

//particles
const particles = new THREE.Points(particleGeometry,particleMaterial)
scene.add(particles)


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
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //update particles
    // particles.rotation.y = elapsedTime * 0.2 //to rotate the particles in scene
    for (let i=0 ; i<count ; i++){
        const i3 = i *3
        const x = particleGeometry.attributes.position.array[i3]
        // const z = particleGeometry.attributes.position.array[i3+2]

        particleGeometry.attributes.position.array[i3 + 1]= Math.sin(elapsedTime + x)  //waves
    }

    particleGeometry.attributes.position.needsUpdate=true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()