import {
    SET_SHUFFLED_CARDS,
    SET_CARDS_ON_TABLE,
    SET_SELECTED_CARD,
    SET_BETTING_COINS,
    SET_CURRENT_COINS,
    SET_BET_COINS,
    SET_GUESS
} from './game.types';

const INITIAL_STATE = {
    bettingCoins: 10,
    currentCoins: 100,
    betCoins: 0,
    shuffledCards: [],
    cardsOnTable: [],
    selectedCard: {},
    guess: '',
};

const reducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case SET_SHUFFLED_CARDS:
            return {
                ...state,
                shuffledCards: action.payload,
            };
        case SET_CARDS_ON_TABLE:
            return {
                ...state,
                cardsOnTable: action.payload,
            };
        case SET_SELECTED_CARD:
            return {
                ...state,
                selectedCard: action.payload,
            };
        case SET_BETTING_COINS:
            return {
                ...state,
                bettingCoins: action.payload,
            };
        case SET_CURRENT_COINS:
            return {
                ...state,
                currentCoins: action.payload,
            };
        case SET_BET_COINS:
            return {
                ...state,
                betCoins: action.payload,
            };
        case SET_GUESS:
            return {
                ...state,
                guess: action.payload,
            };
        default: return state;
    }

};

export default reducer;