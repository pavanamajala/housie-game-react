import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [selectedNum, setSelectedNum] = useState([]);
  const [timeRange, setTimeRange] = useState(1000);
  const [started, setStarted] = useState(false);
  const [pause, setPause] = useState(false);
  const timeoutRef = useRef(null);

  const numberRow = (num) => {
    const className = `numbers ${selectedNum.includes(num) && 'selected-num'}`
    if (num % 10 === 0) return <><b className={className} key={num}>{num}</b><br /><br /></>;
    return <b className={className} key={num}>{num}</b>;
  }

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 90) + 1;
  }

  useEffect(() => {
    if (started && selectedNum.length < 90 && timeRange >= 500 && !pause) {
      timeoutRef.current = setTimeout(() => {
        let randomNum = getRandomNumber();
        while (selectedNum.includes(randomNum)) {
          randomNum = getRandomNumber();
        }
        const audio = new Audio(`${process.env.PUBLIC_URL}/numbers-audio/${randomNum}.wav`);
        audio.play().catch(error => {
          console.error('Playback failed', error);
        });
        setSelectedNum(prevNums => [...prevNums, randomNum]);
      }, timeRange);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [selectedNum, timeRange, started, pause]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="app-title">Housie Board</h1>
        <p className="app-description">Generate and track numbers with ease!</p>
      </header>
      <div className="App-content">
        {!started ? (
          <div className="center-container">
            <button className="styled-button" onClick={() => { setStarted(true) }}>Start Game</button>
          </div>
        ) : (
          <>
            <div className='top-button-container'>
              <input
                type="range"
                value={timeRange}
                min={500}
                max={10000}
                step={500}
                onChange={(e) => setTimeRange(Number(e.target.value))}
              />
              <span>{Math.round(timeRange / 1000)} Sec</span>
              <div className='pause-button'>
                <button className="styled-button" onClick={() => { setPause(!pause) }}>PAUSE</button>
              </div>
            </div>
            <div className="num-grid">
              {Array.from({ length: 90 }, (_, index) => numberRow(index + 1))}
            </div>
            <div className="number-display-container">
              {selectedNum.slice(selectedNum.length - 6, -1)?.map(item => (
                <div key={item} className="number-display">{item}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
