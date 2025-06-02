export const saveGameSettings = ({ gameId, gameName, votingSystem }) => {
    return fetch('/api/save-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ gameId, gameName, votingSystem }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Не удалось сохранить настройки игры');
            }
            return response.json();
        });
};

/**
 * Получает текущие настройки игры с сервера
 * @returns {Promise<Object>} данные о gameId, названии игры и системе голосования
 */
export const fetchGameSettings = () => {
    return fetch('/api/game-settings')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Не удалось загрузить настройки игры');
            }
            return response.json();
        });
};

/**
 * Удаляет настройки игры по ID
 * @param {string} gameId - ID настроек игры
 * @returns {Promise<Object>} результат удаления
 */
export const deleteGameSettings = (gameId) => {
    return fetch(`/api/game-settings?id=${gameId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Не удалось удалить настройки игры');
            }
            return response.json();
        });
};