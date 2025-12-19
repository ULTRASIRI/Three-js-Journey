import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

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
const flagTexture = textureLoader.load('./textures/flag-french.jpg')
/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

// Material
// const material = new THREE.MeshBasicMaterial()
const material = new THREE.ShaderMaterial( 
    {

        vertexShader: vertexShader, //position sathi
        fragmentShader: fragmentShader, //color sathi,
        uniforms : {
            uFrequency: { value: new THREE.Vector2(10,5)},
            uTexture: {value: flagTexture},
            uTime : {value: 0 },
            ////this can be anything its just the name
        }
        // wireframe: true ////can also use coomon porp bou cannot use map aomap oacity color
    }
)
gui.add(material.uniforms.uFrequency.value , 'x',0,10,0.001).name('frequency X')
gui.add(material.uniforms.uFrequency.value , 'y',0,10,0.001).name('frequency Y')

/**
 * 
 */

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)
for (let i = 0 ; i<count ; i++)
{
    randoms[i]=Math.random()
}
geometry.setAttribute('aRandom' , new THREE.BufferAttribute(randoms , 1))

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
console.log(geometry)
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
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

    // Update controls
    controls.update()

    material.uniforms.uTime.value = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()