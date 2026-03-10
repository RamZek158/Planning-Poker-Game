const API = "/api";

const parseJson = async (res) => {
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw new Error(data.error || data.message || `HTTP ${res.status}`);
	}
	return data;
};

export const saveGameSettings = (gameSettings) => {
	return fetch(`${API}/save-game-settings`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(gameSettings),
	}).then(parseJson);
};

/**
 * Получает текущие настройки игры с сервера
 * @returns {Promise<Object>} данные о gameId, названии игры и системе голосования
 */
export const getGameSettings = (id) => {
	return fetch(`${API}/game-settings/${id}`).then(parseJson);
};

/**
 * Удаляет настройки игры по ID
 * @param {string} gameId - ID настроек игры
 * @returns {Promise<Object>} результат удаления
 */

export const deleteGameRoom = (id, { token, userId } = {}) => {
	const headers = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	if (userId) {
		headers["X-User-Id"] = userId;
	}

	return fetch(`${API}/game-settings/${id}`, {
		method: "DELETE",
		headers,
	}).then(parseJson);
};
