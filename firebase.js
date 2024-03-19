import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBkpp-gIOcj4mp9Bv3zqSN1kPJ6ZaEV9zs",
  authDomain: "find2-1d60b.firebaseapp.com",
  projectId: "find2-1d60b",
  storageBucket: "find2-1d60b.appspot.com",
  messagingSenderId: "502355170032",
  appId: "1:502355170032:web:94baf0bd37fa64d62e6835",
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


export { storage };
