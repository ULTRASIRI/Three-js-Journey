import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#e1d4c1'

}

const objectDistance = 4


/**
 * textures
 */
const textureLoader = new THREE.TextureLoader()

const gradientTexture = textureLoader.load('./textures/gradients/3.jpg')

gradientTexture.magFilter = THREE.NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



//material
const material = new THREE.MeshToonMaterial({color:parameters.materialColor,
    gradientMap:gradientTexture
})


const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4,16,60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    material

)
mesh1.position.y = -objectDistance*0
mesh2.position.y = -objectDistance*1
mesh3.position.y = -objectDistance*2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

scene.add(mesh1,mesh2,mesh3)


//group
const sectionMeshes = [mesh1,mesh2,mesh3]

//particles

const particlesCount = 200
const positions = new Float32Array (particlesCount*3)

for (let i=0; i< particlesCount ; i++)
{
    positions[i*3+0]= (Math.random()-0.5) *10
    positions[i*3+1]= objectDistance*0.5 - Math.random()*objectDistance * sectionMeshes.length
    positions[i*3+2]= Math.random()

}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))

const particlesMaterial = new THREE.PointsMaterial({
    color:parameters.materialColor,
    sizeAttenuation: true,
    size:0.03
})

const particles = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add(particles)



gui
    .addColor(parameters, 'materialColor')
    .onChange (()=>

        material.color.set(parameters.materialColor),
        particlesMaterial.color.set(parameters.materialColor)
    )

//light 
const directionalLight = new THREE.DirectionalLight('#ffffff',1)
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
 * parallex 
 * 3D like effect with mouse movement
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove',(event)=>
{
    cursor.x = event.clientX / sizes.width -0.5
    cursor.y = event.clientY / sizes.height -0.5

})



/**
 * Camera
 */
//camera group

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let scrollY = window.scrollY

/**
 * scroll animation
 */

let currentSection = 0


window.addEventListener('scroll',()=>
{
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY/sizes.height);

    if (newSection != currentSection)
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation , 
            {
                duration:1.5,
                ease : 'power2.inOut', //to slow down the start and end of rotation
                y: '+=3',
                x: '+=5',
                z: '+=1.5'
            }
        )
    }

})


//for different screens update speed of different (refresh rate)
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    for (const mesh of sectionMeshes)
        {
            mesh.rotation.x += deltaTime *0.1
            mesh.rotation.y += deltaTime *0.12
    
        }

    camera.position.y = -scrollY/ sizes.height * objectDistance


    const parallaxX = cursor.x *0.5
    const parallaxY = -cursor.y*0.5
    cameraGroup.position.x = (parallaxX - cameraGroup.position.x)*7*deltaTime
    cameraGroup.position.y = (parallaxY - cameraGroup.position.y)*7*deltaTime

    //animation 




    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()