// Essentials
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// Utils
import { auth } from '../utils/discordAuth'
import { getPlayer } from '../utils/getPlayer'
import { createPlayer } from '../utils/createPlayer'
import { updatePlayer } from '../utils/updatePlayer'
import setCookie from '../utils/setCookie'

export default function Home() {
    const { query } = useRouter()
    const code = query.code
    var userData = {
        message: 'loading'
    }

    useEffect(() => {
        setCookie('userID', undefined)
    })
    
	return (
		<div>
            <Head>
                <title>Typer</title>
                <meta name="description" content="Ranked typing test." />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"></link>
            </Head>

            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                        <img src="/TyperLogoTransparentCropped.png" alt="Typer: Ranked typing test game." style={{minHeight: 45}} />
                    </a>

                    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    </a>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-start">
                        <a className="navbar-item" href='/'>
                            Home
                        </a>
                        
                        <a className="navbar-item" href='https://discord.com/api/oauth2/authorize?client_id=919755258169786489&permissions=8&scope=bot%20applications.commands'>
                            <span className='icon-text'>
                                <span className='icon'>
                                    <i class="bi bi-discord"></i>
                                </span> 
                                <span>Invite Typer</span>
                            </span>
                        </a>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item" id="userAvatar">
                            <a className="button is-primary" href="https://discord.com/oauth2/authorize?response_type=code&client_id=919755258169786489&scope=identify&redirect_uri=http://typergame.herokuapp.com/connected">
                                <strong>Connect</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-body">
                    <p className="title">Succesfuly Signed Out!</p>
                    <br></br>
                </div>
            </section>
		</div>
	)
}
