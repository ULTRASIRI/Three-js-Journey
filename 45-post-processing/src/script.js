import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { uniform } from 'three/tsl'
// import { Value } from 'three/examples/jsm/inspector/ui/Values.js'


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
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
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

    //update effectComposer
    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * postProcessing 
 */
//antialias
const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600,
    {
        samples:renderer.getPixelRatio() === 1 ? 2 : 0   //if it is 1 then do 2 otherwise 0
    },
)
//effect composer
const effectComposer = new EffectComposer(renderer,renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width,sizes.height )
//renderPass
const renderPass = new RenderPass(scene,camera)
effectComposer.addPass(renderPass)
//colorCorrection
const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammaCorrectionShader) //this is to improve colors of effectComposer like sRGBEncding in renderer; but i think it dosent work anymore


//dotScreenPass
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled=false
effectComposer.addPass(dotScreenPass)
gui.add(dotScreenPass, 'enabled').name('dotScreenPass')
 
//glitchPass
const glitchPass = new GlitchPass()
glitchPass.goWild= false //this shit is too much
glitchPass.enabled=false
effectComposer.addPass(glitchPass)
gui.add(glitchPass, 'enabled').name('glitchPass')

//rgbShaderPass
const rgbShaderPass = new ShaderPass(RGBShiftShader)
rgbShaderPass.enabled=false
effectComposer.addPass(rgbShaderPass)
gui.add(rgbShaderPass, 'enabled').name('rgbShaderPass')

//unrealBloomPass
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled=false
unrealBloomPass.strength= 0.3   //strength how strog brightness is
unrealBloomPass.radius=  1      //spread of glow
unrealBloomPass.threshold= 0.6  //lesser threshold more glow
effectComposer.addPass(unrealBloomPass)
gui.add(unrealBloomPass, 'enabled').name('unrealBloomPass')
gui.add(unrealBloomPass,'strength',0,2,0.001).name('unrealBloomPass strength')
gui.add(unrealBloomPass,'radius',0,2,0.001).name('unrealBloomPass radius')
gui.add(unrealBloomPass,'threshold',0,2,0.001).name('unrealBloomPass threshold')


/**
 * custom pass
 */
//tint pass

const TintShader = {
    uniforms:
    {
        tDiffuse: {value:null},
        uTint: {value:new THREE.Vector3(0, 0, 0)},
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;

        varying vec2 vUv;
        void main() {
            vec4 color = texture2D (tDiffuse, vUv);
            color.rgb += uTint;
            gl_FragColor = color;
        }
    `
}
//tintpass
const tintpass = new ShaderPass(TintShader)
tintpass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintpass)
gui.add(tintpass.material.uniforms.uTint.value, 'x',-0.5,0.5,0.001).name('red')
gui.add(tintpass.material.uniforms.uTint.value, 'y',-0.5,0.5,0.001).name('green')
gui.add(tintpass.material.uniforms.uTint.value, 'z',-0.5,0.5,0.001).name('blue')


//displacement pass

// const DisplacementShader = {
//     uniforms:
//     {
//         tDiffuse: {value:null},
//         uTime:{value:0}
//     },
//     vertexShader: `
//         varying vec2 vUv;
//         void main() {
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//             vUv = uv;
//         }
//     `,
//     fragmentShader: `
//         uniform sampler2D tDiffuse;
//         uniform float uTime;
//         varying vec2 vUv;


//         void main() {
//             vec2 newUv = vec2(
//             vUv.x,
//             vUv.y + sin(vUv.x * 10.0+uTime) *0.1
//             );
//             vec4 color = texture2D (tDiffuse, newUv);
//             gl_FragColor = color;
//         }
//     `
// }

const DisplacementShader = {
    uniforms:
    {
        tDiffuse: {value:null},
        uNormalMap: {value:null}

    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;
        varying vec2 vUv;

        void main() {
            vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
            vec2 newUv = vUv + normalColor.xy * 0.2;
            vec4 color = texture2D(tDiffuse, newUv);
    
            vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
            color.rgb += lightness * 2.0;
            gl_FragColor = color;
        }
    `
}

const displacementpass = new ShaderPass(DisplacementShader)
// displacementpass.material.uniforms.uTime.value=0
displacementpass.material.uniforms.uNormalMap.value = textureLoader.load('./textures/interfaceNormalMap.png')
displacementpass.enabled=false
effectComposer.addPass(displacementpass)
gui.add(displacementpass,'enabled').name('displacementpass')




//////////// try to avoid adding more and more passes as much as you can

//SMAAPass for anti alias  
//always add after all passes
if (renderer.getPixelRatio()=== 1 && ! renderer.capabilities.isWebGL2)
{
    const smaaPass = new SMAAPass()
    effectComposer.addPass(smaaPass)
    console.log('using SMAA')
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    // displacementpass.material.uniforms.uTime.value = elapsedTime

    // Render
    // renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()