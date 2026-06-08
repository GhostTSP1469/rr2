import { createContext } from 'react'

export const initialState = {
  activeCategory: 'Все карты',
  favoriteIds: [1],
  deckIds: [1, 2],
}

type Action =
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'ADD_TO_DECK'; payload: number }
  | { type: 'REMOVE_FROM_DECK'; payload: number }

export function storeReducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.payload }

    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favoriteIds: state.favoriteIds.includes(action.payload)
          ? state.favoriteIds.filter((id) => id !== action.payload)
          : [...state.favoriteIds, action.payload],
      }

    case 'ADD_TO_DECK':
      if (state.deckIds.includes(action.payload) || state.deckIds.length >= 6) {
        return state
      }

      return { ...state, deckIds: [...state.deckIds, action.payload] }

    case 'REMOVE_FROM_DECK':
      return {
        ...state,
        deckIds: state.deckIds.filter((id) => id !== action.payload),
      }
  }
}

function emptyDispatch(action: Action) {
  void action
}

export const StoreContext = createContext({
  state: initialState,
  dispatch: emptyDispatch,
})
