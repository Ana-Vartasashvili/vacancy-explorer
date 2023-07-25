import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment.development';

const firebaseConfig = environment.firebaseConfig;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
