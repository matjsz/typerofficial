// link = https://discord.com/oauth2/authorize?response_type=code&client_id=919755258169786489&scope=identify&redirect_uri=http://localhost:3000/connected

import { db } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore';

const auth = async (code) => {
    var data = {
        'client_id': '919755258169786489',
        'client_secret': 'NGsEaC4G9-QqYAbabMYqLQxRuXeb4vdP',
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'http://localhost:3000/connected'
    }

    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: `client_id=919755258169786489&client_secret=NGsEaC4G9-QqYAbabMYqLQxRuXeb4vdP&grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/connected`
    }

    const apiResponse = await fetch('https://discord.com/api/v8/oauth2/token', options)
    const apiData = await apiResponse.json()
    
    var options2 = {
        method: 'GET',
        headers: {
            'Authorization': `${apiData.token_type} ${apiData.access_token}`
        }
    }
    
    const authResponse = await fetch('https://discord.com/api/v8/users/@me', options2) 
    const authData = await authResponse.json()

    return authData
}

export { auth }
