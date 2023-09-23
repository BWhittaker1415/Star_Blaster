////////////// CONSTANTS ///////////////
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

ctx.fillStyle = 'black'
ctx.fillRect(0, 0, canvas.width, canvas.height)

////////////// STATE VARIABLES ///////////////


////////////// CACHED ELEMENTS ///////////////

class Player {
   constructor({ position, velocity }) {
      this.position = position
      this.velocity = velocity
   }

   create() {
      ctx.fillStyle = 'red'
      ctx.fillRect(200, 200, 200, 200)
   }
}

const player = new Player({ 
   position: { x: 0, y: 0 },
   velocity: { x: 0, y: 0 },
})

player.create()

////////////// EVENT LISTENERS ///////////////




////////////// FUNCTIONS ///////////////



console.log(canvas.fillRect);


