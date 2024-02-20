import * as THREE from './vendor/three.module.js';
import "./vendor/3d-force-graph.min.js";
import { CSS2DRenderer, CSS2DObject } from './vendor/CSS2DRenderer.js';
import DataroomElement from './dataroom-element.js';
import { getColor } from './color-palette.js';

class ForceGraphComponent extends DataroomElement {

  findLinks(node){
    const outbound_links = this.graph_data.links.filter(link => {
      return link.source.id === node.id
    });

    const inbound_links = this.graph_data.links.filter(link => {
      return link.target.id === node.id
    })
    return {outbound_links, inbound_links};
  }

  drawOverlay(node) {

    const links = this.findLinks(node);
    const outbound_link_list = links.outbound_links.map(link => {
      return `<li class="node-link" node-id="${link.target.id}">
        ${link.target.title}
      </li>`
    }).join('');

    const inbound_link_list = links.inbound_links.map(link => {
      return `<li class="node-link" node-id="${link.source.id}">
        ${link.source.title}
      </li>`
    }).join('');
    this.overlay.innerHTML = `
      <summary>${node.title}</summary>
      <h3>${node.title}</h3>
      <p>${node.content}</p>
      <h4>${node.id}</h4>

      <h3>Outbound Links</h3>
      <ul>${outbound_link_list}</ul>

      <h3>Inbound Links</h3>
      <ul>${inbound_link_list}</ul>
    `;

    [...this.overlay.querySelectorAll('.node-link')].forEach(list_item => {
      list_item.addEventListener('click', (e) => {
        const node_id = e.target.getAttribute('node-id');
        console.log(node_id);
      })
    })

    this.overlay.setAttribute('open', true);
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
      color: getColor(node.group),
      shininess: 200,
      opacity: 0.7,
      transparent: false,
    });

    const geometry = new THREE.SphereGeometry(node.weight / 10);
    const cube = new THREE.Mesh(geometry, material);
    const nodeEl = document.createElement('div');
    nodeEl.textContent = node.title;
    nodeEl.className = 'node-label';
    nodeEl.id = `node-${node.id}`
    const label = new CSS2DObject(nodeEl);
    group.add(cube);

    group.add(label);

    return group
  }


  async initialize() {
    this.innerHTML = '<dialog open><h1>Loading...</h1></dialog>'

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
      this.height = this.parentNode.offsetHeight;
    }

    const src = this.getAttribute('src');
    const graph_data = this.graph_data = await this.loadJson(src);

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
      .nodeThreeObject(node => {
        return this.renderNodeObject(node);
      })
      .onNodeHover((node, prevNode) => {
        if(prevNode !== null){
          document.querySelector(`#node-${prevNode.id}`).classList.remove('hovered');
        }

        if(node !== null){
          document.querySelector(`#node-${node.id}`).classList.add('hovered');
        }
      })
      .cooldownTicks(100)
      .nodeThreeObjectExtend(false)
      .zoomToFit(100, 100, node => true)
      .onNodeClick((node, event) => {
        this.focusOnNode(node);
        this.drawOverlay(node);
      })
      .linkLabel(link => {
        return link.title
      })

    let loaded = false;

    this.Graph.onEngineStop(() => {
      if (!loaded) {
        let { nodes, links } = this.Graph.graphData();
        this.focusOnNode(nodes[0]);
        loaded = true;
      }
    });

    this.overlay = document.createElement('details');
    this.summary = document.createElement('summary');
    this.overlay.appendChild(this.summary);
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