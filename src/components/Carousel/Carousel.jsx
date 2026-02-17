import React, { useState, useEffect, useRef, useMemo } from "react";
import { PlayingCard } from "../../components";
import "./Carousel.css";

// --- проверка переполнения ---
function useIsCarouselNeeded() {
	const containerRef = useRef(null);
	const [isCarouselNeeded, setIsCarouselNeeded] = useState(false);

	useEffect(() => {
		const checkWidth = () => {
			if (!containerRef.current) return;

			const container = containerRef.current;
			const isOverflowing = container.scrollWidth > container.clientWidth;

			setIsCarouselNeeded(isOverflowing);
		};

		checkWidth();
		window.addEventListener("resize", checkWidth);

		return () => {
			window.removeEventListener("resize", checkWidth);
		};
	}, []);

	return { isCarouselNeeded, containerRef };
}

// --- CAROUSEL ---
export default function Carousel({ items = [], onCardClick }) {
	const cardWidth = 120;
	const { isCarouselNeeded, containerRef } = useIsCarouselNeeded();
	const [offset, setOffset] = useState(0);
	const [touchPosition, setTouchPosition] = useState(null);

	const maxOffset = Math.max((items.length - 1) * (cardWidth / 1.3), 0);

	const moveLeft = () => {
		setOffset((prev) => Math.max(prev - cardWidth, 0));
	};

	const moveRight = () => {
		setOffset((prev) => Math.min(prev + cardWidth, maxOffset));
	};

	const handleTouchStart = (e) => {
		const touch = e.touches[0];
		setTouchPosition(touch.clientX);
	};

	const handleTouchMove = (e) => {
		if (!touchPosition) return;

		const touch = e.touches[0];
		const diff = touch.clientX - touchPosition;

		if (diff > 5) moveLeft();
		if (diff < -5) moveRight();

		setTouchPosition(null);
	};

	// генерация карт
	const cardsData = useMemo(() => {
		return items.map((value) => ({
			value,
		}));
	}, [items]);

	// если карусель не нужна
	if (!isCarouselNeeded) {
		return (
			<div className='card-list' ref={containerRef}>
				{cardsData.map((card, index) => (
					<div
						key={index}
						className='carousel-item'
						onClick={() => onCardClick?.(card.value)}
					>
						<PlayingCard cardValue={card.value} />
					</div>
				))}
			</div>
		);
	}

	// если нужна прокрутка
	return (
		<div className='carousel-container' ref={containerRef}>
			<div
				className='carousel-track'
				style={{ transform: `translateX(-${offset}px)` }}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
			>
				{cardsData.map((card, index) => (
					<div
						key={index}
						className='carousel-item'
						onClick={() => onCardClick?.(card.value)}
					>
						<PlayingCard cardValue={card.value} />
					</div>
				))}
			</div>
		</div>
	);
}
