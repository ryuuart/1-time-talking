import React from "react";

import Login from "./Login";

// Components 
import { TaskReceiverDisplay, TaskSenderDisplay } from '../Components/UI/Display';
import Modal from '../Components/UI/Modal';

import { Duration } from 'luxon';

export default class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ws: null,
            userName: "",
            dataFromServer: null,
            availability: 0,
            modalEnabled: false,
            time: 0,
            clockValue: 0,
        }

        this.clock = null;

        this.initWebSocket = this.initWebSocket.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.onAvailabilityChange = this.onAvailabilityChange.bind(this);
        this.onModalSubmit = this.onModalSubmit.bind(this);
        this.enableModal = this.enableModal.bind(this);
    }

    setUserName(name) {
        this.setState({
            userName: name 
        })
    }

    initWebSocket() {
        if (this.ws) {
            this.ws.onerror = this.ws.onopen = this.ws.onclose = null;
            this.ws.close();
        }

        if (process.env.NODE_ENV === "development")
            url = "http://192.168.1.172:8081/users/login"
        else if (process.env.NODE_ENV === "production")
            url = "https://time-talking-app.herokuapp.com/users/login/"
        this.setState({
            ws: this.ws,
        })

        this.ws.onmessage = evt => {
            const message = JSON.parse(evt.data);
            if (message.userName !== this.state.userName) {
                this.setState({ dataFromServer: message });
            }
            console.log(message)
        }

        this.ws.onerror = function () {
            console.error('WebSocket error');
        }

        this.ws.onopen = () => {
            console.log('connected');
        }

        this.ws.onclose = () => {
            console.log('disconnected');
            this.ws = null;
        }
    }

    onAvailabilityChange(event) {
        this.setState({
            availability: event.target.value
        })
    }

    onModalSubmit() {
        this.setState((state, props) => ({
            availability: state.availability,
            modalEnabled: false
        }), () => {
            if (!this.clock)
                this.clock = setInterval(() => {
                this.setState((state, props) => ({
                    time: state.time + 1,
                    clockValue: (state.time + 1)/(Duration.fromObject({minute: this.state.availability}).as('seconds'))
                }));
            
                if (this.state.time >= Duration.fromObject({minute: this.state.availability}).as("seconds")) {
                    clearInterval(this.clock);
                    this.clock = null;
                }
                }, 1000);
        })
    }

    enableModal() {
        this.setState({
            modalEnabled: true
        })
    }

    render() {
        return (
            <React.Fragment>
                <Modal title="Time Availability" onModalSubmitHandler={this.onModalSubmit} style={{display: this.state.modalEnabled ? "flex" : "none"}}>
                   <input className="task__slider" type="range" value={this.state.availability} min="0" max="180" onChange={this.onAvailabilityChange}/> 
                   <h3>Available for</h3>
                   <p>{this.state.availability} minutes.</p>
                </Modal>
                <Login initWebSocket={this.initWebSocket} setUserName={this.setUserName} />
                <TaskReceiverDisplay socket={this.state.ws} userName={this.state.userName} data={this.state.dataFromServer} className="messages-display--receiver" />
                <TaskSenderDisplay resetHandler={() => {
                    clearInterval(this.clock);
                    this.clock = null;
                    this.setState({
                        time: 0,
                        clockValue: 0
                    })
                }}clockValue={this.state.clockValue} enableModal={this.enableModal} availability={this.state.availability} socket={this.state.ws} userName={this.state.userName} lassName="messages-display--sender" />
            </React.Fragment>
        )
    }
}