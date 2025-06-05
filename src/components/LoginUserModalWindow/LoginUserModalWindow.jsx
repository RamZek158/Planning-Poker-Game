import React from "react";
import { useCookies } from "react-cookie";

const LoginUserModalWindow = ({ onClose, onChange }) => {
	// setCookie('logged-user-info', userInfo, { path: '/' });

	const handleChangeInput = React.useCallback(
		(event) => {
			onChange(event.target.value);
		},
		[onChange]
	);

	const handleLoginUser = React.useCallback(() => {
		// Сохраняем анонимного пользователя в куки
		const userId = `usr_${Math.random().toString(36).substring(2, 10)}`;
		const userInfo = {
			logged_as: "anonymous",
			user_id: userId,
			user_name: customName,
			user_email: undefined,
			user_picture: profileIcon,
			logged_in: new Date().getTime(),
			expires_in: 3599 * 1000 + new Date().getTime(),
		};

		setCookie("logged-user-info", userInfo);
		addUser({
			id: userId,
			name: customName,
			picture: profileIcon,
		});
		nClose();
	}, [onClose]);

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h3>Введите ваше имя</h3>
				<input type="text" placeholder="Ваше имя" value={customName} onChange={handleChangeInput} />
				<div>
					<button className="btn primary" onClick={handleLogin} disabled={!customName.trim()} style={{ marginTop: "10px" }}>
						Войти
					</button>
				</div>
			</div>
		</div>
	);
};

LoginUserModalWindow.displayName = "LoginUserModalWindow";
export default LoginUserModalWindow;
