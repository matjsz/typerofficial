import { db } from './firebase'
import { collection, getDocs, query } from 'firebase/firestore';

var players = []
var sortedPlayers = []
var rankToValue = {
    'legend': 0, 
    'grand-master': 1, 
    'master': 2,
    'diamond-4': 3, 
    'diamond-3': 4, 
    'diamond-2': 5, 
    'diamond-1': 6, 
    'platinum-4': 7, 
    'platinum-3': 8, 
    'platnium-2': 9, 
    'platinum-1': 10, 
    'gold-4': 11, 
    'gold-3': 12, 
    'gold-2': 13, 
    'gold-1': 14, 
    'silver-4': 15, 
    'silver-3': 16, 
    'silver-2': 17, 
    'silver-1': 18, 
    'bronze-4': 19, 
    'bronze-3': 20, 
    'bronze-2': 21, 
    'bronze-1': 22
}

const getPlayers = async(formated=true, queryFromFx) => {
    const playersRef = collection(db, 'players')
    const querySnap = await getDocs(playersRef)
    let i = 0

    if(formated){
        querySnap.forEach((player) => {
            if(i < 5){
                players.push(player.data())
                i++
            }
        })
    
        if(queryFromFx == 'rank'){
            players.sort((a, b) => (rankToValue[a.rankData.rankID] > rankToValue[b.rankData.rankID]) ? 1 : (rankToValue[a.rankData.rankID] == rankToValue[b.rankData.rankID]) ? ((a.rankData.rankPoints > b.rankData.rankPoints) ? -1 : 1) : -1)

            return players
        }
    } else{
        return querySnap
    }
}

export { getPlayers }