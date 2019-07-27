import React from 'react';
import ReactDOM from 'react-dom';
import URI from "urijs";

import { Graphviz } from 'graphviz-react';


class Orquesta extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            dot: null,
        };
        this.fetchDotAndUpdateState = this.fetchDotAndUpdateState.bind(this);
    }

    fetchDotAndUpdateState(yaml) {
        if(yaml === ''){
            this.setState({ error: '', dot: null });
            return;
        }
        const json_payload = JSON.stringify({
            "wf_def": yaml
        });

        const uri = new URI("/create_graph");
        fetch(uri, {
            headers: new Headers({
                'Content-Type' : 'application/json'
            }),
            method: 'post',
            body: json_payload})
            .then(res => res.json())
            .then(
                (result) => {
                    if ('error' in result) {
                        this.setState({ error: result['error'], dot: null });
                    } else if ('agraph_string' in result) {
                        this.setState({ error: null, dot: result['agraph_string'] });
                    }
                }
            )
    }

    componentDidMount() {
        this.fetchDotAndUpdateState(this.props.yaml);
    }

    componentDidUpdate(prevProps) {
        if (this.props.yaml !== prevProps.yaml) {
            this.fetchDotAndUpdateState(this.props.yaml);
        }
    }

    render() {
        if(this.state.error === null) {
            return (
                <Graphviz
                    dot={this.state.dot}
                    options={{'height': 1000, 'width': '100%', 'zoom': true}}
                />
            )
        }
        else if (this.state.dot === null) {
            if (this.state.error === '') {
                return (
                    <h6 className='text-center text-secondary'>Workflow graph will appear here</h6>
                )
            }
            return <p>{this.state.error}</p>
        }
    }
}

export default Orquesta;
