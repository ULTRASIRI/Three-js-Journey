import * as THREE from 'three'
// import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'
// import { color } from 'three/tsl'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group =new THREE.Group()
scene.add(group)

const sphere1 =new THREE.Mesh(
    new THREE.SphereGeometry(.5,10,10),
    new THREE.MeshToonMaterial({color:'#aa0000'})
)
sphere1.position.set(1,0,0)
group.add(sphere1)
const sphere2 =new THREE.Mesh(
    new THREE.SphereGeometry(.5,10,10),
    new THREE.MeshToonMaterial({color:'#3A9C75'})
)
sphere2.position.set(-1,0,0)
group.add(sphere2)


const geometry = new THREE.BoxGeometry(3.5, 0.2, 2)
const material = new THREE.MeshToonMaterial({ color: 0xf9b288 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
mesh.position.set(0,-1,0)

const axeshelper=new THREE.AxesHelper()
scene.add(axeshelper)
/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.lookAt(group.position)
scene.add(camera)

const light =new THREE.DirectionalLight({color:'white',intensity:1})
scene.add(light)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)