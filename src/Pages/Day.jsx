
import React from "react";

import Login from "./Login";

// Components 
import { DayReceiverDisplay, DaySenderDisplay } from '../Components/UI/Display';

export default class Day extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ws: null,
            userName: "",
            dataFromServer: null,
        }

        this.initWebSocket = this.initWebSocket.bind(this);
        this.setUserName = this.setUserName.bind(this);
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
            this.ws = new WebSocket("ws://192.168.1.172:8081/");
        else if (process.env.NODE_ENV === "production")
            this.ws = new WebSocket("ws://time-talking-app.herokuapp.com");
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

    render() {
        return (
            <React.Fragment>
                <Login initWebSocket={this.initWebSocket} setUserName={this.setUserName} />
                <DayReceiverDisplay socket={this.state.ws} userName={this.state.userName} data={this.state.dataFromServer} className="messages-display--receiver" />
                <DaySenderDisplay socket={this.state.ws} userName={this.state.userName} lassName="messages-display--sender" />
            </React.Fragment>
        )
    }
}