const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Peddle {
  constructor({ position }) {
    this.position = position;
    this.velocity = { x: 0, y: 0 };
    this.width = 10;
    this.height = 100;
    this.lastKey;
  }

  draw() {
    c.fillStyle = "white";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    // check for collision with boundaries
    if (
      this.position.y + this.velocity.y > 0 &&
      this.position.y + this.height + this.velocity.y < canvas.height
    )
      this.position.y += this.velocity.y;
  }
}

let counterRight = 0;
let counterLeft = 0;

class Ball {
  constructor({ position }) {
    this.position = position;
    const direction = {
      x: Math.random() - 0.5 >= 0 ? -2 : 2,
      y: Math.random() - 0.5 >= 0 ? -2 : 2,
    };
    this.velocity = { x: direction.x, y: direction.y };
    this.width = 10;
    this.height = 10;
  }

  draw() {
    c.fillStyle = "white";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.checkForGoal();

    const rightSide = this.position.x + this.width + this.velocity.x;
    const leftSide = this.position.x + this.velocity.x;
    const bottomSide = this.position.y + this.height;
    const topSide = this.position.y;

    // peddle 1 reflection
    if (
      leftSide <= peddle1.position.x + peddle1.width &&
      bottomSide >= peddle1.position.y &&
      topSide <= peddle1.position.y + peddle1.height
    )
      this.velocity.x = -this.velocity.x;

    // peddle 2 reflection
    if (
      rightSide >= peddle2.position.x &&
      bottomSide >= peddle2.position.y &&
      topSide <= peddle2.position.y + peddle2.height
    ) {
      this.velocity.x = -this.velocity.x;
    }

    // reflection from vertical boundaries
    if (
      this.position.y + this.height + this.velocity.y >= canvas.height ||
      this.position.y + this.velocity.y <= 0
    ) {
      this.velocity.y = -this.velocity.y;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  checkForGoal() {
    let goalLeft = false;
    let goalRight = false;

    if (this.position.x + this.width + this.velocity.x < 0) {
      this.velocity = { x: 0, y: 0 };
      goalRight = true;
    } else if (this.position.x + this.velocity.x > canvas.width) {
      this.velocity = { x: 0, y: 0 };
      goalLeft = true;
    }

    if (goalRight) {
      counterRight++;
      document.querySelector("#rightCounter").innerHTML = counterRight;
      document.querySelector('#goal').style.color = 'white'
    } else if (goalLeft) {
      counterLeft++;
      document.querySelector("#leftCounter").innerHTML = counterLeft;
      document.querySelector('#goal').style.color = 'white'
    }
  }
}

const ball = new Ball({
  position: {
    x: canvas.width / 2,
    y: canvas.height / 2,
  },
});

const peddle1 = new Peddle({
  position: {
    x: 10,
    y: 100,
  },
});

const peddle2 = new Peddle({
  position: {
    x: canvas.width - 10 * 2,
    y: 100,
  },
});

const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  peddle1.update();
  peddle2.update();
  ball.update();

  // peddle1 movement function
  peddle1.velocity.y = 0;
  if (keys.w.pressed && peddle1.lastKey === "w") {
    peddle1.velocity.y = -2;
  } else if (keys.s.pressed && peddle1.lastKey === "s") {
    peddle1.velocity.y = 2;
  }

  // peddle2 movement function
  peddle2.velocity.y = 0;
  if (keys.ArrowUp.pressed && peddle2.lastKey === "ArrowUp") {
    peddle2.velocity.y = -2;
  } else if (keys.ArrowDown.pressed && peddle2.lastKey === "ArrowDown") {
    peddle2.velocity.y = 2;
  }
}

animate();

window.addEventListener("keydown", (event) => {
  // peddle1 movement
  switch (event.key) {
    case "w":
    case "ц":
      keys.w.pressed = true;
      peddle1.lastKey = "w";
      break;
    case "s":
    case "ы":
      keys.s.pressed = true;
      peddle1.lastKey = "s";
      break;
  }

  // peddle2 movement
  switch (event.key) {
    case "ArrowUp":
      keys.ArrowUp.pressed = true;
      peddle2.lastKey = "ArrowUp";
      break;
    case "ArrowDown":
      keys.ArrowDown.pressed = true;
      peddle2.lastKey = "ArrowDown";
      break;
  }
});

window.addEventListener("keyup", (event) => {
  // peddel1 movement
  switch (event.key) {
    case "w":
    case "ц":
      keys.w.pressed = false;
      break;
    case "s":
    case "ы":
      keys.s.pressed = false;
      break;
  }

  // peddel2 movement
  switch (event.key) {
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
    case "ArrowDown":
      keys.ArrowDown.pressed = false;
      break;
  }
});
