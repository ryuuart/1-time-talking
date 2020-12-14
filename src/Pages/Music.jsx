
import React from "react";

import Login from "./Login";

// Components 
import { MusicReceiverDisplay, MusicSenderDisplay } from '../Components/UI/Display';
import Modal from '../Components/UI/Modal';

import { Duration } from 'luxon';

export default class Music extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ws: null,
            userName: "",
            dataFromServer: null,
            yturl: 0,
            modalEnabled: false,
        }

        this.clock = null;

        this.initWebSocket = this.initWebSocket.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.onYTURLChange = this.onYTURLChange.bind(this);
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

        this.ws = new WebSocket("ws://192.168.1.172:8081/");
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

    onYTURLChange(event) {
        this.setState({
            yturl: event.target.value
        })
    }

    onModalSubmit() {
        this.setState((state, props) => ({
            yturl: state.yturl,
            modalEnabled: false
        }), () => {

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
                <Modal title="YouTube URL" onModalSubmitHandler={this.onModalSubmit} style={{display: this.state.modalEnabled ? "flex" : "none"}}>
                    <input onChange={this.onYTURLChange}/>
                </Modal>
                <Login initWebSocket={this.initWebSocket} setUserName={this.setUserName} />
                <MusicReceiverDisplay socket={this.state.ws} userName={this.state.userName} data={this.state.dataFromServer} className="messages-display--receiver" />
                <MusicSenderDisplay resetHandler={() => {
                    this.setState((state, props) => ({
                        yturl: ""
                    }))
                }}yturl={this.state.yturl} enableModal={this.enableModal} availability={this.state.yturl} socket={this.state.ws} userName={this.state.userName} lassName="messages-display--sender" />
            </React.Fragment>
        )
    }
}