// Essentials
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import Link from 'next/link'

// Components
import Preview from '../../components/Preview'
import Speed from '../../components/Speed'

// Utils
import getText from '../../utils/getText'
import convertRankID from '../../utils/convertRankID'
import getCookie from '../../utils/getCookie'
import { getPlayer } from '../../utils/getPlayer'
import { getMatch } from '../../utils/getMatch'
import { winMatch } from '../../utils/winMatch'
import { loseMatch } from '../../utils/loseMatch'
import { closeMatch } from '../../utils/closeMatch'
import { listenMatch } from '../../utils/listenMatch'
import { beReady } from '../../utils/beReady'
import { v4 as genId } from 'uuid'

var loadedLink = false

const initialState = {
    text: '',
    player1: {
        key: '',
        username: '',
        id: '',
        rank: '',
        promoted: false,
        demoted: false,
        points: '',
        discriminator: '',
        userInput: '',
        symbols: 0,
    },
    player2: {
        key: '',
        username: '',
        id: '',
        rank: '',
        points: '',
        promoted: false,
        demoted: false,
        discriminator: '',
        userInput: '',
        symbols: 0
    },
    sec: 0,
    started: false,
    finished: false,
    winner: ''
}

class MatchPage extends React.Component{
    state = initialState

    componentDidUpdate(){
        const getMatchData = () => {
            getMatch(this.props.matchID).then((doc) => {
                this.setState(prevProps => {
                    return {
                        text: doc.text,
                        finished: doc.finished,
                        player1: {
                            id: doc.player1,
                            userInput: prevProps.player1.userInput,
                            symbols: prevProps.player1.symbols
                        },
                        player2: {
                            id: doc.player2,
                            userInput: prevProps.player2.userInput,
                            symbols: prevProps.player2.symbols
                        }
                    }
                })

                getPlayer(doc.player1).then((doc) => {
                    this.setState(prevProps => {
                        return{
                            player1: {
                                key: doc.key,
                                username: doc.username,
                                rank: convertRankID(doc.rankData.rankID),
                                points: 0,
                                demoted: false,
                                promoted: false,
                                discriminator: doc.discriminator,
                                id: prevProps.player1.id,
                                userInput: prevProps.player1.userInput,
                                symbols: prevProps.player1.symbols
                            }
                        }
                    })
                })

                getPlayer(doc.player2).then((doc) => {
                    this.setState(prevProps => {
                        return{
                            player2: {
                                key: doc.key,
                                username: doc.username,
                                rank: convertRankID(doc.rankData.rankID),
                                points: 0,
                                demoted: false,
                                promoted: false,
                                discriminator: doc.discriminator,
                                id: prevProps.player2.id,
                                userInput: prevProps.player2.userInput,
                                symbols: prevProps.player2.symbols
                            }
                        }
                    })
                })
            })
        }

        if(!loadedLink){
            getMatchData()
            loadedLink = true
        } else{
            const userAvatar = document.getElementById('userAvatar')
            const p1 = document.getElementById('player1')
            const p2 = document.getElementById('player2')
            const p1rankimg = document.getElementById('player1RankIcon')
            const p2rankimg = document.getElementById('player2RankIcon')
            const p1button = document.getElementById('player1button')
            const p2button = document.getElementById('player2button')
            const p1avatar = document.getElementById('player1Avatar')
            const p2avatar = document.getElementById('player2Avatar')
            const p1promoted = document.getElementById('player1Promoted')
            const p1demoted = document.getElementById('player1Demoted')
            const p1pointsw = document.getElementById('player1PointsWinner')
            const p1pointsl = document.getElementById('player1PointsLoser')
            const p2promoted = document.getElementById('player2Promoted')
            const p2demoted = document.getElementById('player2Demoted')
            const p2pointsw = document.getElementById('player2PointsWinner')
            const p2pointsl = document.getElementById('player2PointsLoser')

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

            // Setup Rank Icons
            if(this.state.player1.rank != undefined && this.state.player2.rank != undefined){
                p1rankimg.src = `/${this.state.player1.rank.split(" ")[0]}.png`
                p2rankimg.src = `/${this.state.player2.rank.split(" ")[0]}.png`
            }

            if(this.state.player1.id != undefined && this.state.player2.id != undefined){
                getPlayer(this.state.player1.id).then((player) => {
                    p1avatar.src = `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}`
                })
                getPlayer(this.state.player2.id).then((player) => {
                    p2avatar.src = `https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}`
                })
            }

            // Start to Listen the Match Status in Real TIme
            listenMatch(this.props.matchID, () => {
                getMatch(this.props.matchID).then((match) => {
                    if(match.winner == 'player1'){
                        p1.disabled = true
                        p2.disabled = true

                        p1.value = "Victory!"
                        p1.classList.remove('has-text-white')
                        p1.style.color = "green"
                        p1.style.fontWeight = 'bold'

                        p2.value = "Defeat!"
                        p2.classList.remove('has-text-white')
                        p2.style.color = "red"
                        p2.style.fontWeight = 'bold'

                        p1button.disabled = true
                        p1button.classList.remove('is-light')
                        p1button.classList.add('is-primary')

                        p2button.disabled = true
                        p2button.classList.remove('is-light')
                        p2button.classList.add('is-primary')

                        if(match.winnerPromoted){
                            p1promoted.classList.remove('is-hidden')
                        }
                        if(match.winnerPoints != 0){
                            p1pointsw.classList.remove('is-hidden')
                            p1pointsw.innerText = `+${match.winnerPoints}`
                        }

                        if(match.loserrDemoted){
                            p2demoted.classList.remove('is-hidden')
                        }
                        if(match.loserPoints != 0){
                            p2pointsl.classList.remove('is-hidden')
                            p2pointsl.innerText = `-${match.loserPoints}`
                        }
                        
                    } else if(match.winner == "player2"){
                        p1.disabled = true
                        p2.disabled = true

                        p2.value = "Victory!"
                        p2.classList.remove('has-text-white')
                        p2.style.color = "green"
                        p2.style.fontWeight = 'bold'

                        p1.value = "Defeat!"
                        p1.classList.remove('has-text-white')
                        p1.style.color = "red"
                        p1.style.fontWeight = 'bold'

                        p1button.disabled = true
                        p1button.classList.remove('is-light')
                        p1button.classList.add('is-primary')

                        p2button.disabled = true
                        p2button.classList.remove('is-light')
                        p2button.classList.add('is-primary')

                        if(match.winnerPromoted){
                            p2promoted.classList.remove('is-hidden')
                        }
                        if(match.winnerPoints != 0){
                            p2pointsw.classList.remove('is-hidden')
                            p2pointsw.innerText = `+${match.winnerPoints}`
                        }

                        if(match.loserDemoted){
                            p1demoted.classList.remove('is-hidden')
                        }
                        if(match.loserPoints != 0){
                            p1pointsl.classList.remove('is-hidden')
                            p1pointsl.innerText = `-${match.loserPoints}`
                        }
                    } else{
                        if(match.player1ready && match.player2ready){
                            if(getCookie('userID') == this.state.player1.id){
                                if(p1.disabled == true){
                                    p1.disabled = false
                                    p1.placeholder = "Start typing..."
                                    p2.placeholder = "User is typing..."

                                    p1button.disabled = true
                                    p1button.classList.remove('is-light')
                                    p1button.classList.add('is-primary')

                                    p2button.disabled = true
                                    p2button.classList.remove('is-light')
                                    p2button.classList.add('is-primary')
                                }
                            } else if(getCookie('userID') == this.state.player2.id){
                                if(p2.disabled == true){
                                    p2.disabled = false
                                    p2.placeholder = "Start typing..."
                                    p1.placeholder = "User is typing..."

                                    p2button.disabled = true
                                    p2button.classList.remove('is-light')
                                    p2button.classList.add('is-primary')

                                    p1button.disabled = true
                                    p1button.classList.remove('is-light')
                                    p1button.classList.add('is-primary')
                                }
                            } else{
                                p2.disabled = true
                                p2.placeholder = "User is typing..."
                                p1.disabled = true
                                p2.placeholder = "User is typing..."
                            }
                        } else{
                            if(getCookie('userID') == this.state.player1.id){
                                p1.disabled = true
                                p1.placeholder = "Waiting players to be ready..."
                                p2.disabled = true
                                p2.placeholder = "Waiting players to be ready..."
                
                                p2button.disabled = true

                                p1button.addEventListener("click", () => {
                                    beReady(this.props.matchID, 'player1')
                                })
                            } else if(getCookie('userID') == this.state.player2.id){
                                p2.disabled = true
                                p2.placeholder = "Waiting players to be ready...."
                                p1.disabled = true
                                p1.placeholder = "Waiting players to be ready..."
                
                                userAvatar.innerHTML = (
                                    <figure className='image is-28x28'>
                                        <img src={`https://cdn.discordapp.com/avatars/${this.state.player2.id}/${this.state.player2.avatar}`}></img>
                                    </figure>
                                )

                                p2button.disable = true

                                p1button.addEventListener("click", () => {
                                    beReady(this.props.matchID, 'player1')
                                })
                            } else{
                                p2.disabled = true
                                p2.value = "Waiting players to be ready...."
                                p1.disabled = true
                                p2.placeholder = "Waiting players to be ready..."
                            }

                            if(match.player1ready == true){
                                p1button.disabled = true
                                p1button.classList.remove('is-light')
                                p1button.classList.add('is-primary')
                            } 
                            if(match.player2ready == true){
                                p2button.disabled = true
                                p2button.classList.remove('is-light')
                                p2button.classList.add('is-primary')
                            }
                        }
                    }
                })
            })
        }
    }

