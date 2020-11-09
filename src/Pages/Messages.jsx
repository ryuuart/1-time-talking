import React from "react";

import Login from "./Login";

// Components 
import { ReceiverDisplay, SenderDisplay } from '../Components/UI/Display';

export default class Messages extends React.Component {
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

        this.ws = new WebSocket("ws://localhost:8080/");
        this.setState({
            ws: this.ws,
        })

        this.ws.onmessage = evt => {
            const message = JSON.parse(evt.data);
            this.setState({ dataFromServer: message });
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
                <ReceiverDisplay socket={this.state.ws} userName={this.state.userName} data={this.state.dataFromServer} className="messages-display--receiver" />
                <SenderDisplay socket={this.state.ws} userName={this.state.userName} lassName="messages-display--sender" />
            </React.Fragment>
        )
    }
}