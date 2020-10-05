import { SET_SHUFFLED_CARDS } from './game.types';
import { SET_CARDS_ON_TABLE } from './game.types';
import { SET_SELECTED_CARD } from './game.types';
import { SET_BETTING_COINS } from './game.types';
import { SET_CURRENT_COINS } from './game.types';
import { SET_BET_COINS } from './game.types';
import { SET_GUESS } from './game.types';

export const setShuffledCards = (payload) => {
    return {
        type: SET_SHUFFLED_CARDS,
        payload: payload
    };
};
export const setCardsOnTable = (payload) => {
    return {
        type: SET_CARDS_ON_TABLE,
        payload: payload
    };
};
export const setSelectedCard = (payload) => {
    return {
        type: SET_SELECTED_CARD,
        payload: payload
    };
};
export const setBettingCoins = (payload) => {
    return {
        type: SET_BETTING_COINS,
        payload: payload
    };
};
export const setCurrentCoins = (payload) => {
    return {
        type: SET_CURRENT_COINS,
        payload: payload
    };
};
export const setBetCoins = (payload) => {
    return {
        type: SET_BET_COINS,
        payload: payload
    };
};
export const setGuess = (payload) => {
    return {
        type: SET_GUESS,
        payload: payload
    };
};