    onInputChangePlayer1 = (e) => {
        const v = e.target.value
        this.setTimer()
        this.onFinish(v)
        this.setState(prevProps => {
            return {
                player1: {
                    key: prevProps.player1.key,
                    username: prevProps.player1.username,
                    id: prevProps.player1.id,
                    rank: prevProps.player1.rank,
                    promoted: prevProps.player1.promoted,
                    demoted: prevProps.player1.demoted,
                    points: prevProps.player1.points,
                    discriminator: prevProps.player1.discriminator,
                    userInput: v,
                    symbols: this.countCorrectSymbols(v)
                }
            }
        })
    }

    onInputChangePlayer2 = (e) => {
        const v = e.target.value
        this.setTimer()
        this.onFinish(v)
        this.setState(prevProps => {
            return {
                player2: {
                    key: prevProps.player2.key,
                    username: prevProps.player2.username,
                    id: prevProps.player2.id,
                    rank: prevProps.player2.rank,
                    promoted: prevProps.player2.promoted,
                    demoted: prevProps.player2.demoted,
                    points: prevProps.player2.points,
                    discriminator: prevProps.player2.discriminator,
                    userInput: v,
                    symbols: this.countCorrectSymbols(v)
                }
            }
        })
    }

    countCorrectSymbols(userInput){
        const text = this.state.text.replace(' ', '')
        return userInput.replace(' ', '').split('').filter((s, i) => s === text[i]).length
    }

