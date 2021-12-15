import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore';

const getMatch = async(id) => {
    const docRef = doc(db, 'matchs', id)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
        return docSnap.data()
    } else{
        return {player1: 'Not Found', player2: 'Not Found'}
    }
}

export { getMatch }