import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyBaW28sy6-fgim6uQ2KatPL62iVtTcDLXo",
  authDomain: "bookify-f34f0.firebaseapp.com",
  projectId: "bookify-f34f0",
  storageBucket: "bookify-f34f0.firebasestorage.app",
  messagingSenderId: "188845976452",
  appId: "1:188845976452:web:726de6ee212baee3574bd1"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
export{firebaseAuth};
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else setUser(null);
    });
    return () => unsubscribe(); 
  }, []);

  const signupUserWithEmailAndPassword = (email, password) =>
    createUserWithEmailAndPassword(firebaseAuth, email, password);

  const signinUserWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(firebaseAuth, email, password);

  const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider);

  const createSellListing = async (name, isbn, price, cover) => {
    const imageRef = ref(storage, `uploads/images/${Date.now()}-${cover.name}`);
    const uploadResult = await uploadBytes(imageRef, cover);
    const imageURL = uploadResult.ref.fullPath;
    return await addDoc(collection(firestore, 'books'), {
      name,
      isbn,
      price,
      imageURL: uploadResult.ref.fullPath,
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  };

  const listAllBooks = () => {
    return getDocs(collection(firestore, "books"));
  };

  const getBookById = async (id) => {
    const docRef = doc(firestore, "books", id);
    const result = await getDoc(docRef);
    return result;
  };

  const getImageURL = (path) => {
    return getDownloadURL(ref(storage, path));
  };

  const addToCart = async (book) => {
    if (!user) return;

    const cartRef = collection(firestore, "users", user.uid, "cart");
    await addDoc(cartRef, book);
  };

  const fetchMyBooks = async (userId) => {
    const collectionRef = collection(firestore, "books");
    const q = query(collectionRef, where("userID", "==", userId)); 
    const result = await getDocs(q);
    return result;
  };

  const getOrders = async (bookId) => {
    const collectionRef = collection(firestore, "books", bookId, "order");
    const result = await getDocs(collectionRef);
    return result;
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth); 
      navigate("/"); 
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };
  const placeOrder = async (bookId, qty) => {
    if (!user) return;
  
    const orderRef = collection(firestore, "books", bookId, "order");
    return await addDoc(orderRef, {
      qty,
      userEmail: user.email,
      displayName: user.displayName,
      createdAt: new Date(),
    });
  };
  

  const isLoggedIn = user ? true : false;

  return (
    <FirebaseContext.Provider
      value={{
        signinWithGoogle,
        signupUserWithEmailAndPassword,
        signinUserWithEmailAndPassword,
        createSellListing,
        listAllBooks,
        getImageURL,
        getBookById,
        getOrders,
        addToCart,
        fetchMyBooks,
        placeOrder,
        logout,
        isLoggedIn,
        user,
        firestore, 
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};




