import * as THREE from './vendor/three.module.js';
import "./vendor/3d-force-graph.min.js";
import { CSS2DRenderer, CSS2DObject } from './vendor/CSS2DRenderer.js';
import DataroomElement from './dataroom-element.js'
import './graph-node.js';

class ForceGraphComponent extends DataroomElement {

  drawOverlay(node) {
    force_graph_overlay.innerHTML = `
      <h3>${node.id}</h3>
    `
  }

  focusOnNode(node) {
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    const newPos = node.x || node.y || node.z ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio } : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

    this.Graph.cameraPosition(
      newPos, // new position
      node, // lookAt ({ x, y, z })
      3000 // ms transition duration
    );

    // [...document.querySelectorAll('.node-label')].forEach(n => {
    //   n.classList.remove('selected');
    // });

    // document.querySelector(`#node-${node.id}`).classList.add('selected')

  }

    // Function to load graph.json and parse it into a JavaScript object
  async loadJson(filename) {
    if(filename.length < 1){
      return {
        nodes:[],
        links:[]
      }
    }
      try {
          const response = await fetch(filename);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Loaded graph.json:', data);
          return data;
      } catch (error) {
          console.error('Could not load graph.json:', error);
      }
  }

  renderNodeObject(node){
    const group = new THREE.Object3D();

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 200,
      opacity: 0.4,
      transparent: true,
    });

    const geometry = new THREE.SphereGeometry(2);
    const cube = new THREE.Mesh(geometry, material);
    const nodeEl = document.createElement('div');
    nodeEl.textContent = node.id;
    nodeEl.className = 'node-label';
    nodeEl.id = `node-${node.id}`
    const label = new CSS2DObject(nodeEl);
    group.add(cube);

    group.add(label);

    return group
  }


  async initialize() {

    /* Get the CSS Values for styling */
    const style = window.getComputedStyle(this, null);

    this.backgroundColor = style.backgroundColor;
    this.foregroundColor = style.color;

    this.width = this.getAttribute('width');
    if (this.width === null) {
      this.width = this.parentNode.offsetWidth ;
    }

    this.height = this.getAttribute('height');
    if (this.height === null) {
      this.height = window.innerHeight / 1.3
    }

    const src = this.getAttribute('src');
    const graph_data = await this.loadJson(src);
    const markup_nodes = [...this.querySelectorAll('graph-node')].map(node => {
      return {id: node.id}
    });
    const markup_links = [...this.querySelectorAll('graph-link')].map(link => {
      return {
        source: link.getAttribute('source'),
        target: link.getAttribute('target')
      }
    });

    graph_data.nodes = Object.assign(graph_data.nodes, markup_nodes);
    graph_data.links = Object.assign(graph_data.links, markup_links);

    this.Graph = ForceGraph3D({ controlType: 'orbit', extraRenderers: [new CSS2DRenderer()] })
      (this)
      .width(this.width)
      .height(this.height)
      .backgroundColor(this.backgroundColor)
      .linkColor('white')
      .linkOpacity(1)
      .linkDirectionalParticles(5)
      .linkWidth(0)
      .graphData(graph_data)
      // .jsonUrl(this.src)
      // .nodeVal(node => {
      //   return node.size
      // })
      .nodeThreeObject(node => {
        return this.renderNodeObject(node);
      })
      // .onNodeHover((node, prevNode) => {
      //   if(prevNode !== null){
      //     document.querySelector(`#node-${prevNode.id}`).classList.remove('hovered');
      //   }

      //   if(node !== null){
      //     document.querySelector(`#node-${node.id}`).classList.add('hovered');
      //   }

      // })
      .cooldownTicks(100)
      .nodeThreeObjectExtend(false)
      .zoomToFit(10, 10, node => true)
      .onNodeClick((node, event) => {
        this.focusOnNode(node);
        // this.drawOverlay(node);
      });

    let loaded = false;

    this.Graph.onEngineStop(() => {
      if (!loaded) {
        let { nodes, links } = this.Graph.graphData();
        this.focusOnNode(nodes[0]);
        loaded = true;
      }
    });

    this.overlay = document.createElement('div');
    this.overlay.setAttribute('id', 'force-graph-overlay');
    this.appendChild(this.overlay);

  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, old_value, new_value) {
    switch (name) {
      default:
    }
  }
}

customElements.define('graph-data', ForceGraphComponent)