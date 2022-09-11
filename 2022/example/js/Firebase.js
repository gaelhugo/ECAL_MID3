/*
   "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
   "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js"
   "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js"
*/

//FIREBASE
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onDisconnect,
} from "firebase/database";
import EventEmitter from "@onemorestudio/eventemitterjs";
export default class Firebase extends EventEmitter {
  constructor() {
    super();
    // Your web app's Firebase configuration
    const firebaseConfig = {};

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        // console.log("UID", this.uid);
      }
    });
    signInAnonymously(auth)
      .then(() => {
        console.log("signed in");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    this.DATABASE = getDatabase();
    console.log(this.DATABASE);
    //
    this.resume = false;
    //path
    const path = ref(this.DATABASE, `ELINA/COLUMN`);
    const path2 = ref(this.DATABASE, `ELINA/MOVE`);
    //
    onValue(path, (snapshot) => {
      if (!this.resume) {
        this.resume = true;
      } else {
        const val = snapshot.val();
        this.emit("dataReceived", [val]);
      }
    });

    onValue(path2, (snapshot) => {
      if (!this.resume1) {
        this.resume1 = true;
      } else {
        const val = snapshot.val();
        this.emit("move", [val]);
      }
    });
  }

  send(_path, _val) {
    const path = ref(this.DATABASE, _path);
    set(path, _val);
  }
}
