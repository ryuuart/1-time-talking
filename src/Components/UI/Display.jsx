import React from 'react';

export class ReceiverDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.ws = this.props.socket;
    }

    render() {
        return (
            <article className={`messages-display ${this.props.className}`}>
                We are Mobi — we have a lot of fun and make stuff too from 2008 – 2077
            </article>
        )
    }
}

export class SenderDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: "", messasge: "" };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(event) {
        this.setState((state, props) => ({
            message: state.value
        }), () => {
            this.props.socket.send(JSON.stringify({ userName: this.props.userName, message: this.state.message }));
        })

        event.preventDefault();
    }

    onChange(event) {
        this.setState({
            value: event.target.value
        })
    }

    render() {
        return (
            <article className={`messages-display ${this.props.className}`}>
                <div className="messages-display--message">
                    {this.state.message}
                </div>

                <form className={`messages-display--form`} onSubmit={this.onSubmit}>
                    <textarea rows="1" autoresize="true" value={this.state.value} onChange={this.onChange} />
                    <input type="submit" value="Submit" />
                </form>
            </article>
        )
    }
}