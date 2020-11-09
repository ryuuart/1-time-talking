import React from 'react';

export class ReceiverDisplay extends React.Component {
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

export class SenderDisplay extends React.Component {
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