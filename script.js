////////////// GLOBAL CONSTANTS ///////////////
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight
const speed = 5
const rotationSpeed = 0.09
const friction = 0.98
const laserSpeed = 5
const asteroids = []
const lasers = []
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
const a = 2 * Math.PI / 6
const r = 50

////////////// INTERVALS ///////////////
window.setInterval(() => {
   const index = Math.floor(Math.random() * 4)
   let x, y
   let vx, vy
   let radius = 50 * Math.random() + 10
   switch (index) {
      case 0: //left side of the screen
         x = 0 - radius
         y = Math.random() * canvas.height
         vx = 1
         vy = 0
         break
      case 1: //bottom side of the screen
         x = Math.random() * canvas.width
         y = canvas.height + radius
         vx = 0
         vy = -1
         break
      case 2: //right side of the screen
         x = canvas.width + radius
         y = Math.random() * canvas.height
         vx = -1
         vy = 0
         break
      case 3: //top side of the screen
         x = Math.random() * canvas.width
         y = 0 - radius
         vx = 0
         vy = 1
         break
   }
   asteroids.push(
      new Asteroid({
         position: {
            x: x,
            y: y,
         },
         velocity: {
            x: vx,
            y: vy,
         },
         radius,
      })
   )
}, 3000)

////////////// PLAYER: CREATION / MOVEMENT ///////////////
class Player {
   constructor({ position, velocity }) {
      this.position = position
      this.velocity = velocity
      this.rotation = 0
   }

   create() {
      ctx.save()
      ctx.translate(this.position.x, this.position.y)
      ctx.rotate(this.rotation)
      ctx.translate(-this.position.x, -this.position.y)             
      ctx.beginPath()
      ctx.moveTo(this.position.x +40, this.position.y)
      ctx.lineTo(this.position.x - 12, this.position.y - 20)
      ctx.lineTo(this.position.x - 12, this.position.y + 20)
      ctx.closePath()      
      ctx.fillStyle = 'yellow'
      ctx.fill() 
      ctx.restore()      
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

////////////// LASERS: CREATION / MOVEMENT ///////////////
class Laser {
   constructor({position, velocity}) {
      this.position = position
      this.velocity = velocity
      this.radius = 3
   }
   create() {
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
      ctx.fillStyle = 'lightblue'
      ctx.fill()
      ctx.closePath()
   }
   update() {
      this.create()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
   }
}

////////////// ASTEROIDS: CREATION / MOVEMENT ///////////////
class Asteroid {
   constructor({position, velocity, radius}) {
      this.position = position
      this.velocity = velocity
      this.radius = radius
   }
   create(x, y) {
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
      // for (let i = 0; i < 6; i++) {
      //    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i))
      // }
      ctx.closePath()
      ctx.strokeStyle = 'lawngreen'
      ctx.stroke()
   }
   update() {
      this.create()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
   }
}
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
      case 'Space':
         lasers.push(new Laser({
            position: {
               x: player.position.x + Math.cos(player.rotation) * 30,
               y: player.position.y + Math.sin(player.rotation) * 30,
            },
            velocity: {
               x: Math.cos(player.rotation) * laserSpeed,
               y: Math.sin(player.rotation) * laserSpeed,
            },
         })
         )
         break
   }
   
})
window.addEventListener('keyup', (event) => {
   switch (event.code) {
      case 'KeyW':
      console.log('KeyW')
      keys.w.pressed = false
      break
      case 'KeyA':
      console.log('KeyA')
      keys.a.pressed = false
      break
      case 'KeyD':
      console.log('KeyD')
      keys.d.pressed = false
      break
   }
   
})

////////////// ANIMATIONS & FUNCTIONS ///////////////
function objectHit(object1, object2) {
   const xDifference = object2.position.x - object1.position.x
   const yDifference = object2.position.y - object1.position.y

   const distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference)

   if (distance <= object1.radius + object2.radius) {
      return true
   }
   return false
}
function animate() {
   window.requestAnimationFrame(animate)

   ctx.fillStyle = 'black'
   ctx.fillRect(0, 0, canvas.width, canvas.height)

   player.update()

      for (let i = lasers.length - 1; i >= 0; i--) {
         const laser = lasers[i]
         laser.update()

         if (laser.position.x + laser.radius < 0 || 
            laser.position.x - laser.radius > canvas.width || 
            laser.position.y + laser.radius < 0 ||
            laser.position.y - laser.radius > canvas.height) {
            lasers.splice(i, 1)
         }
      }
     
      for (let i = asteroids.length - 1; i >= 0; i--) {
         const asteroid = asteroids[i]
         asteroid.update()

         if (asteroid.position.x + asteroid.radius < 0 || 
            asteroid.position.x - asteroid.radius > canvas.width || 
            asteroid.position.y + asteroid.radius < 0 ||
            asteroid.position.y - asteroid.radius > canvas.height) {
            asteroids.splice(i, 1)
         }
         for (let m = lasers.length - 1; m >= 0; m--) {
            const laser = lasers[m]

            if (objectHit(asteroid, laser)) {
               asteroids.splice(i, 1)
               lasers.splice(m, 1)
            }
         }
      }

   if (keys.w.pressed) {
      player.velocity.x = Math.cos(player.rotation) * speed
      player.velocity.y = Math.sin(player.rotation) * speed
   } else if (!keys.w.pressed) {
      player.velocity.x *= friction
      player.velocity.y *= friction
   }
   if (keys.d.pressed) player.rotation += rotationSpeed
   else if (keys.a.pressed) player.rotation -= rotationSpeed
}

animate()

///////////// Things still to Do ////////////////
// Big asteroids should split and shrink.

// Game Over function to trigger Game Over screen.

// Make Asteroids more complex is shape.

// Make Asteroids come onto screen in random directions.

// Design ship.

// Add thruster effect to the ship.

// Add Space background.

// Brighter colors.

// Add Score counter.

// Make and link Title, Leaderboards and Game Over screens.

// Duplicate JS code and adjust speeds, intervals and sizes for Hard Mode.