    setTimer(){
        if(!this.state.started){
            this.setState({started: true})
            this.interval = setInterval(() => {
                this.setState(prevProps => {
                    return {sec: prevProps.sec + 1}
                })
            }, 1000)
        }
    }

    onFinish(userInput){
        if(userInput === this.state.text){
            clearInterval(this.interval)

            const winner = this.determineWinner(this.state.player1.symbols, this.state.player2.symbols)
            const loser = winner == 'player1' ? 'player2' : 'player1'

            this.setState({
                finished: true,
                winner: winner,
                loser: loser
            })

            const winnerPoints = this.determinePoints(winner)
            const loserPoints = this.determinePointsToLose(loser)
            
            winMatch(this.state[winner].id, winnerPoints, this.state[loser].username, this.props.matchID).then((havePromoted) => {
                if(winner == 'player1'){
                    this.setState(prevProps => {
                        return {
                            player1: {
                                key: prevProps.player1.key,
                                username: prevProps.player1.username,
                                id: prevProps.player1.id,
                                rank: prevProps.player1.rank,
                                promoted: havePromoted,
                                demoted: prevProps.player1.demoted,
                                points: winnerPoints,
                                discriminator: prevProps.player1.discriminator,
                                userInput: prevProps.player1.userInput,
                                symbols: prevProps.player1.symbols
                            }
                        }
                    })
                } else{
                    this.setState(prevProps => {
                        return {
                            player2: {
                                key: prevProps.player2.key,
                                username: prevProps.player2.username,
                                id: prevProps.player2.id,
                                rank: prevProps.player2.rank,
                                promoted: havePromoted,
                                demoted: prevProps.player2.demoted,
                                points: winnerPoints,
                                discriminator: prevProps.player2.discriminator,
                                userInput: prevProps.player2.userInput,
                                symbols: prevProps.player2.symbols
                            }
                        }
                    })
                }

                loseMatch(this.state[loser].id, loserPoints, this.state[winner].username, this.props.matchID).then((haveDemoted) => {
                    if(loser == 'player1'){
                        this.setState(prevProps => {
                            return {
                                player1: {
                                    key: prevProps.player1.key,
                                    username: prevProps.player1.username,
                                    id: prevProps.player1.id,
                                    rank: prevProps.player1.rank,
                                    promoted: prevProps.player1.promoted,
                                    demoted: haveDemoted,
                                    points: loserPoints,
                                    discriminator: prevProps.player1.discriminator,
                                    userInput: prevProps.player1.userInput,
                                    symbols: prevProps.player1.symbols
                                }
                            }
                        })
                    } else{
                        this.setState(prevProps => {
                            return {
                                player2: {
                                    key: prevProps.player2.key,
                                    username: prevProps.player2.username,
                                    id: prevProps.player2.id,
                                    rank: prevProps.player2.rank,
                                    promoted: prevProps.player2.promoted,
                                    demoted: haveDemoted,
                                    points: loserPoints,
                                    discriminator: prevProps.player2.discriminator,
                                    userInput: prevProps.player2.userInput,
                                    symbols: prevProps.player2.symbols
                                }
                            }
                        })
                    }

                    closeMatch(this.props.matchID, winner, loser, winnerPoints, loserPoints, havePromoted, haveDemoted)
                })
            })
        }
    }

