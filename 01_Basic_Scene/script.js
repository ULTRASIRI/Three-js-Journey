import * as THREE from 'three'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'

const canvas = document.querySelector('canvas.webgl')
//scene
const scene = new THREE.Scene()

//object
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({ color: "#FF8237" })
const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)

//camera
const sizes={
width:800,hight:600
}
const camera = new THREE.PerspectiveCamera(70,sizes.width/sizes.hight)
camera.position.z=3
scene.add(camera)

//renderer
const renderer = new THREE.WebGLRenderer({
canvas:canvas
})
renderer.setSize(sizes.width,sizes.hight)
renderer.render(scene,camera)