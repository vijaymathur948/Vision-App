import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "./firebase";

//  Create Operation
const handleCreate = async () => {
  await addDoc(collection(firestore, "todos"), {
    Subject,
    completed: false,
  });
};
// Read Operation
const handleRead = () => {
  const q = query(collection(firestore, "todos"));
  const unsub = onSnapshot(q, (querySnapshot) => {
    let todosArray = [];
    querySnapshot.forEach((doc) => {
      todosArray.push({ ...doc.data(), id: doc.id });
    });
  });
  return () => unsub();
};
//  Edit Operation
const handleEdit = async (todo, Subject) => {
  await updateDoc(doc(firestore, "todos", todo.id), { Subject: Subject });
};

//  Delete Operation
const handleDelete = async (id) => {
  await deleteDoc(doc(firestore, "todos", id));
};

//  get collection Name
const getCollectionName = (collectionName) => `${collectionName}_${userInfo?.email}`;
