import { db } from './firebase'
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';

const needToPromote = {
    'bronze-1': 100,
    'bronze-2': 100,
    'bronze-3': 100,
    'bronze-4': 100,
    'silver-1': 200,
    'silver-2': 200,
    'silver-3': 200,
    'silver-4': 200,
    'gold-1': 300,
    'gold-2': 300,
    'gold-3': 300,
    'gold-4': 300,
    'platinum-1': 400,
    'platinum-2': 400,
    'platinum-3': 400,
    'platinum-4': 400,
    'diamond-1': 500,
    'diamond-2': 500,
    'diamond-3': 500,
    'diamond-4': 500,
    'master': 1000,
    'grand-master': 1000,
    'legend': null
}
const ranks = Object.keys(needToPromote)

const determineIfPromoted = (points, rankID) => {
    if(points >= needToPromote[rankID] && rankID != 'legend'){
        return true
    } else{
        return false
    }
}

const winMatch = async(winnerID, pointsEarned, loserUsername, matchID) => {
    const docRef = doc(db, 'players', winnerID)
    const docSnap = await getDoc(docRef)

    if(determineIfPromoted(docSnap.data().rankData.rankPoints+pointsEarned, docSnap.data().rankData.rankID)){
        let actualRank = ranks.indexOf(docSnap.data().rankData.rankID)
        let nextRank = actualRank+1

        await updateDoc(docRef, {
            matchHistory: arrayUnion({
                won: true,
                versus: loserUsername,
                id: matchID,
                timestamp: new Date(),
                points: pointsEarned,
                situation: 'promoted'
            }),
            rankData: {
                rankPoints: 0,
                rankID: ranks[nextRank]
            }
        })

        return true
    } else{
        await updateDoc(docRef, {
            matchHistory: arrayUnion({
                won: true,
                versus: loserUsername,
                id: matchID,
                timestamp: new Date(),
                points: pointsEarned,
                situation: 'neutral'
            }),
            rankData: {
                rankPoints: docSnap.data().rankData.rankPoints + parseInt(pointsEarned),
                rankID: docSnap.data().rankData.rankID
            }
        })

        return false
    }
}

export { winMatch }