////////////// CONSTANTS ///////////////
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight



const keys = {
   w: {
      pressed: false
   },
   a: {
      pressed: false
   },
   d: {
      pressed: false
   }
}
////////////// STATE VARIABLES ///////////////


////////////// CACHED ELEMENTS ///////////////

class Player {
   constructor({ position, velocity }) {
      this.position = position
      this.velocity = velocity
   }

   create() {

      ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2 , false)
      ctx.fillStyle = 'lawngreen'
      ctx.fill()
      // ctx.fillStyle = 'red'
      // ctx.fillRect(this.position.x, this.position.y, 200, 200)
      ctx.beginPath()
      ctx.moveTo(this.position.x +30, this.position.y)
      ctx.lineTo(this.position.x - 10, this.position.y - 10)
      ctx.lineTo(this.position.x - 10, this.position.y + 10)
      ctx.closePath()
      ctx.closePath()
      ctx.strokeStyle = 'goldenrod'
      ctx.stroke()
   }
   update() {
      this.create()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
   }
}

const player = new Player({ 
   position: { x: canvas.width / 2, y: canvas.height / 2 },
   velocity: { x: 0, y: 0 },
})

////////////// EVENT LISTENERS ///////////////
window.addEventListener('keydown', (event) => {
   switch (event.code) {
      case 'KeyW':
      console.log('KeyW')
      keys.w.pressed = true
      break
      case 'KeyA':
      console.log('KeyA')
      keys.a.pressed = true
      break
      case 'KeyD':
      console.log('KeyD')
      keys.d.pressed = true
      break
   }
   
})

////////////// FUNCTIONS ///////////////
function animate() {
   window.requestAnimationFrame(animate)

   ctx.fillStyle = 'black'
   ctx.fillRect(0, 0, canvas.width, canvas.height)

   player.update()

   if (keys.w.pressed) player.velocity.x = 1
}

animate()



