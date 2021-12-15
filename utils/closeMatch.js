import { db } from './firebase'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

const closeMatch = async(matchID, winner, loser, winnerPoints, loserPoints, winnerPromoted, loserDemoted) => {
    const matchRef = doc(db, 'matchs', matchID)
    
    await updateDoc(matchRef, {
        finished: true,
        winner: winner,
        loser: loser,
        winnerPoints: winnerPoints,
        loserPoints: loserPoints,
        winnerPromoted: winnerPromoted,
        loserDemoted: loserDemoted,
        timestamp: new Date()
    })
}

export { closeMatch }