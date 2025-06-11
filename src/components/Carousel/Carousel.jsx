import React, { useState, useEffect, useRef, useMemo } from "react";
import { PlayingCard } from "../../components";
import "./Carousel.css";

// --- Вспомогательные функции ---
const getRandomSuit = () => {
    const suits = ["hearts", "diams", "spades", "clubs"];
    const randomIndex = Math.floor(Math.random() * suits.length);
    return suits[randomIndex];
};

const getSuitColor = (suit) => {
    return suit === "hearts" || suit === "diams" ? "red" : "black";
};

// --- Хук для определения необходимости карусели ---
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

// --- Компонент Карусели ---
export default function Carousel({ items = [], onCardClick }) {
    const cardWidth = 120; // ширина одной карты + gap
    const { isCarouselNeeded, containerRef } = useIsCarouselNeeded();
    const [offset, setOffset] = useState(0);
    const [touchPosition, setTouchPosition] = useState(null);

    const maxOffset = (items.length - 1) * (cardWidth / 1.3); // можно подстроить

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

        if (diff > 5) {
            moveLeft();
        } else if (diff < -5) {
            moveRight();
        }

        setTouchPosition(null);
    };

    // Генерируем уникальные данные для каждой карты один раз при первом рендере
    const cardsData = useMemo(() => {
        return items.map(value => ({
            value,
            suit: getRandomSuit(),
            color: getSuitColor(getRandomSuit())
        }));
    }, [items]);

    if (!isCarouselNeeded) {
        return (
            <div className="card-list" ref={containerRef}>
                {cardsData.map((card, index) => (
                    <div
                        key={index}
                        className="carousel-item"
                        onClick={() => onCardClick(card.value, card.suit)}
                    >
                        <PlayingCard
                            cardSuitName={card.suit}
                            cardValue={card.value}
                            cardColor={card.color}
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="carousel-container" ref={containerRef}>
            <div
                className="carousel-track"
                style={{ transform: `translateX(-${offset}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
            >
                {cardsData.map((card, index) => (
                    <div
                        key={index}
                        className="carousel-item"
                        onClick={() => onCardClick(card.value, card.suit)}
                    >
                        <PlayingCard
                            cardSuitName={card.suit}
                            cardValue={card.value}
                            cardColor={card.color}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}