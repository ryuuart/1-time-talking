import React from 'react';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {value: "", messasge: ""};

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(event) {
        // this.setState((state, props) => ({
        //     message: state.value
        // }))
        fetch('http://localhost:8080/login', { method: 'POST', credentials: 'include' })
            .then((response) => {
                return response.ok
                ? response.json()
                    .then((data) => { 
                        this.props.initWebSocket();

                        return JSON.stringify(data, null, 2);
                    })
                : Promise.reject(new Error('Unexpected response'));
            })
            .then((message) => console.log(message))
            .catch(function (err) {
                console.error(err.message);
            });


        event.preventDefault();
    }

    onChange(event) {
        // this.setState({
        //     value: event.target.value 
        // })
    }

    render() {
        return (
            <React.Fragment>
                <h1>Login</h1>
                <form onSubmit={this.onSubmit}>
                    <label htmlFor="input">Your name</label>
                    <input type="text" />
                    <input type="submit" value="Login" />
                    <input type="button" value="Logout" />
                </form>
            </React.Fragment>
        )
    }
}