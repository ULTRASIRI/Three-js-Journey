import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { bufferAttribute, parameter } from 'three/tsl'

/**
 * Base
 */
// Debug
const gui = new GUI({width:244})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// /**
//  * Test cube
//  */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)


/**
 * particles
 */

const parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radious = 5
parameters.branches = 3
parameters.spin = 1.5
parameters.randomness = 0.5
parameters.randomPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'
parameters.rotationSpeed = 0.0005


let geometry=null
let material= null
let points= null

const galaxyGenerator = () =>
{
    if (points !== null){
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()
    
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)


    const colorOutside = new THREE.Color(parameters.outsideColor)
    const colorInside = new THREE.Color(parameters.insideColor)


    material = new THREE.PointsMaterial({
        size :parameters.size,
        depthWrite : false,
        sizeAttenuation: true,
        blending:THREE.AdditiveBlending,
        vertexColors : true
    })

    for (let i = 0 ; i<parameters.count;i++){
        const i3 = i*3

        const radious= parameters.radious *Math.random()
        const branchAngle = (i % parameters.branches)/parameters.branches * Math.PI * 2
        const spinAngle = radious* parameters.spin

        const randomX = Math.pow (Math.random() , parameters.randomPower) * (Math.random() <0.5 ? 1 : -1) * parameters.randomness * radious
        const randomY = Math.pow (Math.random() , parameters.randomPower) * (Math.random() <0.5 ? 1 : -1) * parameters.randomness * radious
        const randomZ = Math.pow (Math.random() , parameters.randomPower) * (Math.random() <0.5 ? 1 : -1) * parameters.randomness * radious


        positions [i3    ]=  Math.cos(branchAngle + spinAngle)  * radious + randomX
        positions [i3 + 1]= randomY
        positions [i3 + 2]= Math.sin(branchAngle + spinAngle ) * radious + randomZ



        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside , radious/parameters.radious)


        colors [i3   ]= mixedColor.r
        colors [i3+1 ]= mixedColor.g
        colors [i3+2 ]= mixedColor.b

    }

    geometry.setAttribute ('position' , new THREE.BufferAttribute (positions,3))
    geometry.setAttribute ('color' , new THREE.BufferAttribute (colors,3))


    points = new THREE.Points(geometry,material)
    scene.add(points)

}
galaxyGenerator()




gui.add (parameters,'count',100,100000,100).name('no. of stars').onFinishChange(galaxyGenerator)
gui.add (parameters,'size',0.01,1,0.01).name('size of stars').onFinishChange(galaxyGenerator)
gui.add (parameters,'radious',1,20,1).name('radious of galaxy').onFinishChange(galaxyGenerator)
gui.add (parameters,'branches',1,10,1).name('no. of branches').onFinishChange(galaxyGenerator)
gui.add (parameters,'spin',0,10,0.001).name('spin angle').onFinishChange(galaxyGenerator)
gui.add (parameters,'randomness',0,1,0.01).onFinishChange(galaxyGenerator)
gui.add (parameters,'randomPower',1,10,1).onFinishChange(galaxyGenerator)
gui.addColor (parameters,'insideColor').onFinishChange(galaxyGenerator)
gui.addColor (parameters,'outsideColor').onFinishChange(galaxyGenerator)

gui.add (parameters,'rotationSpeed',0.0005,0.01,0.0001).onFinishChange(galaxyGenerator)


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
camera.position.x = 3
camera.position.y = 3
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

    if (points) {
        points.rotation.y += parameters.rotationSpeed
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()