import React from 'react';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="modal" style={this.props.style}>
                <div className="modal__container">
                   <h2>{this.props.title || "Default Title"}</h2> 
                    <div>
                        {this.props.children}
                    </div>
                   <input type="button" onClick={this.props.onModalSubmitHandler} value="Submit"/>
                </div>
            </div>
        )
    }
}