    determineWinner(p1symbols, p2symbols){
        return p1symbols > p2symbols ? 'player1' : 'player2'
    }

    determinePointsToLose(loser){
        const rankBaseTiers = {
            'Bronze I': 5,
            'Bronze II': 5,
            'Bronze III': 5.5,
            'Bronze IV': 5.5,
            'Silver I': 6,
            'Silver II': 6,
            'Silver III': 6.5,
            'Silver IV': 6.5,
            'Gold I': 7,
            'Gold II': 7,
            'Gold III': 7,
            'Gold IV': 7.5,
            'Platinum I': 7.5,
            'Platinum II': 7.5,
            'Platinum III': 8,
            'Platinum IV': 8,
            'Diamond I': 8,
            'Diamond II': 9,
            'Diamond III': 9,
            'Diamond IV': 10,
            'Master': 10,
            'Grand-Master': 10,
            'Legend': 15
        }
        const rankTiers = {
            'Bronze I': 1.5,
            'Bronze II': 1.6,
            'Bronze III': 1.7,
            'Bronze IV': 1.8,
            'Silver I': 2.5,
            'Silver II': 2.6,
            'Silver III': 2.7,
            'Silver IV': 2.8,
            'Gold I': 3.6,
            'Gold II': 3.7,
            'Gold III': 3.8,
            'Gold IV': 3.9,
            'Platinum I': 4.7,
            'Platinum II': 4.8,
            'Platinum III': 4.9,
            'Platinum IV': 5,
            'Diamond I': 5.2,
            'Diamond II': 5.3,
            'Diamond III': 5.4,
            'Diamond IV': 5.5,
            'Master': 10,
            'Grand-Master': 10,
            'Legend': 1
        }

        // Variables
        const speedID = `${loser}speed`
        var loserRank = ''
        if(this.state[loser].rank.split(" ")[0] == "Master" || this.state[loser].rank.split(" ")[0] == "Grand-Master" || this.state[loser].rank.split(" ")[0] == "Legend" ){
            loserRank = this.state[loser].rank.split(" ")[0]
        } else{
            loserRank = this.state[loser].rank.split(" ")[0] + " " + this.state[loser].rank.split(" ")[1]
        }
        const loserID = this.state[loser].id
        const loserSpeed = 0
        try{
            loserSpeed = parseInt(document.getElementById(speedID).innerHTML.split(' ')[0])
        } catch(e){
            loserSpeed = 0
        }
        const basePoints = rankBaseTiers[loserRank]

        // Formula = (Base + (WPM/Rank Tier) + (Text Length/Rank Tier))/Rank Tier
        const pointsToLose = (basePoints + (loserSpeed/rankTiers[loserRank]) + (this.state.text.length/rankTiers[loserRank]))/rankTiers[loserRank]

        return Math.floor(pointsToLose)

    }

