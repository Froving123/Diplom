const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/index");

const server = express();
const PORT = 5000;
server.use(cors());
server.use(bodyParser.json());
server.use("/api", router);

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

conn.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("db connected");
  }
});

server.listen(PORT, () => {
  console.log("server started");
});

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
