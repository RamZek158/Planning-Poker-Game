import React from "react";
import "./PaymentPage.css";
import qr from "../../assets/images/qr.jpg";

const PaymentPage = () => {
	return (
		<div className="payment-container">
			<h1>Оплата подписки</h1>
			<p>Отсканируйте QR-код ниже, чтобы оплатить подписку через СБП:</p>

			<div className="qr-code">
				{/* Пример статического QR-кода */}
				<img src={qr} alt="QR код для оплаты по СБП" />
			</div>

			<p className="sbp-info">Или выберите банк в вашем приложении СБП и переведите деньги на:</p>

			<div className="bank-details">
				<p>
					<strong>Номер телефона:</strong> +7 922 511 19 16
				</p>
				<p>
					<strong>Получатель:</strong> ООО "Андрша🥰"
				</p>
				<p>
					<strong>Комментарий:</strong> я куплю себе пиву😇😇
				</p>
			</div>

			<button className="back-button" onClick={() => window.history.back()}>
				Назад
			</button>
		</div>
	);
};

export default PaymentPage;
