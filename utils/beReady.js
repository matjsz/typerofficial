import { db } from './firebase'
import { doc, updateDoc } from 'firebase/firestore';

const beReady = async(matchID, player) => {
    const matchRef = doc(db, 'matchs', matchID)
    
    if(player == "player1"){
        await updateDoc(matchRef, {
            player1ready: true
        })
    } else{
        await updateDoc(matchRef, {
            player2ready: true
        })
    }
}

export { beReady }