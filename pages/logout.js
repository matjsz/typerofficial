// Essentials
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Link from 'next/link'

// Utils
import { auth } from '../utils/discordAuth'
import { getPlayer } from '../utils/getPlayer'
import { createPlayer } from '../utils/createPlayer'
import { updatePlayer } from '../utils/updatePlayer'
import setCookie from '../utils/setCookie'

export default function Home() {
    useEffect(() => {
        setCookie('userID', undefined)
    })
    
	return (
		<div>
            <Head>
                <title>Typer</title>
                <meta name="description" content="Typer is a rank-based typing test game where you can challenge your friends and climb the leaderboard." />
                <meta name="keywords" contet="Typing Test, Ranked, Typing, Typer, Typing Game, Typing" />
                <meta name="author" content="matjs" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css" />
            </Head>

            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link href="/">
                        <a className="navbar-item">
                            <img src="/TyperLogoTransparentCropped.png" alt="Typer: Ranked typing test game." style={{maxHeight: 45}} />
                        </a>
                    </Link>

                    <Link href="#">
                        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </Link>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-start">
                        <Link href='/'>
                            <a className="navbar-item">Home</a>
                        </Link>
                        
                        <Link href='https://discord.com/api/oauth2/authorize?client_id=919755258169786489&permissions=8&scope=bot%20applications.commands'>
                            <a className="navbar-item">
                                <span className='icon-text'>
                                    <span className='icon'>
                                        <i className="bi bi-discord"></i>
                                    </span> 
                                    <span>Invite Typer</span>
                                </span>
                            </a>
                        </Link>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item" id="userAvatar">
                            <Link href="https://discord.com/oauth2/authorize?response_type=code&client_id=919755258169786489&scope=identify&redirect_uri=https://typer-web.herokuapp.com/connected">
                                <a className="button is-primary"><strong>Connect</strong></a>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-body">
                    <p className="title">Succesfuly Signed Out!</p>
                </div>
            </section>
		</div>
	)
}
