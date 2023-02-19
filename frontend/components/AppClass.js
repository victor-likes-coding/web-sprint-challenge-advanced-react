import React from "react";

export default class AppClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: 0,
            activeSquare: 4,
            message: "",
            email: "",
            errors: "",
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.state.activeSquare !== nextState.activeSquare ||
            this.state.message !== nextState.message ||
            this.state.email !== nextState.email ||
            this.state.steps !== nextState.steps ||
            this.state.errors !== nextState.errors
        );
    }

    getX = () => {
        // x is determined by active square mod 3 + 1
        return (this.state.activeSquare % 3) + 1;
    };

    getY = () => {
        // y is determined by flooring active square / 3 + 1
        return Math.floor(this.state.activeSquare / 3) + 1;
    };

    getCoordinates = () => {
        return `(${this.getX()}, ${this.getY()})`;
    };

    getDirectionalValue = (direction) => {
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

    moveHandler = (direction) => {
        // get directional value
        const directionalValue = this.getDirectionalValue(direction);
        if (this.state.message || this.state.errors) {
            this.setState({ message: "", errors: "" });
        }

        if (direction === "left" || direction === "right") {
            // lets see where we are relative to the grid
            // positions 0 is top, 1 is middle, 2 is bottom if we are going up or down
            const position = this.state.activeSquare % 3;

            const newPosition = position + directionalValue;

            // positions 0 is left, 1 is middle, 2 is right if we are going left or right
            // check if adding directionalValue to position will be cause position to "overflow" or "underflow"
            if (newPosition < 0 || newPosition > 2) {
                // figure out some error handling
                this.setState({ errors: `You can't go ${direction}` });
                return;
            }
        }

        if (direction === "up" || direction === "down") {
            // check if adding directionalValue to position will be cause position to "overflow" or "underflow"
            const position = Math.floor(this.state.activeSquare / 3);
            const newPosition = position + Math.floor(directionalValue / 3);
            if (newPosition < 0 || newPosition > 2) {
                // figure out some error handling

                this.setState({ errors: `You can't go ${direction}` });
                return;
            }
        }
        // this would be valid so go ahead and set the new active square
        // considering we didn't get stopped out
        this.setState({ activeSquare: this.state.activeSquare + directionalValue, steps: this.state.steps + 1, errors: "" });
    };

    sendData = (
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
                this.setState((prevState) => ({
                    ...prevState,
                    message: data.message,
                }));
            })
            .catch((err) => console.log(err));
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const payload = {
            email: this.state.email,
            steps: this.state.steps,
            x: this.getX(),
            y: this.getY(),
        };
        this.sendData(payload);
        this.setState({ email: "" });
    };

    onReset = (e) => {
        e.preventDefault();
        this.setState({
            steps: 0,
            activeSquare: 4,
            message: "",
            email: "",
            errors: "",
        });
    };

    render() {
        const { className } = this.props;
        return (
            <div
                id="wrapper"
                className={className}>
                <div className="info">
                    <h3 id="coordinates">Coordinates {this.getCoordinates()}</h3>
                    <h3 id="steps">
                        You moved {this.state.steps} time{this.state.steps > 1 || this.state.steps === 0 ? "s" : ""}
                    </h3>
                </div>
                <div id="grid">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                        <div
                            key={idx}
                            className={`square${idx === this.state.activeSquare ? " active" : ""}`}>
                            {idx === this.state.activeSquare ? "B" : null}
                        </div>
                    ))}
                </div>
                <div className="info">
                    <h3 id="message">{this.state.message || this.state.errors}</h3>
                </div>
                <div id="keypad">
                    <button
                        id="left"
                        onClick={() => this.moveHandler("left")}>
                        LEFT
                    </button>
                    <button
                        id="up"
                        onClick={() => this.moveHandler("up")}>
                        UP
                    </button>
                    <button
                        id="right"
                        onClick={() => this.moveHandler("right")}>
                        RIGHT
                    </button>
                    <button
                        id="down"
                        onClick={() => this.moveHandler("down")}>
                        DOWN
                    </button>
                    <button
                        id="reset"
                        onClick={this.onReset}>
                        reset
                    </button>
                </div>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input
                        id="email"
                        type="email"
                        placeholder="type email"
                        onChange={(event) => {
                            this.setState({ email: event.target.value });
                        }}
                        value={this.state.email}></input>
                    <input
                        id="submit"
                        type="submit"></input>
                </form>
            </div>
        );
    }
}
