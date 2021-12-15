import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore';

const createPlayer = async(id, userData) => {
    await setDoc(doc(db, 'players', id), {
        id: userData.id,
        avatar: userData.avatar,
        discriminator: userData.discriminator,
        color: userData.accent_color,
        locale: userData.locale,
        username: userData.username,
        matchHistory: [],
        rankData: {
            rankPoints: 0,
            rankID: 'bronze-1'
        },
    })

    return {
        id: userData.id,
        avatar: userData.avatar,
        discriminator: userData.discriminator,
        color: userData.accent_color,
        locale: userData.locale,
        username: userData.username,
        matchHistory: [],
        rankData: {
            rankPoints: 0,
            rankID: 'bronze-1'
        }
    }
}

export { createPlayer }