    determinePoints(winner){
        // Utils
        const rankBaseTiers = {
            'Bronze I': 12,
            'Bronze II': 12,
            'Bronze III': 10,
            'Bronze IV': 10,
            'Silver I': 10,
            'Silver II': 10,
            'Silver III': 8,
            'Silver IV': 8,
            'Gold I': 8,
            'Gold II': 8,
            'Gold III': 8,
            'Gold IV': 7.5,
            'Platinum I': 7.5,
            'Platinum II': 7.5,
            'Platinum III': 7,
            'Platinum IV': 6.5,
            'Diamond I': 6.5,
            'Diamond II': 6.5,
            'Diamond III': 6,
            'Diamond IV': 6,
            'Master': 5,
            'Grand-Master': 4,
            'Legend': 1
        }
        const rankTiers = {
            'Bronze I': 1.5,
            'Bronze II': 1.6,
            'Bronze III': 1.7,
            'Bronze IV': 1.8,
            'Silver I': 2.5,
            'Silver II': 2.6,
            'Silver III': 2.7,
            'Silver IV': 2.8,
            'Gold I': 3.6,
            'Gold II': 3.7,
            'Gold III': 3.8,
            'Gold IV': 3.9,
            'Platinum I': 4.7,
            'Platinum II': 4.8,
            'Platinum III': 4.9,
            'Platinum IV': 5,
            'Diamond I': 5.2,
            'Diamond II': 5.3,
            'Diamond III': 5.4,
            'Diamond IV': 5.5,
            'Master': 10,
            'Grand-Master': 10,
            'Legend': 1
        }

        // Variables
        const speedID = `${winner}speed`
        var winnerRank = ''
        if(this.state[winner].rank.split(" ")[0] == "Master" || this.state[winner].rank.split(" ")[0] == "Grand-Master" || this.state[winner].rank.split(" ")[0] == "Legend" ){
            winnerRank = this.state[winner].rank.split(" ")[0]
        } else{
            winnerRank = this.state[winner].rank.split(" ")[0] + " " + this.state[winner].rank.split(" ")[1]
        }
        const winnerID = this.state[winner].id
        const winnerSpeed = parseInt(document.getElementById(speedID).innerHTML.split(' ')[0])
        const basePoints = rankBaseTiers[winnerRank]

        // Formula = Base + (WPM/Rank Tier)/(Text Length/Rank Tier)*Rank Tier
        const aditionalPoints = (winnerSpeed/rankTiers[winnerRank]/(this.state.text.length/rankTiers[winnerRank])*rankTiers[winnerRank])
        return Math.ceil(parseInt(basePoints) + parseInt(aditionalPoints))
    }

