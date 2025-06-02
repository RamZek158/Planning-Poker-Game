import React from 'react';

const GameNameContext = React.createContext('');

export const useGameNameContext = () => React.useContext(GameNameContext);

const GameNameProvider = ({children}) => {
    const [gameName, setGameName] = React.useState('');

    const gameNameContextProvider = React.useMemo(
        () => ({
            gameName, setGameName
        }),[gameName, setGameName])

    return (
     <GameNameContext.Provider value={gameNameContextProvider}>{children}</GameNameContext.Provider>
    )
}

GameNameProvider.displayName = 'GameNameProvider';
export default GameNameProvider;