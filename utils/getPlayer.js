import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore';

const getPlayer = async(id) => {
    const docRef = doc(db, 'players', id)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
        return docSnap.data()
    } else{
        return {id: 'Not Found', nickname: 'Not Found', rankData: { rankID: 'Not Found', rankPoints: 0 }}
    }
}

export { getPlayer }