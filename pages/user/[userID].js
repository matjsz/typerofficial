// Essentials
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import Link from 'next/link'

// Utils
import convertRankID from '../../utils/convertRankID'
import getCookie from '../../utils/getCookie'
import { getPlayer } from '../../utils/getPlayer'

var loadedLink = false

const initialState = {
    id: '',
    rankID: '',
    rank: '',
    rp: 0,
    username: '',
    discriminator: '',
    matchHistory: [],
    avatar: '',
    color: ''
}

class UserPage extends React.Component{
    state = initialState

    componentDidUpdate(){
        const getUserData = () => {
            getPlayer(this.props.userID).then((player) => {
                this.setState(prevProps => {
                    return {
                        id: player.id,
                        rankID: player.rankData.rankID,
                        rank: convertRankID(player.rankData.rankID),
                        rp: player.rankData.rankPoints,
                        username: player.username,
                        discriminator: player.discriminator,
                        avatar: player.avatar,
                        color: player.color,
                        matchHistory: player.matchHistory
                    }
                })
            })
        }

        if(!loadedLink){
            getUserData()
            loadedLink = true
        } else{
            const userAvatar = document.getElementById('userAvatar')
            
            if(getCookie('userID') != undefined && getCookie('userID') != ''){
                console.log(getCookie('userID'))
                getPlayer(getCookie('userID')).then((player) => {
                    if(player.id != 'Not Found'){
                        let avatarURL = `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}`
                        let profileURL = `/user/${player.id}`
                        userAvatar.innerHTML = `
                            <a href="${profileURL}">
                                <figure class='image' style='width: 30; height: 30'>
                                    <img src=${avatarURL} class='is-rounded'></img>
                                </figure>
                            </a>
                            <a href="/logout" class='button is-text has-text-danger ml-2'><i class="bi bi-box-arrow-right"></i></a>
                        `
                    }
                })
            }

            getPlayer(this.props.userID).then((player) => {
                if(player.id != 'Not Found'){
                    let avatarURL = `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}`
                    let profileURL = `/user/${player.id}`

                    //---
                    const userUI = document.getElementById('userUI')
                    const playerRank = document.getElementById('playerRank')
                    const matchHistory = document.getElementById('matchHistoryDeploy')
                    
                    try{
                        userUI.style.backgroundColor = `#${this.state.color.toString(16)}`
                    } catch{
                        userUI.style.backgroundColor = `#7b01c2`
                    }

                    try{
                        playerRank.src = `/${this.state.rank.split(' ')[0]}.png`
                    } catch{
                        playerRank.src = ``
                    }

                    //--- Match History
                    try{
                        var matchs = player.matchHistory.reverse().slice(0, 10)

                        for(let i=0; i<matchs.length; i++){
                            let thisMatch = `
                                <tr>
                                    <td>${matchs[i].won ? '<i class="bi bi-check-lg" style="color: green"></i>': '<i class="bi bi-x-lg" style="color: red"></i>'}</td>
                                    <td><a href="/match/${matchs[i].id}">${player.username} <span class='tag is-danger is-light'>VS</span> ${matchs[i].versus} <span class='tag is-info'>${matchs[i].timestamp.toDate().getDate()}/${matchs[i].timestamp.toDate().getMonth()+1}/${matchs[i].timestamp.toDate().getFullYear()}, ${matchs[i].timestamp.toDate().getHours()}:${matchs[i].timestamp.toDate().getMinutes()}</span></a></td>
                                    <td>${matchs[i].won ? '+'+matchs[i].points : '-'+matchs[i].points}</td>
                                    <td>${matchs[i].situation == 'promoted' ? '<i class="bi bi-arrow-up"></i>' : matchs[i].situation == 'demoted' ? '<i class="bi bi-arrow-down"></i>' : '<i class="bi bi-dash-lg"></i>'}</td>
                                </tr>
                            `
                            matchHistory.insertAdjacentHTML('beforeend', thisMatch)
                        }
                    } catch(e){
                        console.log(e)
                    }
                }
            })
        }
    }

    render(){
        return (
            <div>
                <Head>
                    <title>Player | {this.state.username}</title>
                    <meta content='Player Profile' property="og:title" />
                    <meta content="Typer is a rank-based typing test game where you can challenge your friends and climb the ranked leaderboard." property="og:description" />
                    <meta content="https://typer-web.herokuapp.com/" property="og:url" />
                    <meta content="/TyperLogoTransparent.png" property="og:image" />
                    <meta content="#7b01c2" data-react-helmet="true" name="theme-color" />
                    <meta name="author" content="matjs" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                    <link rel="icon" href="/TyperIco.png" />
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"></link>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"></link>
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

                <div className="block" id="userUI" style={{minHeight: '100vh', paddingTop: '3rem'}}>
                    <div className='is-flex is-flex-direction-row has-background-light ml-6 mr-6'>
                        <div className='is-flex is-flex-direction-column m-6' style={{marginTop: '2rem'}} id="userInformation">
                            <div className='is-flex is-flex-direction-row' style={{minWidth: '100%'}}>
                                <figure className='image is-128x128'>
                                    <img className="is-rounded" src={`https://cdn.discordapp.com/avatars/${this.state.id}/${this.state.avatar}`}></img>
                                </figure>
                                <p className='has-text-weight-bold ml-4' style={{marginTop: '4rem'}}>{this.state.username}<span className='has-text-weight-light'>#{this.state.discriminator}</span></p>

                                <div className='is-flex is-flex-direction-row ml-6'>
                                    <figure className='image is-128x128'>
                                        <img id="playerRank"></img>
                                    </figure>
                                    <p className='is-size-3 has-font-weight-bold'>{this.state.rank}</p>
                                    <p className='ml-3'>({this.state.rp} RP)</p>
                                </div>
                            </div>

                            <p className='is-size-3 mt-6 mb-3'>Match History</p>

                            <div>
                                <table className="table" style={{minWidth: '85vw'}}>
                                    <thead>
                                        <tr>
                                            <th><i className="bi bi-trophy-fill" style={{color: '#ffd21f'}}></i></th>
                                            <th>Match</th>
                                            <th>RP</th>
                                            <th><i className="bi bi-bar-chart-line-fill"></i></th>
                                        </tr>
                                    </thead>
                                    <tbody id="matchHistoryDeploy">
                                        {/* Match History Here */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='block'>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default function User() {
    const router = useRouter()
    const { userID } = router.query

	return (
		<UserPage userID={userID}/>
	)
}