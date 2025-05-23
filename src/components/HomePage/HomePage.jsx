import React from 'react';
import { PlayingCard } from '../../components';

const HomePage = () => {
    return (
        <section className="hero pageContainer">
            <h1>Голосуйте и оценивайте задачи в режиме реального времени</h1>
            <p>Наш четкий и понятный интерфейс не только прост в использовании, но и обеспечивает выдающееся
                взаимодействие команды для оценки проектов по разработке.</p>
            <div style={{display: 'flex', margin: '10px'}}>
                <div style={{margin: '10px', padding: '10px'}}>
                    <PlayingCard randomCardSuit={0} cardValue="L" />
                </div>
                <div style={{margin: '10px', padding: '10px'}}>
                    <PlayingCard randomCardSuit={1} cardValue="XL" />
                </div>
                <div style={{margin: '10px', padding: '10px'}}>
                    <PlayingCard randomCardSuit={2} cardValue="XXL" />
                </div>
                <div style={{margin: '10px', padding: '10px'}}>
                    <PlayingCard randomCardSuit={3} cardValue="?" />
                </div>
            </div>
        </section>
    );
}

HomePage.displayName = 'HomePage';
export default HomePage;