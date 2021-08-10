#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import os
import traceback

from flask import Flask, Blueprint, render_template, request
from orquesta.specs import native as specs
from orquesta.composers import native
from networkx.drawing.nx_agraph import to_agraph
from yaml.scanner import ScannerError


app = Flask(__name__)
node_modules_blueprint = Blueprint('node_modules', __name__, static_folder='node_modules')
app.register_blueprint(node_modules_blueprint)

workflow_composer = native.WorkflowComposer()

@app.route("/")
def editor():
    return render_template('Editor.html')


@app.route('/create_graph', methods=['POST'])
def create_graph():
    data = request.get_json()
    wf_def = data['wf_def']

    agraph = generate_agraph_string(wf_def)
    return json.dumps(agraph)


def generate_agraph_string(wf_def):

    try:
        workflow_spec = specs.WorkflowSpec(wf_def)
        wf_graph = workflow_composer.compose(workflow_spec)
    # catch potential errors that arise from parsing.  TODO: what is ScannerError?
    except (AttributeError, KeyError, ScannerError, TypeError, ValueError):
        tb = traceback.format_exc(1)
        return {'error': tb}

    G = wf_graph._graph

    if 'noop' in G:
        G.remove_node('noop')

    A = to_agraph(G)
    A.edge_attr.update(fontsize='10.0')

    for g_edge in G.edges():

        a_edge = A.get_edge(*g_edge)
        g_edge_data = G.get_edge_data(*g_edge)

        # pull the transition criteria out of the networkx graph
        g_edge_crit = g_edge_data[0]['criteria']
        g_edge_label = '' if not g_edge_crit else g_edge_crit[0]
        # remove some special chars
        g_edge_label = g_edge_label.replace('<', '&lt;').replace('%', '&#37;').replace('>', '&gt;')
        a_edge.attr['label'] = g_edge_label

        if 'succeeded' in g_edge_label:
            a_edge.attr['color'] = 'green'
        elif 'failed' in g_edge_label:
            a_edge.attr['color'] = 'red'

    return {'agraph_string': A.to_string()}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)