    render() {
        return (
            <div style={{backgroundColor: '#10041c'}} className='has-text-white'>
                <Head>
                    <title>Match | {this.props.matchID}</title>
                    <meta content='Match' property="og:title" />
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
    
                <div className="block p-6" style={{paddingBottom: 400}}>
                    <div className="columns">
                        <div className="column" id="player1UI">
                            <div className="block" id="player1Data">
                                <div className='columns'>
                                    <div className='column'>
                                        <div className='block is-flex is-flex-direction-row'>
                                            <figure className="image is-96x96">
                                                <img className="is-rounded" id="player1Avatar"></img>
                                            </figure>
                                            <div className='block m-4 is-flex is-flex-direction-column'>
                                                <Link href={'/user/'+this.state.player1.id}><a className='has-text-weight-bold' id="player2ProfileLink">{this.state.player1.username}</a></Link>
                                                <p className='has-text-weight-light'>#{this.state.player1.discriminator}</p>
                                            </div> 
                                            <div className='block ml-5 is-flex is-flex-direction-row'>
                                                <figure className='image is-96x96'>
                                                    <img id="player1RankIcon"></img>
                                                </figure>
                                                <div className='block is-flex is-flex-direction-column'>
                                                    <p className='m-4 has-text-weight-bold'>{this.state.player1.rank}</p>
                                                </div>
                                                <div className='block is-flex is-flex-direction-column mt-4'>
                                                    <span className="tag is-success is-hidden" id="player1Promoted">Promoted!</span>
                                                    <span className="tag is-danger is-hidden" id="player1Demoted">Demoted!</span>
                                                    <span className="tag is-info is-hidden" id="player1PointsWinner">+{this.state.player1.points} RP</span>
                                                    <span className="tag is-info is-hidden" id="player1PointsLoser">-{this.state.player1.points} RP</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Preview text={this.state.text} userInput={this.state.player1.userInput}></Preview>

                            <div className="block">
                                <button className="button is-light" id="player1button">Ready</button>
                            </div>

                            <textarea
                                id="player1"
                                value={this.state.player1.userInput}
                                onChange={this.onInputChangePlayer1}
                                className="textarea has-text-white"
                                style={{backgroundColor: '#36234a'}}
                                placeholder="The user is typing..."
                                readOnly={this.state.finished}
                                disabled
                            ></textarea>
    
                            <Speed sec={this.state.sec} id="player1speed" symbols={this.state.player1.symbols}></Speed>
                        </div>

                        <div className="column" id="player2UI">
                            <div className="block" id="player2Data">
                                    <div className='columns'>
                                        <div className='column'>
                                            <div className='block is-flex is-flex-direction-row'>
                                                <figure className="image is-96x96">
                                                    <img className="is-rounded" id="player2Avatar"></img>
                                                </figure>
                                                <div className='block m-4 is-flex is-flex-direction-column'>
                                                    <Link href={"/user/"+this.state.player2.id}><a className='has-text-weight-bold' id="player2ProfileLink" >{this.state.player2.username}</a></Link>
                                                    <p className='has-text-weight-light'>#{this.state.player2.discriminator}</p>
                                                </div> 
                                                <div className='block ml-5 is-flex is-flex-direction-row'>
                                                    <figure className='image is-96x96'>
                                                        <img id="player2RankIcon"></img>
                                                    </figure>
                                                    <div className='block is-flex is-flex-direction-column'>
                                                        <p className='m-4 has-text-weight-bold'>{this.state.player2.rank}</p>
                                                    </div>
                                                    <div className='block is-flex is-flex-direction-column mt-4'>
                                                        <span className="tag is-success is-hidden" id="player2Promoted">Promoted!</span>
                                                        <span className="tag is-danger is-hidden" id="player2Demoted">Demoted!</span>
                                                        <span className="tag is-info is-hidden" id="player2PointsWinner">+{this.state.player2.points} RP</span>
                                                        <span className="tag is-info is-hidden" id="player2PointsLoser">-{this.state.player2.points} RP</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            <Preview text={this.state.text} userInput={this.state.player2.userInput}></Preview>

                            <div className="block">
                                <button className="button is-light" id="player2button">Ready</button>
                            </div>

                             <textarea
                                id="player2"
                                value={this.state.player2.userInput}
                                onChange={this.onInputChangePlayer2}
                                className="textarea has-text-white"
                                style={{backgroundColor: '#36234a'}}
                                readOnly={this.state.finished}
                                disabled
                            ></textarea>
    
                            <Speed sec={this.state.sec} id="player2speed" symbols={this.state.player2.symbols}></Speed>
                        </div>
                    </div>
                </div>

                <footer className='footer has-text-white' style={{backgroundColor: '#36234a'}}>
                    <div className='content has-text-centered'>
                        <span className='has-text-weight-bold'>Typer</span> by <Link href="https://twitter.com/matjs_"><a>Matheus Silva (matjs)</a></Link>. The source code is licensed by <Link href="https://opensource.org/licenses/mit-license.php"><a>MIT</a></Link>. The website is an indie project made by one person, if you want to support me, share the project with your friends!
                    </div>
                </footer>
            </div>
        )
    }
}

export default function Match() {
    const router = useRouter()
    const { matchID } = router.query

    console.log(matchID)

	return (
		<MatchPage matchID={matchID}/>
	)
}
