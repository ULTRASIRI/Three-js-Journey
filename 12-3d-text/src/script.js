import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'
//import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//fontloader

const fontLoader =new FontLoader()
/**
 * Base
 */
// Debug
const gui = new GUI()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/4.png')
const axeshelper = new THREE.AxesHelper(5)
scene.add(axeshelper)

/**
text
 */
 fontLoader.load('fonts/helvetiker_regular.typeface.json'
     ,(font) =>
    {
        const textGeometry= new TextGeometry('H E L L O !',
            {
                font:font,
                size:0.5,
                depth:0.2,
                curveSegments:6,
                bevelEnabled:true,
                bevelThickness:0.03,
                bevelSize:0.02,
                bevelOffset:0,
                bevelSegments:5
            }
        )
        textGeometry.center()
        const material=  new THREE.MeshMatcapMaterial({matcap:matcapTexture}) 
        const text = new THREE.Mesh(textGeometry,material)
        text.scale.set(0.5,0.5,0.5)
        scene.add(text)
        //donuts
        const geometry = new THREE.TorusGeometry(.3,0.2,20,45)
        for (let i=0;i<200;i++)
            {
                const donut=new THREE.Mesh(geometry,material)
                donut.position.x=(Math.random()-0.5)*10
                donut.position.y=(Math.random()-0.5)*10
                donut.position.z=(Math.random()-0.5)*10
                //scale
                const scale=Math.random()
                donut.scale.set(scale,scale,scale)
                //rotation
                donut.rotation.x=Math.random()*Math.PI
                donut.rotation.y=Math.random()*Math.PI
                scene.add(donut)
            }
    }

)


/**
 * Object
 */






// const geometry = new THREE.Mesh(
//     new THREE.BufferGeometry(),
//     new THREE.MeshMatcapMaterial({matcap:matcapTexture})
// )

// scene.add(cube)











/**
 * light
 */
const ambientLight = new THREE.AmbientLight(0xffffff,1)
scene.add(ambientLight)







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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()