import React, { Component } from 'react';
import './App.css';
import Config from './Config';
import correctSound from './sound/correct.wav';
import wrongSound from './sound/wrong.mp3';
import loseSound from './sound/lose.mp3';
import winSound from './sound/win.wav';
import {
  setShuffledCards,
  setCardsOnTable,
  setSelectedCard,
  setBettingCoins,
  setCurrentCoins,
  setBetCoins,
  setGuess
} from './redux/game/game.actions';
import store from './redux/store';

class App extends Component {

  constructor(props){
    super(props);
    this.canvasRef = React.createRef();
    this.canvas = this.canvasRef.current;
    this.rowIndex = 1;
    this.rowDivider = 0;
    this.state = {
      bettingMoney: 10,
      currentMoney: 100,
      betMoney: 0,
      shuffledCards: [],
      cardsOnTable: [],
      selectedCard: {},
      guess: '',
      correctSound: new Audio(correctSound),
      wrongSound: new Audio(wrongSound),
      loseSound: new Audio(loseSound),
      winSound: new Audio(winSound)
    }
  }

  componentWillMount() {
    const localStargeState = JSON.parse(localStorage.getItem('state'));
    if (!!localStargeState) {
      this.setState({
        bettingMoney: localStargeState.bettingMoney,
        currentMoney: localStargeState.currentMoney,
        betMoney: localStargeState.betMoney,
        shuffledCards: localStargeState.shuffledCards,
        cardsOnTable: localStargeState.cardsOnTable,
        selectedCard: localStargeState.selectedCard,
        guess: localStargeState.guess,
        correctSound: new Audio(correctSound),
        wrongSound: new Audio(wrongSound),
        loseSound: new Audio(loseSound),
        winSound: new Audio(winSound)
      });
    } else {
      this.shuffleCards();
    }
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.canvas.width = window.innerWidth * 0.8;
    this.canvas.height = window.innerHeight * 0.8;
    this.showImage('unknown-card.png', this.canvas.width / 2 - 31, 50);
    const tempCardsOnTable = JSON.parse(JSON.stringify(this.state.cardsOnTable));
    this.setState({cardsOnTable: []}, () => {
      for (let i = 0; i < tempCardsOnTable.length; i++) {
        this.state.cardsOnTable.push(tempCardsOnTable[i]);
        this.setState({cardsOnTable: this.state.cardsOnTable});
        this.drawCard(tempCardsOnTable[i]);
      }
    });
  }

  init = () => {
    this.clearCanvas(77, 300, window.innerWidth * 0.8, window.innerHeight * 0.8)
    this.setState({
      bettingMoney: 10,
      currentMoney: 100,
      betMoney: 0,
      shuffledCards: [],
      cardsOnTable: [],
      selectedCard: {},
      guess: '',
      correctSound: new Audio(correctSound),
      wrongSound: new Audio(wrongSound),
      loseSound: new Audio(loseSound),
      winSound: new Audio(winSound)
    }, () => {
      store.dispatch(setBettingCoins(this.state.bettingMoney));
      store.dispatch(setCurrentCoins(this.state.currentMoney));
      store.dispatch(setBetCoins(this.state.betMoney));
      store.dispatch(setShuffledCards(this.state.shuffledCards));
      store.dispatch(setCardsOnTable(this.state.cardsOnTable));
      store.dispatch(setSelectedCard(this.state.selectedCard));
      store.dispatch(setGuess(this.state.guess));
      this.setStateInLocalStorage();
      localStorage.removeItem('state');
      this.componentWillMount();
    })
  };

  setStateInLocalStorage = () => {
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  shuffleCards = () => {
    if (this.state.currentMoney < 1) {
      this.state.loseSound.play();
      alert('Game over!!!');
      this.init();
      return;
    }
    const cards = JSON.parse(JSON.stringify(Config.cards));
    let currentIndex = Config.cards.length;
    let temporaryValue; 
    let randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = cards[currentIndex];
      cards[currentIndex] = cards[randomIndex];
      cards[randomIndex] = temporaryValue;
    }
    this.setState({ shuffledCards: cards}, () => {
      store.dispatch(setShuffledCards(this.state.shuffledCards));
      this.setStateInLocalStorage();
      this.selectCard();
    });
  }

