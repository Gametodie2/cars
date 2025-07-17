const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const carCtx = carCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(100, 100, 30, 50);
car.draw(carCtx);

animate();

function animate() {
  car.update();

  carCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  car.draw(carCtx);

  carCtx.restore();
  requestAnimationFrame(animate);
}
