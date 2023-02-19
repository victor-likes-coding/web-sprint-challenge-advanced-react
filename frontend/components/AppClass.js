import React from "react";

export default class AppClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            coordinate: {
                x: 2,
                y: 2,
            },
            steps: 0,
            activeSquare: 4,
            message: "",
            email: "",
        };
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

    render() {
        const { className } = this.props;
        return (
            <div
                id="wrapper"
                className={className}>
                <div className="info">
                    <h3 id="coordinates">Coordinates (2, 2)</h3>
                    <h3 id="steps">You moved 0 times</h3>
                </div>
                <div id="grid">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                        <div
                            key={idx}
                            className={`square${idx === 4 ? " active" : ""}`}>
                            {idx === 4 ? "B" : null}
                        </div>
                    ))}
                </div>
                <div className="info">
                    <h3 id="message"></h3>
                </div>
                <div id="keypad">
                    <button id="left">LEFT</button>
                    <button id="up">UP</button>
                    <button id="right">RIGHT</button>
                    <button id="down">DOWN</button>
                    <button id="reset">reset</button>
                </div>
                <form>
                    <input
                        id="email"
                        type="email"
                        placeholder="type email"></input>
                    <input
                        id="submit"
                        type="submit"></input>
                </form>
            </div>
        );
    }
}
