class Grid {
  constructor(rows, cols, ctx) {
    this.rows = rows;
    this.cols = cols;
    this.ctx = ctx;
    this.grid = [];
    this.keypoints = [];
    this.lerpFactor = 0.01;
    this.buildGrid();
  }
  buildGrid() {
    for (let j = 0; j < this.cols; j++) {
      for (let i = 0; i < this.rows; i++) {
        const line = new Line(i * 10, j * 10, this.ctx);
        this.grid.push(line);
      }
    }
  }


  update(poses) {
    try {
      if (this.keypoints.length == 0) {
        this.keypoints = poses[0].pose.keypoints;
      }
      for (const line of this.grid) {
        let smallest = null;
        let check_dist = 10000;
        for (let i = 0; i < 1; i++) {
          let pose = poses[i].pose;
          for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            if (keypoint.score > 0.2) {
              // smooth here
              this.keypoints[j].position.x = this.lerp(
                  this.keypoints[j].position.x, keypoint.position.x,
                  this.lerpFactor);
              this.keypoints[j].position.y = this.lerp(
                  this.keypoints[j].position.y, keypoint.position.y,
                  this.lerpFactor);


              const dist = Math.sqrt(
                  Math.pow(line.x - this.keypoints[j].position.x, 2) +
                  Math.pow(line.y - this.keypoints[j].position.y, 2));
              if (dist < check_dist) {
                smallest = line;
                check_dist = dist;
              }
            }
          }
        }
        const val = 1 - 10 / check_dist;
        smallest.angle = val * 180 / Math.PI;
      }
    } catch (error) {
      // console.log(error);
    }
  }



  draw() {
    for (const line of this.grid) {
      line.draw();
    }
  }

  lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
  }
}
