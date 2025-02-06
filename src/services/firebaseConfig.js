import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAPmtcWg-vj5xGyU-MzU0B37ivbZUk5Z3o",
  authDomain: "friendapp-3336b.firebaseapp.com",
  projectId: "friendapp-3336b",
  storageBucket: "friendapp-3336b.firebasestorage.app",
  messagingSenderId: "345203936639",
  appId: "1:345203936639:web:78ee380ed04379550c9e4a",
  measurementId: "G-JY73YL3WG9"
};

const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);
