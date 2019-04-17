import React from 'react';
import ReactDOM from 'react-dom';
import URI from "urijs";

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/yaml';
import 'brace/theme/github';

import Orquesta from './components/Orquesta.jsx';

class EditorView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            yamlSource: ''
        };
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
                            onChange={(newYAML) => {this.setState({ yamlSource: newYAML })}}
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
                        <Orquesta yaml={this.state.yamlSource} />
                    </div>
                </div>
            </div>
        );
    }
}

var container = document.getElementById('container');
ReactDOM.render(<EditorView {...(container.dataset)}/>, container);
