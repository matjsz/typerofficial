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
    'legend': 0
}
const ranks = Object.keys(needToPromote)

const determineIfDemoted = (points) => {
    if(points <= 0){
        return true
    } else{
        return false
    }
}

const loseMatch = async(loserID, pointsLost, winnerUsername, matchID) => {
    const docRef = doc(db, 'players', loserID)
    const docSnap = await getDoc(docRef)

    if(determineIfDemoted(docSnap.data().rankData.rankPoints-pointsLost)){
        let actualRank = ranks.indexOf(docSnap.data().rankData.rankID)
        let nextRank = actualRank-1

        let oldPoints = docSnap.data().rankData.rankPoints

        if(actualRank == "grand-master" || actualRank == "legend"){
            await updateDoc(docRef, {
                matchHistory: arrayUnion({
                    won: false,
                    versus: winnerUsername,
                    id: matchID,
                    timestamp: new Date(),
                    points: pointsLost,
                    situation: 'demoted'
                }),
                rankData: {
                    rankPoints: 1000-(Math.abs(oldPoints-pointsLost)),
                    rankID: ranks[nextRank]
                }
            })
        } else{
            await updateDoc(docRef, {
                matchHistory: arrayUnion({
                    won: false,
                    versus: winnerUsername,
                    id: matchID,
                    timestamp: new Date(),
                    points: pointsLost,
                    situation: 'demoted'
                }),
                rankData: {
                    rankPoints: 100-(Math.abs(oldPoints-pointsLost)),
                    rankID: ranks[nextRank]
                }
            })
        }

        return true
    } else{
        await updateDoc(docRef, {
            matchHistory: arrayUnion({
                won: false,
                versus: winnerUsername,
                id: matchID,
                timestamp: new Date(),
                points: pointsLost,
                situation: 'neutral'
            }),
            rankData: {
                rankPoints: docSnap.data().rankData.rankPoints - parseInt(pointsLost),
                rankID: docSnap.data().rankData.rankID
            }
        })

        return false
    }
}

export { loseMatch }