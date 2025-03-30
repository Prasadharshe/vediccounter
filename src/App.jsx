import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faRedo, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const getStoredValue = (key, defaultValue) =>
    JSON.parse(localStorage.getItem(key)) ?? defaultValue;

  const [count, setCount] = useState(() => getStoredValue("counterValue", 0));
  const [startingNumber, setStartingNumber] = useState(() =>
    getStoredValue("startingNumber", 0)
  );
  const [showWelcome, setShowWelcome] = useState(true);
  // const [showModal, setShowModal] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(() =>
    getStoredValue("completedCycles", 0)
  );
  const [lastCycleCount, setLastCycleCount] = useState(() =>
    getStoredValue("lastCycleCount", 0)
  );
  const [showCycleMessage, setShowCycleMessage] = useState(false);

  useEffect(() => {
    ["counterValue", "startingNumber", "completedCycles", "lastCycleCount"].forEach((key, i) =>
      localStorage.setItem(key, JSON.stringify([count, startingNumber, completedCycles, lastCycleCount][i]))
    );
  }, [count, startingNumber, completedCycles, lastCycleCount]);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  const handleStartingNumberChange = (e) => {
    const newStart = parseInt(e.target.value, 10) || 0;
    setStartingNumber(newStart);
    setCount(newStart);
    setCompletedCycles(0);
    setLastCycleCount(0);
  };

  const increaseCounter = () => {
    const newCount = count + 1;
    setCount(newCount);

    if ((newCount - startingNumber) % 108 === 0 && newCount !== lastCycleCount) {
      setCompletedCycles((prev) => prev + 1);
      setLastCycleCount(newCount);
      setShowCycleMessage(true);
      setTimeout(() => setShowCycleMessage(false), 4000);
    }
  };

  const decreaseCounter = () => count > 0 && setCount(count - 1);

  const resetCounter = () => {
    const confirmReset = window.confirm("Are you sure you want to reset the counter?");
    if (confirmReset) {
      setCount(0); // Reset counter to 0
      setCycleCount(0); // Reset cycle count if applicable
      setCompletedCycles([]); // Clear stored cycles (if using dots)
      localStorage.removeItem("cycleCount"); // Remove stored data
      localStorage.removeItem("completedCycles");
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
        {Array.from({ length: completedCycles }).map((_, i) => <span key={i} className="dot"></span>)}
      </div>

      {showCycleMessage && <div className="cycle-message samarkan-text">🎉 1 Cycle Completed! 🎉</div>}
      <h1 className="counter samarkan-text">{count}</h1>

      <div className="button-container">
        {count > 0 && <button className="minus" onClick={decreaseCounter}><FontAwesomeIcon icon={faMinus} /></button>}
        <FontAwesomeIcon icon={faRedo} className="reset-icon" onClick={resetCounter} />
        <button className="plus" onClick={increaseCounter}><FontAwesomeIcon icon={faPlus} /></button>
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