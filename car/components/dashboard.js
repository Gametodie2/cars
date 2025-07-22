class Dashboard {
  constructor(canvas, car, size) {
    this.canvas = canvas;
    this.car = car;
    this.size = size;

    this.ctx = canvas.getContext("2d");
  }

  update() {
    const TWO_PI = Math.PI * 2;
    const START_ANGLE = Math.PI * 0.7;
    const END_ANGLE = Math.PI * 1.3;
    const maxSpeed = 160;
    const majorTickInterval = 40;
    const minorTickInterval = 10;
    const angleRange = END_ANGLE - START_ANGLE;

    // Smooth speed to prevent needle jitter
    this.lastSpeed = this.lastSpeed || 0;
    const rawSpeed = isNaN(this.car.speed) ? 0 : this.car.speed * 3.6 * 10;
    const smoothedSpeed = this.lastSpeed * 0.8 + rawSpeed * 0.2;
    this.lastSpeed = smoothedSpeed;

    this.ctx.clearRect(0, 0, this.size, this.size);
    this.ctx.save();
    this.ctx.translate(this.size / 2, this.size / 2);

    // Draw dashboard background
    this.ctx.fillStyle = "rgb(20, 20, 20)";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.size / 2 - 7, 0, TWO_PI);
    this.ctx.fill();

    // Draw speedometer arc
    this.ctx.strokeStyle = "rgb(50, 50, 50)";
    this.ctx.lineWidth = 14;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.size / 2 - 21, START_ANGLE, END_ANGLE);
    this.ctx.stroke();

    // Draw ticks and labels
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    for (let speed = 0; speed <= maxSpeed; speed += minorTickInterval) {
      const angle = START_ANGLE + (speed / maxSpeed) * angleRange;
      this.ctx.save();
      this.ctx.rotate(angle);
      this.ctx.beginPath();
      if (speed % majorTickInterval === 0) {
        this.ctx.lineWidth = 1.5;
        this.ctx.moveTo(0, this.size / 2 - 35);
        this.ctx.lineTo(0, this.size / 2 - 21);
        this.ctx.stroke();
        this.ctx.font = "10px Arial";
        this.ctx.fillText(`${speed}`, 0, this.size / 2 - 42);
      } else {
        this.ctx.lineWidth = 0.7;
        this.ctx.moveTo(0, this.size / 2 - 28);
        this.ctx.lineTo(0, this.size / 2 - 21);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }

    // Draw speed needle
    const speed = Math.min(Math.max(smoothedSpeed, 0), maxSpeed);
    const needleAngle = START_ANGLE + (speed / maxSpeed) * angleRange;
    this.ctx.save();
    this.ctx.rotate(needleAngle);
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, this.size / 2 - 28);
    this.ctx.stroke();
    this.ctx.restore();

    // Draw center hub
    this.ctx.fillStyle = "silver";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 7, 0, TWO_PI);
    this.ctx.fill();

    // Draw text (speed, angle, fitness) inside circle
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.font = "14px Arial";
    this.ctx.fillText(`${Math.round(speed)} km/h`, 0, this.size / 2 - 56);
    this.ctx.font = "9px Arial";
    const angle = isNaN(this.car.angle)
      ? 0
      : Math.round((this.car.angle * 180) / Math.PI);
    this.ctx.fillText(`Angle: ${angle}°`, 0, this.size / 2 - 42);
    const fitness = isNaN(this.car.fittness)
      ? 0
      : Math.round(this.car.fittness) / 1000;
    this.ctx.fillText(`Fitness: ${fitness}`, 0, this.size / 2 - 32);

    this.ctx.restore();
  }
}
