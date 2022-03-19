import React from 'react';
class My extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 1}
    }
    render() {
        return (
            <p>{this.state.value}</p>
        )
    }
}
export default My;