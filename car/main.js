const carCanvas = document.getElementById("carCanvas");
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const carCtx = carCanvas.getContext("2d");
const car = new Car(100, 100, 30, 50);
car.draw(carCtx);

animate();

function animate() {
  carCtx.update();
  car.draw(ctx);
  requestAnimationFrame(animate);
}
