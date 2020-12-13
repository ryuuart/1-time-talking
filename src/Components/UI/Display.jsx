import React from 'react';
import { DateTime, Duration } from 'luxon';
import { lerpColor, clamp } from '../../Utils/math';

export class GeneralReceiverDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.ws = this.props.socket;
    }

    render() {
        return (
            <article className={`messages-display ${this.props.className}`} style={{ background: this.props.data && this.props.data.message.colorValue }}>
                {this.props.data && this.props.data.message.textValue}
            </article>
        )
    }
}

export class GeneralSenderDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            textValue: "", colorValue: "", message: {
                textValue: "",
                colorValue: "#FFFFFF",
            }
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onColorChange = this.onColorChange.bind(this);
    }

    onSubmit(event) {
        this.setState((state, props) => ({
            message: {
                textValue: this.state.textValue,
                colorValue: this.state.colorValue,
            }
        }), () => {                
            // console.log(this.state.message)
            this.props.socket.send(JSON.stringify({ userName: this.props.userName, message: this.state.message }));
        })

        event.preventDefault();
    }

    onTextChange(event) {
        this.setState({
            textValue: event.target.value
        })
    }

    onColorChange(event) {
        this.setState({
            colorValue: event.target.value
        })
    }

    render() {
        return (
            <article className={`messages-display ${this.props.className}`} style={{ background: this.state.colorValue }}>
                <div className="messages-display--message">
                    {this.state.textValue}
                </div>

                <form className={`messages-display--form`} onSubmit={this.onSubmit}>
                    <textarea rows="1" autoresize="true" value={this.state.textValue} onChange={this.onTextChange} />
                    <input type="color" value={this.state.colorValue} onChange={this.onColorChange} />
                    <input type="submit" value="Submit" />
                </form>
            </article>
        )
    }
}

export class DayReceiverDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.ws = this.props.socket;
    }

    render() {
        return (
            <article className={`messages-display ${this.props.className}`} style={{ 
                color: this.props.data && (this.props.data.message.time < 0.2 || this.props.data.message.time >= 0.76) ? "white" : "black", 
                background: this.props.data && `linear-gradient(180deg, ${ this.props.data.message.startColor } 0%, ${ this.props.data.message.colorValue } 80%)` 
            }}>
                {this.props.data && this.props.data.message.textValue}
            </article>
        )
    }
}

export class DaySenderDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            textValue: "", colorValue: "", startColor: "", message: {
                textValue: "",
                startColor: "#FFFFFF",
                colorValue: "#FFFFFF",
                time: 0,
            },
            time: 0 
        };

        this.timeInterval = null;
        this.gradientMap = [
            {
                border: 0,
                color: "#040E32"
            },
            {
                border: 0.2,
                color: "#268AE7"
            },
            {
                border: 0.3,
                color: "#FADE50"
            },
            {
                border: 0.5,
                color: "#FFFFFF"
            },
            {
                border: 0.6,
                color: "#FFFFFF"
            },
            {
                border: 0.7,
                color: "#F6A342"
            },
            {
                border: 0.8,
                color: "#1F1CB9"
            },
            {
                border: 1.0,
                color: "#040E32"
            }
        ]

        this.onSubmit = this.onSubmit.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    componentDidMount() {
        this.timeInterval = setInterval(() => {
            let currDate = DateTime.local();
            let currTime = Duration.fromObject({hour: currDate.hour, minute: currDate.minute, second: currDate.second, millisecond: currDate.millisecond})
            let time = (currTime.as('seconds') / Duration.fromObject({hour: 24 }).as('seconds')); 

            let colorA;
            let colorB;

            for (let i = 1; i < this.gradientMap.length; i++) {
                if (time >= this.gradientMap[i - 1].border && time <= this.gradientMap[i].border) {
                    colorA = this.gradientMap[i - 1];
                    colorB = this.gradientMap[i];
                }
            }

            let startColor = lerpColor(colorA.color, colorB.color, clamp((time - 0.05 - colorA.border)/(colorB.border - colorA.border), 0, 1));
            let newColor = lerpColor(colorA.color, colorB.color, (time - colorA.border)/(colorB.border - colorA.border));

            console.log(`linear-gradient(180deg, ${ this.state.startColor} 0%, ${ this.state.colorValue } 100%);`)

           this.setState((state, props) => ({
               startColor: startColor,
               colorValue: newColor,
               time: time,
               message: {
                    textValue: state.textValue,
                    startColor: startColor,
                    colorValue: newColor,
                    time: time
               }
           }), () => {
                this.props.socket && this.props.socket.send(JSON.stringify({ userName: this.props.userName, message: this.state.message }));
           }) 
        }, 1000);
    }

    onSubmit(event) {
        this.setState({
            textValue: ""
        }, () => {
            this.props.socket && this.props.socket.send(JSON.stringify({ userName: this.props.userName, message: this.state.message }));
        });
        event.preventDefault();
    }

    componentWillUnmount() {
        clearInterval(this.timeInterval);
    }

    onTextChange(event) {
        this.setState((state, props) => ({
            textValue: event.target.value,
            message: {
                textValue: event.target.value,
                colorValue: state.colorValue,
                startColor: state.startColor,
                time: state.time
            }
        }), () => {                
            this.props.socket && this.props.socket.send(JSON.stringify({ userName: this.props.userName, message: this.state.message }));
        })
    }

    render() {
        return (
            <article className={`messages-display ${this.props.className}`} style={{ color: (this.state.time < 0.2 || this.state.time >= 0.76) ? "white" : "black", background: `linear-gradient(180deg, ${ this.state.startColor } 0%, ${ this.state.colorValue } 80%)` }}>
                <div className="messages-display--message">
                    {this.state.textValue}
                </div>

                <form className={`messages-display--form`} onSubmit={this.onSubmit}>
                    <textarea rows="1" autoresize="true" value={this.state.textValue} onChange={this.onTextChange} />
                    <input type="submit" value="Clear" />
                </form>
            </article>
        )
    }
}