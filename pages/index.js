// Essentials
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'

// Utils
import convertRankID from '../utils/convertRankID'
import getCookie from '../utils/getCookie'
import { getPlayer } from '../utils/getPlayer'
import { getPlayers } from '../utils/getPlayers'

class HomePage extends React.Component{
	componentDidMount(){
		const playersRanking = document.getElementById('playersRankingDeploy')

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

		getPlayers(true, 'rank').then((players) => {
			for(let i=0; i<players.length; i++){
				let data = `
					<tr>
						<th>${i+1}</th>
						<td><a href='/user/${players[i].id}'>${players[i].username}#<span class='has-text-weight-light'>${players[i].discriminator}</span></a></td>
						<td><img width=55 src='${convertRankID(players[i].rankData.rankID).split(' ')[0]}.png' /> <p style='margin-bottom: 0rem; margin-top: 0' class='has-text-weight-bold'>${convertRankID(players[i].rankData.rankID)}</p></td>
						<td>${players[i].rankData.rankPoints}</td>
					</tr>
				`
				playersRanking.insertAdjacentHTML('beforeend', data)
			}
		})

		const title = document.getElementById('landingHeaderTitle')
		const desc = document.getElementById('landingHeaderDescription')
		const text = 'The best typing game.'
		const text2 = 'Typer is a typing test game where you can play against other players and rank up on different leagues, just like any other competitive game.'
		const typeSpeed = 50
		let i = 0
		let i2 = 0

		const typeWriterTitle = () => {
			if(i<text.length){
				title.innerHTML += text.charAt(i)
				i++
				setTimeout(typeWriterTitle, typeSpeed)
			}
		}

		const typeWriterDesc = () => {
			if(i2<text2.length){
				desc.innerHTML += text2.charAt(i2)
				i2++
				setTimeout(typeWriterDesc, typeSpeed)
			}
		}

		typeWriterTitle()
		typeWriterDesc()
	}

	render(){
		return (
			<div>
				<Head>
					<title>Typer</title>
					<meta name="description" content="Ranked typing test game." />
					<link rel="icon" href="/TyperIco.png" />
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"></link>
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"></link>
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@creativebulma/bulma-divider@1.1.0/dist/bulma-divider.css"></link>
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
								<a className="button is-primary" href="https://discord.com/oauth2/authorize?response_type=code&client_id=919755258169786489&scope=identify&redirect_uri=http://typer-web.herokuapp.com/connected">
									<strong>Connect</strong>
								</a>
							</div>
						</div>
					</div>
				</nav>

				<div id="landingHeader" className='container is-flex is-flex-direction-row'>
					<img src='/TyperLogoTransparent.png' style={{width: '50%'}}></img>
					<div className='block'>
						<p className='block is-size-2 has-text-weight-bold' style={{marginTop: '13rem'}} id='landingHeaderTitle'></p>
						<p className='block is-size-4 has-text-weight-light' id="landingHeaderDescription"></p>
					</div>	
				</div>

				<div>
					<div class="divider">Ranking</div>
				</div>

				<div id="landingLeaderboard" className='container pb-6 pt-6'>
					<div class='columns'>
						<div className='column'>
							<p className='block is-size-2 has-text-weight-bold' style={{marginTop: '2rem'}} id='landingLeaderboardTitle'>Rank up!</p>
							<p className='block is-size-4 has-text-weight-light' id='landingLeaderboardDescription'>
								Play agaisnt other players and rank up on the leaderboard, you can go from Bronze I to Legend, all you need to do is type.<br/><br/>
								<div className='divider'>Discord BOT</div>
								<p className='block is-size-5'>
									Start climbing on the leaderboard by creating matches with Typer BOT.
								</p>
							</p>
							<a href='https://discord.com/api/oauth2/authorize?client_id=919755258169786489&permissions=8&scope=bot%20applications.commands' className='button is-info'>Invite BOT</a>
						</div>
						<div className='column'>
							<table class='table' style={{width: '100%'}}>
								<thead>
									<tr>
										<th>#</th>
										<th>
											<span className='icon-text'>
												<span className='icon'>
													<i class="bi bi-discord"></i>
												</span> 
												<span>Discord</span>
											</span>
										</th>
										<th>Rank</th>
										<th>RP</th>
									</tr>
								</thead>
								<tbody id="playersRankingDeploy"></tbody>
							</table>
						</div>
					</div>
				</div>

				<footer className='footer'>
                    <div className='content has-text-centered'>
                        <span className='has-text-weight-bold'>Typer</span> by <a href="https://twitter.com/matjs_">Matheus Silva (matjs)</a>. The source code is licensed by <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website is an indie project made by one person, if you want to support me, share the project with your friends!
                    </div>
                </footer>
			</div>
		)
	}
}

export default function Home() {
	return (
		<HomePage/>
	)
}
