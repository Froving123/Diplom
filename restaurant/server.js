const express = require("express");
const mysql = require("mysql");
const cors = require("cors");


const server = express();
server.use(cors());

server.listen(3005, () => {
  console.log("Server started on port 3005");
});

server.get('/', (req, res) => {
    res.send('Server working')
})

//authForm
//import { auth } from "@/app/firebase";
//import { signInWithEmailAndPassword } from "firebase/auth";
//import { createUserWithEmailAndPassword } from "firebase/auth";

/*
DeliveryForm
import {
  ref,
  push,
  set,
  query,
  orderByChild,
  equalTo,
  onValue,
  update,
} from "firebase/database";
import { db, auth } from "../../firebase";


Delivery_menu
import { ref, push, set } from "firebase/database";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";


Delivery_user
import {
  ref,
  get,
  set,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";
import { db, auth } from "@/app/firebase";


Forma_feedback
import { onAuthStateChanged } from "firebase/auth";
import { ref, push, set } from "firebase/database";
import { auth, db } from "@/app/firebase";


Header.
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase";


ReservForm
import { ref, push, set } from "firebase/database";
import { db, auth } from "../../firebase";


Reservations
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { db, auth } from "@/app/firebase";


Shopping_cart
import {
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  remove,
  update,
} from "firebase/database";
import { db, auth } from "@/app/firebase";\


Shopping_cart_button.
import {
  ref,
  set,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";
 import { db, auth } from "@/app/firebase";


 Welcome
 import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase";


\AuthDetails
import { auth } from "@/app/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";*/