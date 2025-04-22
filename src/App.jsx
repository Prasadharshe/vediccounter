    import { useState, useEffect } from "react";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faPlus, faRedo, faMinus, faInfoCircle, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
    import "./App.css";

    function App() {
      const getStoredValue = (key, defaultValue) =>
        JSON.parse(localStorage.getItem(key)) ?? defaultValue;

      const [count, setCount] = useState(() => getStoredValue("counterValue", 0));
      const [startingNumber, setStartingNumber] = useState(() =>
        getStoredValue("startingNumber", 0)
      );
      const [showWelcome, setShowWelcome] = useState(true);

      const [showInfo, setShowInfo] = useState(false);

      // const [timer, setTimer] = useState(0);

      const [timer, setTimer] = useState(() =>
        JSON.parse(localStorage.getItem("timerValue")) ?? 0
      );

      const [isTimerRunning, setIsTimerRunning] = useState(false);

      // const pauseTimer = () => {
      //   setIsTimerRunning(false);
      // };    

      // bellSound after 108 cycle completes
      const bellSound = new Audio('/vediccounter/ding.mp3');

      // const [showModal, setShowModal] = useState(false);
      const [completedCycles, setCompletedCycles] = useState(() => {
        return parseInt(localStorage.getItem("completedCycles")) || 0;
      });
      
      const [lastCycleCount, setLastCycleCount] = useState(() =>
        getStoredValue("lastCycleCount", 0)
      );
      const [showCycleMessage, setShowCycleMessage] = useState(false);

      useEffect(() => {
        localStorage.setItem("completedCycles", completedCycles);
      }, [completedCycles]);

      useEffect(() => {
        localStorage.setItem("counterValue", JSON.stringify(count));
      }, [count]);
      
      useEffect(() => {
        localStorage.setItem("timerValue", JSON.stringify(timer));
      }, [timer]);
      
      
      useEffect(() => {
        const timer = setTimeout(() => setShowWelcome(false), 5500);
        return () => clearTimeout(timer);
      }, []);

      useEffect(() => {
        let interval;
        if (isTimerRunning) {
          interval = setInterval(() => {
            setTimer((prev) => prev + 1);
          }, 1000);
        }
        return () => clearInterval(interval);
      }, [isTimerRunning]);
      

      const handleStartingNumberChange = (e) => {
        const newStart = parseInt(e.target.value, 10) || 0;
        setStartingNumber(newStart);
        setCount(newStart);
        setCompletedCycles(0);
        setLastCycleCount(0);
      };

      const formatTime = (seconds) => {
        const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${minutes}:${secs}`;
      };
      

      const increaseCounter = () => {
        const newCount = count + 1;
        setCount(newCount);

        if (!isTimerRunning) {
          setIsTimerRunning(true);
        }

        if ((newCount - startingNumber) %  108 === 0 && newCount !== lastCycleCount) {
          setCompletedCycles((prev) => prev + 1);
          setLastCycleCount(newCount);
          setShowCycleMessage(true);
          setTimeout(() => setShowCycleMessage(false), 5000);
          bellSound.play();
          if (navigator.vibrate) {
            navigator.vibrate(200); // Vibrates for 200 milliseconds
          }
        }
      };

      const decreaseCounter = () => count > 0 && setCount(count - 1);

      const resetCounter = () => {
        const confirmReset = window.confirm("Are you sure you want to reset the timer and counter?");
        if (confirmReset) {
          setCount(startingNumber); // Reset counter to the starting number
          setCompletedCycles(0); // Reset cycle count
          setLastCycleCount(0); // Reset last cycle count
          setShowCycleMessage(false); // Hide cycle message
          setTimer(0);         // ✅ Reset timer
          setIsTimerRunning(false);
      
          // Remove from localStorage
          localStorage.removeItem("counterValue");
          localStorage.removeItem("completedCycles");
          localStorage.removeItem("lastCycleCount");
          localStorage.removeItem("timerValue");
        }
      };
      

      if (showWelcome) return <div className="welcome-screen samarkan-text"><h1>Vedic Counter<p className="welcome-screen-p">A Vedic counter where you can keep tracks of your chant cycle.</p></h1>
      </div>;
      
      return (
        <div className="container">
          <div className="title-container">
            <h2 className="title samarkan-text">Vedic Counter</h2>
            <input type="number" className="start-input" placeholder="Enter any number to start with" onChange={handleStartingNumberChange} />
          </div>

          <div className="cycle-dots">
            {Array.from({ length: completedCycles }).map((_, i) => (
            <span key={i} className="dot">{i + 1}</span>  // Numbering each dot
            ))}
          </div>

          {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setShowInfo(false)}>X</button>
            <h2>About <span className="samarkan-text">Vedic Counter</span></h2>
            {/* <p>Welcome to Vedic Counter! This tool helps you keep track of your chant cycles efficiently. Below is a complete guide on how to use it.</p> */}
            <div className="about-text">
              <h3>🛠 How to Use the Counter?</h3>
              <hr />
              <p>1. Enter a starting number (or leave it as 0).</p>
              <p>2. Click the + or - buttons to increment/decrement the count.</p>
              <p>3. Every 108 counts, a cycle dot (🔵) appears.</p>
              <p>4. Click the reset button (🔄) to clear all progress.</p>
              <p>5. The timer starts automatically when you begin counting.</p>
              <p>6. Click the ⏸ Pause button to pause the timer, and ▶ Resume to start it again.</p>
              <p>7. The timer text is red when running and white when paused.</p>
              <p>8. 🔔 A soft bell sound plays on every completed cycle for peaceful feedback.</p>
              <p>9. 📳 Your device will gently vibrate when a cycle (108 counts) is completed (if supported).</p>
              <p>10. Your progress, timer, and completed cycles are saved even after refreshing the page.</p>
              <p>11. Click the ℹ️ 'i' icon anytime for help.</p>
            </div>
          </div>
        </div>
      )}
          {showCycleMessage && <div className="cycle-message samarkan-text">🎉 1 Cycle Completed! 🎉</div>}
          <h1 className="counter samarkan-text">{count}</h1>

          <div className="button-container">
            {count > 0 && <button className="minus" onClick={decreaseCounter}><FontAwesomeIcon icon={faMinus} /></button>}
            <FontAwesomeIcon icon={faRedo} className="reset-icon" onClick={resetCounter} />
            <FontAwesomeIcon icon={faInfoCircle} className="info-icon2" onClick={() => {setShowInfo(true)}}   />
            <button className="plus" onClick={increaseCounter}><FontAwesomeIcon icon={faPlus} /></button>
          </div>

          <div className="timer-section samarkan-text">
          <p className="timer-display" style={{ color: isTimerRunning ? "#ff4800" : "white" }}>Timer: {formatTime(timer)} sec</p>
            <button className="pause-btn" onClick={() => setIsTimerRunning(prev => !prev)}
            title={isTimerRunning ? "Pause" : "Resume"}>{isTimerRunning ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} /> }</button>
          </div>


          
            
            
          {/* {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <p className="modal-p">Are you sure you want to reset the counter?</p>
                <div className="modal-buttons">
                  <button className="modal-btn modal-p cancel" onClick={resetCounter}>Ok</button>
                  <button className="modal-btn modal-p confirm" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )} */}

          
          <footer className="footer">
            <p>© 2025 | Made with ❤️ by <span className="name samarkan-text">Prasad Harshe</span></p>
          </footer>

        </div>
      );
    }

    export default App;