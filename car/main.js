const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const carCtx = carCanvas.getContext("2d");
const car = new Car(100, 100, 30, 50);
car.draw(carCtx);

animate();

function animate() {
  car.update();
  carCanvas.height = window.innerHeight;

  car.draw(carCtx);
  requestAnimationFrame(animate);
}
