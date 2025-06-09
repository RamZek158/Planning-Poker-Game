import React, { useState, useEffect } from "react";
import { PlayingCard } from "../../components";
import "./Carousel.css";

const Carousel = ({ children }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [length, setLength] = useState(React.Children.count(children));

	useEffect(() => {
		setLength(React.Children.count(children));
	}, [children]);

	const next = () => {
		if (currentIndex < length - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const prev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	return (
		<div className="carousel-container">
			<div className="carousel-wrapper">
				<button onClick={prev} className="left-arrow">
					&lt;
				</button>
				<div className="carousel-content-wrapper">
					<div className="carousel-content" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
						<PlayingCard randomCardSuit={0} cardValue="L" />
						<PlayingCard randomCardSuit={1} cardValue="S" />
						<PlayingCard randomCardSuit={2} cardValue="XL" />
						<PlayingCard randomCardSuit={3} cardValue="XXL" />
					</div>
				</div>
				<button onClick={next} className="right-arrow">
					&gt;
				</button>
			</div>
		</div>
	);
};

export default Carousel;
