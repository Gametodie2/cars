const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const carCtx = carCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(100, 100, 30, 50);

animate();

function animate() {
  car.update(road.borders);

  carCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  car.draw(carCtx);

  road.draw(carCtx);
  car.draw(carCtx);

  carCtx.restore();
  requestAnimationFrame(animate);
}
