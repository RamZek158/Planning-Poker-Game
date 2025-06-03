export const saveGameSettings = (gameSettings) => {
    return fetch('/api/save-game-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(gameSettings)
        })
        .then((res) => res.json())
        .then((data) => data);
};

/**
 * Получает текущие настройки игры с сервера
 * @returns {Promise<Object>} данные о gameId, названии игры и системе голосования
 */
export const getGameSettings = () => {
    return fetch('/api/game-settings')
        .then((res) => res.json())
        .then((data) => data);
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