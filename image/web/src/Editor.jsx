import React from 'react';
import ReactDOM from 'react-dom';
import URI from "urijs";

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/yaml';
import 'brace/theme/github';

import { Graphviz } from 'graphviz-react';

class EditorView extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            error: '',
            yamlSource: '',
            graphVizSource: null
        };
        this.updateGraph = this.updateGraph.bind(this)
    }

    updateGraph(newYAML) {
        this.setState({ yamlSource: newYAML });
        var payload = {
            "wf_def": newYAML
        }
        var json_payload = JSON.stringify(payload)

        var uri = new URI(this.props.uri)
        fetch(uri, {
            headers: new Headers({
                'Content-Type' : 'application/json'
            }),
            method: 'post',
            body: json_payload})
            .then(res => res.json())
            .then(
                (result) => {
                    //return result value here
                    if ('error' in result) {
                        this.setState({ error: result['error'], graphVizSource: null });
                    } else if ('agraph_string' in result) {

                        this.setState({ error: null, graphVizSource: result['agraph_string'] });
                    }
                }
            )
    }

    render() {
        return (
            <div>
                <div className="row">

                    <div className="col-4">
                        <AceEditor
                            value={this.state.yamlSource}
                            mode="yaml"
                            theme="github"
                            onChange={(newYAML) => {this.updateGraph(newYAML)}}
                            debounceChangePeriod={750}
                            name="uid"
                            editorProps={{$blockScrolling: true}}
                            height='1000px'
                            width='100%'
                            tabSize={2}
                            showPrintMargin={false}
                        />
                    </div>

                    <div className="col-8">
                        {this.state.error == null &&
                                <Graphviz
                                    dot={this.state.graphVizSource}
                                    options={{'height': 1000, 'width': '100%', 'zoom': true}}
                                />
                        }
                        {this.state.graphVizSource == null &&
                                <p>{this.state.error}</p>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

EditorView.defaultProps= {
    uri: "/create_graph"
}

var container = document.getElementById('container');
ReactDOM.render(<EditorView {...(container.dataset)}/>, container);
