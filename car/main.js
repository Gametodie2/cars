const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];

// Load brain: try localStorage first, then fall back to bestbrain.json
let bestBrain;
if (localStorage.getItem("bestBrain")) {
  bestBrain = JSON.parse(localStorage.getItem("bestBrain"));
} else {
  // Assuming bestbrain.json is available in the same directory
  fetch("./assets/bestbrain.json")
    .then((response) => response.json())
    .then((data) => {
      bestBrain = data;
      for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(JSON.stringify(bestBrain)); // Deep copy
        if (i != 0) {
          NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
      }
    })
    .catch((error) => console.error("Error loading bestbrain.json:", error));
}

// Apply brain to cars if already loaded (localStorage case)
if (bestBrain) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(JSON.stringify(bestBrain)); // Deep copy
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
  // Reload bestbrain.json as fallback
  fetch("bestbrain.json")
    .then((response) => response.json())
    .then((data) => {
      bestBrain = data;
      for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(JSON.stringify(bestBrain)); // Deep copy
        if (i != 0) {
          NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
      }
    })
    .catch((error) => console.error("Error loading bestbrain.json:", error));
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
