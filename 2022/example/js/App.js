/**
CREATIVE CODING
---
Kill server : CTRL + C
Start server : npm run start
Start secure server : npm run start-https
Final build : npm run build
---
To generate new certificate for https connection with external device run :
#sh
mkcert 0.0.0.0 localhost 127.0.0.1 yourLocalIP ::1
mv 0.0.0.0+4-key.pem certificate.key
mv 0.0.0.0+4.pem certificate.cert
**/

import Playground from "@onemorestudio/playgroundjs";
import Case from "./Case";
import Firebase from "./Firebase";
export default class App extends Playground {
  constructor() {
    super();
    // const urlParameter = new URLSearchParams(window.location.search);
    // this.player = urlParameter.get("player");

    // blocked on left;
    const urlParameter = new URLSearchParams(window.location.search);
    this.player = urlParameter.get("player") || 1;
    this.uid = new Date().getTime();
    console.log("player:", this.player, this.uid);

    this.table = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.allCases = [];

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const mycase = new Case(
          (x * this.width) / 4,
          (y * this.height) / 4,
          this.width / 4,
          this.height / 4,
          this.allCases.length
        );
        mycase.state = this.table;
        this.allCases.push(mycase);
      }
    }
    this.ctx.strokeStyle = "black";
    // this.ctx.lineWidth = 2;

    console.table(this.table);
    this.handler = {
      keydown: this.onKeyDown.bind(this),
      ondata: this.onData.bind(this),
      onmove: this.onMove.bind(this),
    };
    document.addEventListener("keydown", this.handler.keydown);
    //
    this.FIREBASE = new Firebase();
    this.FIREBASE.addEventListener("dataReceived", this.handler.ondata);
    this.FIREBASE.addEventListener("move", this.handler.onmove);

    this.draw();
  }

  onMove(data) {
    if (data.uid != this.uid) {
      this.addNewRandomElement(true);
      this.updateCase("down");
    }
  }

  onData(data) {
    if (this.player == 1 && data.uid != this.uid) {
      console.log("DATA RECEIVED From right");
      this.moveToLeft(data.column);
    }

    if (this.player == 2 && data.uid != this.uid) {
      console.log("DATA RECEIVED From left");
      this.moveToRight(data.column);
    }
    console.table(this.table);
  }

  onKeyDown(e) {
    switch (e.key) {
      case "ArrowDown":
        this.addNewRandomElement();
        this.updateCase("down");
        break;
      case "ArrowUp":
        break;
      case "ArrowLeft":
        this.moveToLeft();
        this.updateCase("left");
        break;
      case "ArrowRight":
        this.moveToRight();
        this.updateCase("right");
        break;
    }
    console.table(this.table);
  }

  updateCase(direction) {
    this.allCases.forEach((c) => {
      c.state = this.table;
      c.direction = direction;
    });
  }

  addNewRandomElement(remote = false) {
    // ↓
    //check from bottom to top

    //pick a random col
    const col = Math.floor(Math.random() * 4);
    //pick a random number out of 2
    const val = Math.random() < 0.5 ? 1 : 2;

    // check every column, starting from the left
    for (let j = 0; j < 4; j++) {
      //check for every line, starting from the bottom
      for (let i = 3; i >= 0; i--) {
        if (i == 3 && this.table[i][j] == this.table[i - 1][j]) {
          this.table[i][j] =
            this.table[i][j] == 1 ? 2 : this.table[i - 1][j] == 0 ? 0 : 1;
          this.table[i - 1][j] = 0;
        } else if (i > 0 && this.table[i][j] == 0) {
          this.table[i][j] = this.table[i - 1][j];
          this.table[i - 1][j] = 0;
        } else if (i > 0 && this.table[i][j] != 0) {
          if (this.table[i][j] == this.table[i - 1][j]) {
            this.table[i][j] = this.table[i][j] == 1 ? 2 : 1;
            this.table[i - 1][j] = 0;
          }
        } else if (i == 0 && this.table[i][j] == 0 && col == j) {
          this.table[i][j] = val;
        } else if (i == 0 && this.table[i][j] == 0 && col != j) {
          this.table[i][j] = 0;
        } else if (i == 0 && this.table[i][j] != 0 && col == j) {
          alert("loosing game");
        }
      }
    }

    if (!remote)
      // Simply send the info that a down move has been done
      this.FIREBASE.send("ELINA/MOVE", {
        uid: this.uid,
        time: new Date().getTime(),
      });
  }

  moveToLeft(column = null) {
    //←
    //check from left to right
    // ASSUMING WE ARE THE PLAYER TO THE LEFT  ---> NO CALL TO FIREBASE

    if (this.player == 2) {
      //--->send to firebase the actual last column
      const lastColumn = [];
      this.table.forEach((line) => {
        lastColumn.push(line[0]);
      });

      console.log("SEND TO FIREBASE", lastColumn);
      this.FIREBASE.send("ELINA/COLUMN", {
        column: lastColumn,
        uid: this.uid,
        time: new Date().getTime(),
      });

      // check every column, starting from the right
      for (let j = 0; j < 4; j++) {
        //check for every line, starting from the bottom
        for (let i = 3; i >= 0; i--) {
          if (j > 0) {
            this.table[i][j - 1] = this.table[i][j];

            if (j == 3) {
              // number BY DEFAULT
              // CHECK IF NEEDS TO BE RANDOMIZE TOO
              this.table[i][j] = 0;
            }
          }
        }
      }
    } else {
      // check every column, starting from the left
      for (let j = 0; j < 4; j++) {
        //check for every line, starting from the bottom
        for (let i = 3; i >= 0; i--) {
          if (j == 0 && this.table[i][j] == this.table[i][j + 1]) {
            this.table[i][j] =
              this.table[i][j + 1] == 1 ? 2 : this.table[i][j + 1] == 0 ? 0 : 1;
            this.table[i][j + 1] = 0;
          } else if (j >= 0 && j < 3 && this.table[i][j] == 0) {
            this.table[i][j] = this.table[i][j + 1];
            this.table[i][j + 1] = 0;
          } else if (j >= 0 && j < 3 && this.table[i][j] != 0) {
            if (this.table[i][j] == this.table[i][j + 1]) {
              this.table[i][j] = this.table[i][j] == 1 ? 2 : 1;
              this.table[i][j + 1] = 0;
            }
          } else if (j == 3) {
            this.table[i][j] = column ? column[i] : 0;
          }
        }
      }
    }
  }

  moveToRight(column = null) {
    //→
    //check from left to right
    // ASSUMING WE ARE THE PLAYER TO THE LEFT  ---> CALL TO FIREBASE to send new value

    if (this.player == 1) {
      //--->send to firebase the actual last column
      const lastColumn = [];
      this.table.forEach((line) => {
        lastColumn.push(line[3]);
      });

      console.log("SEND TO FIREBASE", lastColumn);
      this.FIREBASE.send("ELINA/COLUMN", {
        column: lastColumn,
        uid: this.uid,
        time: new Date().getTime(),
      });

      // check every column, starting from the left
      for (let j = 3; j >= 0; j--) {
        //check for every line, starting from the bottom
        for (let i = 3; i >= 0; i--) {
          this.table[i][j] = this.table[i][j - 1];
          if (j == 0) {
            // number BY DEFAULT
            // CHECK IF NEEDS TO BE RANDOMIZE TOO
            this.table[i][j] = 0;
          }
        }
      }
    } else {
      // check every column, starting from the right
      for (let j = 3; j >= 0; j--) {
        //check for every line, starting from the bottom
        for (let i = 3; i >= 0; i--) {
          if (j == 3 && this.table[i][j] == this.table[i][j - 1]) {
            this.table[i][j] =
              this.table[i][j - 1] == 1 ? 2 : this.table[i][j - 1] == 0 ? 0 : 1;
            this.table[i][j - 1] = 0;
          } else if (j <= 3 && j > 0 && this.table[i][j] == 0) {
            this.table[i][j] = this.table[i][j - 1];
            this.table[i][j - 1] = 0;
          } else if (j <= 3 && j > 0 && this.table[i][j] != 0) {
            if (this.table[i][j] == this.table[i][j - 1]) {
              this.table[i][j] = this.table[i][j] == 1 ? 2 : 1;
              this.table[i][j - 1] = 0;
            }
          } else if (j == 0) {
            this.table[i][j] = column ? column[i] : 0;
          }
        }
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.allCases.forEach((c) => {
      c.draw(this.ctx);
    });
    requestAnimationFrame(this.draw.bind(this));
  }
}
