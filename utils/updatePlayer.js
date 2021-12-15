import { db } from './firebase'
import { doc, updateDoc } from 'firebase/firestore';

const updatePlayer = async(id, userData) => {
    await updateDoc(doc(db, 'players', id), {
        id: userData.id,
        avatar: userData.avatar,
        discriminator: userData.discriminator,
        color: userData.accent_color,
        locale: userData.locale,
        username: userData.username
    })

    return {
        id: userData.id,
        avatar: userData.avatar,
        discriminator: userData.discriminator,
        color: userData.accent_color,
        locale: userData.locale,
        username: userData.username
    }
}

export { updatePlayer }