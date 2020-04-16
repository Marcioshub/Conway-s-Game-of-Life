import React, { useState, useCallback, useRef } from "react";
import { produce } from "immer";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "./App.css";

function App() {
  const numRows = 25;
  const numCols = 25;
  const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
  ];

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  function generateEmptyGrid() {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  }

  function generateRandom() {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(
        Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
      );
    }

    setGrid(rows);
  }

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    // simulate
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);

    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Information</ModalHeader>
        <ModalBody>
          The Game of Life, also known simply as Life, is a cellular automaton
          devised by the British mathematician John Horton Conway in 1970. The
          game is a zero-player game, meaning that its evolution is determined
          by its initial state, requiring no further input. One interacts with
          the Game of Life by creating an initial configuration and observing
          how it evolves. It is Turing complete and can simulate a universal
          constructor or any other Turing machine.
        </ModalBody>
        <ModalFooter>
          <Button color="info" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <h4 style={{ marginTop: 20 }}>Conway's Game of Life</h4>
      <Button
        color="primary"
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </Button>{" "}
      <Button color="success" onClick={() => generateRandom()}>
        Random
      </Button>{" "}
      <Button color="danger" onClick={() => setGrid(generateEmptyGrid())}>
        Clear
      </Button>{" "}
      <Button color="info" onClick={toggle}>
        Info
      </Button>{" "}
      <div className="centered">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 20px)`,
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                key={`${i}-${k}`}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][k] ? "#32CD32" : undefined,
                  border: "solid 1px black",
                }}
                onClick={() => {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
              ></div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