  drawCard = (card) => {
    let index = this.state.cardsOnTable.length - this.rowDivider;
    if (index * 77 + 154 + 400 > window.innerWidth) {
      this.rowIndex++;
      this.rowDivider = this.state.cardsOnTable.length - 1;
      index = this.state.cardsOnTable.length - this.rowDivider;
    }
    this.showImage(`${card.number}-${card.symbol}.png`, index * 77, this.rowIndex === 1 ? this.rowIndex * 300 : this.rowIndex * 200);
  }

  showImage = (imageName, x, y) => {
    const context = this.canvas.getContext('2d');
    const img = new Image;
    img.onload = () => {
      if (imageName === 'check.svg' || imageName === 'wrong.svg') {
        context.drawImage(img, x, y, img.width * 0.3, img.height * 0.3);
      } else {
        context.drawImage(img, x, y, img.width, img.height);
      }
    };
    img.src = process.env.PUBLIC_URL + `/images/${imageName}`;
  }

  clearCanvas = (x, y, width, height) => {
    const context = this.canvas.getContext('2d');
    context.clearRect(x, y, width, height);
  }

  selectCard = () => {
    if (this.state.shuffledCards && this.state.shuffledCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * (this.state.shuffledCards.length - 1));
      const selectedCard = this.state.shuffledCards[randomIndex];
      this.state.cardsOnTable.push(selectedCard);
      this.state.shuffledCards.splice(randomIndex, 1);
      this.setState({
        cardsOnTable: this.state.cardsOnTable,
        shuffledCards: this.state.shuffledCards,
      }, () => {
        this.drawCard(this.state.cardsOnTable[0]);
        store.dispatch(setCardsOnTable(this.state.cardsOnTable));
        store.dispatch(setShuffledCards(this.state.shuffledCards));
        this.setStateInLocalStorage();
      });
    }
  }

  selectCardInGame = () => {
    if (this.state.shuffledCards && this.state.shuffledCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * (this.state.shuffledCards.length - 1));
      const selectedCard = this.state.shuffledCards[randomIndex];
      this.state.shuffledCards.splice(randomIndex, 1);
      return {
        selectedCard: selectedCard,
        shuffledCards: this.state.shuffledCards
      };
    }
  }

  onHighLowClick = (guess) => {
    const { selectedCard, shuffledCards } = this.selectCardInGame();
    this.setState({
      selectedCard: selectedCard,
      shuffledCards: shuffledCards,
      currentMoney: this.state.currentMoney - this.state.bettingMoney,
      betMoney: parseInt(this.state.betMoney, 10) + parseInt(this.state.bettingMoney, 10),
    }, () => {
      store.dispatch(setSelectedCard(this.state.selectedCard));
      store.dispatch(setShuffledCards(this.state.shuffledCards));
      store.dispatch(setCurrentCoins(this.state.currentMoney));
      store.dispatch(setBetCoins(this.state.betMoney));
      this.setStateInLocalStorage();
      const newCard = this.state.selectedCard;
      this.showImage(`${newCard.number}-${newCard.symbol}.png`,  this.canvas.width / 2 - 194, 50)
      const previousCard = this.state.cardsOnTable[this.state.cardsOnTable.length - 1];
      this.setState({
        selectedCard: newCard
      }, () => {
        store.dispatch(setSelectedCard(this.state.selectedCard));
        this.setStateInLocalStorage();
        setTimeout(() => {
          this.clearCanvas(this.canvas.width / 2 - 194, 50, 154, 240);
          if (guess > 0) {
            this.makeHigherCheck(newCard, previousCard);
          } else {
            this.makeLowerCheck(newCard, previousCard);
          }
        }, 500)
      });
    });
  }

  onBetCoinsChange = (e) => {
    this.setState({ bettingMoney: e.target.value}, () => {
      store.dispatch(setBettingCoins(this.state.bettingMoney));
      this.setStateInLocalStorage();
    });
  }

  makeHigherCheck = (newCard, previousCard) => {
    if (newCard.number >= previousCard.number) {
      this.processWin(newCard);
    } else {
      this.processLoss();
    }
  }

  makeLowerCheck = (newCard, previousCard) => {
    if (newCard.number < previousCard.number) {
      this.processWin(newCard);
    } else {
      this.processLoss();
    }
  }

  processWin = (newCard) => {
    this.state.correctSound.play();
    this.state.cardsOnTable.push(newCard);
    this.showImage('check.svg', this.canvas.width / 2 - 214, 103.6);
    this.setState({
      guess: 'check',
      currentMoney: parseInt(this.state.currentMoney, 10) + (parseInt(this.state.bettingMoney, 10) + (parseInt(this.state.bettingMoney, 10) * 0.25)),
      selectedCard: {},
      cardsOnTable: this.state.cardsOnTable
    }, () => {
      store.dispatch(setGuess(this.state.guess));
      this.drawCard(this.state.cardsOnTable[this.state.cardsOnTable.length - 1]);
      store.dispatch(setCurrentCoins(this.state.currentMoney));
      store.dispatch(setSelectedCard(this.state.selectedCard));
      store.dispatch(setCardsOnTable(this.state.cardsOnTable));
      this.setStateInLocalStorage();
      setTimeout(() => {
        this.clearCanvas(this.canvas.width / 2 - 214, 103.6, 173.6, 153.6);
        this.setState({
          guess: ''
        }, () => {
          store.dispatch(setGuess(this.state.guess));
          this.setStateInLocalStorage();
          if (this.state.shuffledCards && this.state.shuffledCards.length === 0) {
            this.state.winSound.play();
            alert('You won!!!');
            this.init();
            return;
          }
        })
      }, 500)
    });
  }

  processLoss = () => {
    this.state.wrongSound.play();
    this.showImage('wrong.svg', this.canvas.width / 2 - 214, 103.6);
    this.setState({
      guess: 'wrong',
    }, () => {
      store.dispatch(setGuess(this.state.guess));
      this.setStateInLocalStorage();
      setTimeout(() => {
        this.clearCanvas(this.canvas.width / 2 - 214, 103.6, 173.6, 153.6);
        this.postProcessLoss();
      }, 500)
    });
  }

  postProcessLoss = () => {
    this.setState({
      guess: '',
      betMoney: 0,
      cardsOnTable: [],
      selectedCard: {}
    }, () => {
      this.clearCanvas(77, 300, window.innerWidth * 0.8, window.innerHeight * 0.8)
      store.dispatch(setGuess(this.state.guess));
      store.dispatch(setBetCoins(this.state.betMoney));
      store.dispatch(setCardsOnTable(this.state.cardsOnTable));
      store.dispatch(setSelectedCard(this.state.selectedCard));
      this.setStateInLocalStorage();
      this.shuffleCards();
    })
  }

  render() {
    let guess = <span></span>;
    if (this.state.guess === 'wrong') {
      guess = <svg height="365pt" viewBox="0 0 365.71733 365" width="365pt" xmlns="http://www.w3.org/2000/svg"><g fill="#DE0131"><path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0"/><path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0"/></g></svg>;
    }
    if (this.state.guess === 'check') {
      guess = <svg height="417pt" viewBox="0 -46 417.81333 417" width="417pt" xmlns="http://www.w3.org/2000/svg"><path d="m159.988281 318.582031c-3.988281 4.011719-9.429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" fill="#28CC42"/></svg>
    }
    return (
      <div className="App">
        <div className="Header">
          <div className="top">
            <div className="section betm">
              <label>Betting coins</label>
              <input type="number" onChange={this.onBetCoinsChange} value={this.state.bettingMoney}></input>
            </div>
            <div className="game-coins">
              <div className="section cm">
                <label>Current coins</label>
                <span>{this.state.currentMoney}</span>
              </div>
              <div className="section bm">
                <label>Bet coins</label>
                <span>{this.state.betMoney}</span>
              </div>
            </div>
            <div className="section hl">
              <button 
                className={this.state.bettingMoney > this.state.currentMoney || this.state.guess !== '' || this.state.bettingMoney <= 0? 'Btn primary disabled' : 'Btn primary'}
                onClick={() => this.onHighLowClick(-1)}>
                  Lower
                </button>
              <button
                className={this.state.bettingMoney > this.state.currentMoney || this.state.guess !== '' || this.state.bettingMoney <= 0 ? 'Btn secondary disabled' : 'Btn secondary'}
                onClick={() => this.onHighLowClick(1)}>
                  Higher
              </button>
            </div>
          </div>
          <div className="Footer">
            <button className="Btn primary" onClick={() => this.postProcessLoss()}>New Game</button>
            <button className="Btn secondary" onClick={() => this.init()}>Reset</button>
          </div>
        </div>
        <div className="Main">
          <canvas ref={this.canvasRef} width="500" height="500"></canvas>
        </div>
      </div>
    )
  };
}

export default App;
