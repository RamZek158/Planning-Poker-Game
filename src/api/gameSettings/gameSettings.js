const API = "http://localhost:3001/api";

export const saveGameSettings = (gameSettings) => {
	return fetch(`${API}/save-game-settings`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(gameSettings),
	}).then((res) => res.json());
};

/**
 * Получает текущие настройки игры с сервера
 * @returns {Promise<Object>} данные о gameId, названии игры и системе голосования
 */
export const getGameSettings = (id) => {
	return fetch(`${API}/game-settings/${id}`).then((res) => res.json());
};

/**
 * Удаляет настройки игры по ID
 * @param {string} gameId - ID настроек игры
 * @returns {Promise<Object>} результат удаления
 */

export const deleteGameRoom = (id) => {
	return fetch(`${API}/game-settings/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((res) => res.json());
};
