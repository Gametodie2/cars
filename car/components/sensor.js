class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;
    this.rayOffset = 0;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }

  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((e) => e.offset == minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) +
        this.car.angle +
        this.rayOffset;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  draw(ctx, dot = false, line = true) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }

      if (!dot) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "yellow";
        ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      } else {
        if (line) {
          const alpha = Math.min(
            1,
            Math.max(0.1, 1 - distance(this.rays[i][0], end) / this.rayLength)
          );
          ctx.beginPath();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = "white"; //"blue";
          ctx.strokeStyle = dot;
          ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.globalAlpha = 1;
          ctx.strokeStyle = "#555";
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
          ctx.stroke();
          ctx.strokeStyle = dot;
          ctx.lineWidth = 5;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(end.x, end.y, 2, 0, Math.PI * 2);

          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          if (this.readings[i]) {
            const alpha = Math.min(
              1,
              Math.max(0.1, 1 - distance(this.rays[i][0], end) / this.rayLength)
            );
            ctx.beginPath();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = "white"; //"blue";
            ctx.strokeStyle = dot;
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.strokeStyle = dot;
            ctx.lineWidth = 5;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(end.x, end.y, 2, 0, Math.PI * 2);

            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }
  }
}
