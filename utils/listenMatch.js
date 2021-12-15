import { db } from './firebase'
import { doc, onSnapshot } from 'firebase/firestore';

const listenMatch = async(matchID, callback) => {
    const unsub = onSnapshot(doc(db, "matchs", matchID), (doc) => {
        callback()
    })
}

export { listenMatch }