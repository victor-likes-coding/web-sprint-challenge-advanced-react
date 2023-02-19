import React, { useState, useEffect } from "react";

const useCoordinates = () => {
    const [x, setX] = useState(2);
    const [y, setY] = useState(2);

    const setCoordinates = (index) => {
        // imagine position 4 is the center of the grid
        // it's position is 2,2
        // top left is 1,1
        const x = (index % 3) + 1;
        const y = Math.floor(index / 3) + 1;
        setX(x);
        setY(y);
    };

    return [x, y, setCoordinates];
};

export default function AppFunctional(props) {
    const [activeSquare, setActiveSquare] = useState(4);
    const [moves, setMoves] = useState(0);
    const [x, y, setCoordinates] = useCoordinates();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    let displayMessage = message;

    useEffect(() => {
        displayMessage = message;
    }, [message]);

    // moving up or down will change the active square by 3
    // moving left or right will change the active square by 1

    // if moving up or down make sure that when adding 3 to the active square that it is not greater than 8 or less than 0
    // if moving left or right based on where we are like 4 for example we can move to 3 or 5 but not 6, 7, or 8 as well as 0, 1, or 2
    const getDirectionalValue = (direction) => {
        switch (direction) {
            case "up":
                return -3;
            case "down":
                return 3;
            case "left":
                return -1;
            case "right":
                return 1;
            default:
                return 0;
        }
    };

    const moveHandler = (direction) => {
        // get directional value
        const directionalValue = getDirectionalValue(direction);

        if (direction === "left" || direction === "right") {
            // lets see where we are relative to the grid
            // positions 0 is top, 1 is middle, 2 is bottom if we are going up or down
            const position = activeSquare % 3;

            const newPosition = position + directionalValue;

            // positions 0 is left, 1 is middle, 2 is right if we are going left or right
            // check if adding directionalValue to position will be cause position to "overflow" or "underflow"
            if (newPosition < 0 || newPosition > 2) {
                // figure out some error handling
                setError(`You can't go ${direction}`);
                return;
            }
        }

        if (direction === "up" || direction === "down") {
            // check if adding directionalValue to position will be cause position to "overflow" or "underflow"
            const position = Math.floor(activeSquare / 3);
            const newPosition = position + Math.floor(directionalValue / 3);
            if (newPosition < 0 || newPosition > 2) {
                // figure out some error handling
                setError(`You can't go ${direction}`);
                return;
            }
        }
        // this would be valid so go ahead and set the new active square
        // considering we didn't get stopped out
        setActiveSquare(activeSquare + directionalValue);
        setCoordinates(activeSquare + directionalValue);
        setMoves(moves + 1);
        setError("");
    };

    const sendData = (
        payload = {
            email: "",
            steps: "",
            x: "",
            y: "",
        }
    ) => {
        // send payload to server at http://localhost:9000/api/result
        // use fetch

        const url = "http://localhost:9000/api/result";
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((result) => result.json())
            .then((data) => {
                setMessage(data.message);
            })
            .catch((err) => console.log(err));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendData({
            email,
            steps: moves,
            x,
            y,
        });
        setEmail("");
    };

    const reset = (event) => {
        event.preventDefault();
        setActiveSquare(4);
        setMoves(0);
        setCoordinates(4);
        setEmail("");
        setMessage("");
        setError("");
    };

    return (
        <div
            id="wrapper"
            className={props.className}>
            <div className="info">
                <h3 id="coordinates">
                    Coordinates ({x}, {y})
                </h3>
                <h3 id="steps">
                    You moved {moves} time{moves > 1 || moves === 0 ? "s" : ""}
                </h3>
            </div>
            <div id="grid">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                    <div
                        key={idx}
                        className={`square${idx === activeSquare ? " active" : ""}`}>
                        {idx === activeSquare ? "B" : null}
                    </div>
                ))}
            </div>
            <div className="info">
                <h3 id="message">{displayMessage || error}</h3>
            </div>
            <div id="keypad">
                <button
                    id="left"
                    onClick={() => moveHandler("left")}>
                    LEFT
                </button>
                <button
                    id="up"
                    onClick={() => moveHandler("up")}>
                    UP
                </button>
                <button
                    id="right"
                    onClick={() => moveHandler("right")}>
                    RIGHT
                </button>
                <button
                    id="down"
                    onClick={() => moveHandler("down")}>
                    DOWN
                </button>
                <button
                    id="reset"
                    onClick={reset}>
                    reset
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    id="email"
                    type="email"
                    placeholder="type email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
                <input
                    id="submit"
                    type="submit"></input>
            </form>
        </div>
    );
}
