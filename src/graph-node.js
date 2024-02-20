import DataroomElement from './dataroom-element.js';

class GraphNode extends HTMLElement {
  async initialize(){
    console.log('this is a node....');
  }
}

customElements.define('graph-node', GraphNode)