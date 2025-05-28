export const PLAYERS_KEY = 'players';


export const savePlayer = (player) => {
    const players = localStorage[PLAYERS_KEY];

    if (players === undefined) {
        const playersInitialArray = [player];
        localStorage.setItem(PLAYERS_KEY, JSON.stringify(playersInitialArray));
    } else {
        const playersArray = JSON.parse(players);
        console.log('**** playersArray **** ', playersArray);
        playersArray.push(player);
        localStorage.setItem(PLAYERS_KEY, JSON.stringify(playersArray));
    }
}
export const getPlayers = () => {
    const players = localStorage[PLAYERS_KEY]
    console.log('players: ', players);
}