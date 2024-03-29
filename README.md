# Graph Data Element


# README for ForceGraphComponent

## Overview

The `ForceGraphComponent` is a custom web component designed to render interactive 3D force-directed graphs using Three.js and 3D Force Graph. It's built to be a versatile, easy-to-integrate component for visualizing and interacting with network data, specifically targeting applications that require dynamic data visualization with a focus on node relationships.

This component allows users to visualize nodes and their connections (links) in a 3D space, with support for custom node rendering, interactive highlighting, and smooth camera transitions to focus on selected nodes. Additionally, it provides an overlay for displaying detailed information about nodes and their inbound/outbound links upon interaction.

## Features

- **3D Force-Directed Graph Visualization**: Utilizes Three.js and 3D Force Graph for rendering.
- **Custom Node Rendering**: Supports custom rendering of nodes, including color and size based on node attributes.
- **Interactive Node Selection**: Allows users to click on nodes to focus the camera and display node details.
- **Dynamic Data Loading**: Capable of loading graph data from a JSON file specified in the `src` attribute.
- **Styling via CSS**: Supports external CSS for custom styling of nodes and text labels.


## Installation

1. **Include Dependencies**: Make sure to include the required JavaScript files (`three.module.js`, `3d-force-graph.min.js`, `CSS2DRenderer.js`, and `color-palette.js`) in your project.

2. **Add the Component**: Copy the `ForceGraphComponent` class code into a JavaScript file in your project, for example, `force-graph-component.js`.

3. **Import the Component**: Import the component script in your HTML file where you wish to use the graph.

    ```html
    <script type="module" src="./force-graph-component.js"></script>
    ```

## Usage

1. **Insert the Custom Element**: Place the `graph-data` custom element in your HTML, specifying the source for your graph data in the `src` attribute.

```html
  <html>
  <head>
      <link rel="stylesheet" type="text/css" href="https://dataroom-network.github.io/graph-visualization/styles/index.css">
      <script type="module" src="https://dataroom-network.github.io/graph-visualization/src/index.js"></script>
  </head>
  <body>
    <graph-data src="./graph.json">
    </graph-data>
  </body>
  </html>
```

2. **Styling (Optional)**: Apply custom styles using CSS. The component supports external CSS for styling node labels and the overlay details.

    ```css
    .node-label {
        /* Node label styles */
    }
    #force-graph-overlay {
        /* Overlay styles */
    }
    ```

3. **Initialization**: The graph automatically initializes and renders once the page is loaded. It fetches the graph data from the specified `src`, processes it, and displays the 3D force-directed graph.

4. **Interaction**: Users can interact with the graph by clicking on nodes to focus and display detailed information about the node, including its inbound and outbound links.

## Customization

To customize node appearance and behavior, modify the `renderNodeObject` method within the `ForceGraphComponent` class. This method defines how nodes are rendered, allowing for customization of shapes, colors, and sizes based on node properties.


### Imports and Dependencies
- **THREE.js**: Imported from `./vendor/three.module.js`, it's a popular library for creating and displaying animated 3D graphics in a web browser.
- **3D Force Graph**: Imported from `./vendor/3d-force-graph.min.js`, this is likely a library that specializes in rendering 3D force-directed graphs.
- **CSS2DRenderer**: Imported from `./vendor/CSS2DRenderer.js`, it allows for rendering 2D elements (like labels) in a 3D scene using CSS, which is part of THREE.js extras.
- **DataroomElement**: Imported from `./dataroom-element.js`, this seems to be a custom element, possibly extending `HTMLElement`, specific to the application's context.

### Utility Function: `parseTextToJSON`
This function parses a given input text into a JSON object that contains nodes and links between them. The input text format is expected to have lines with source and target node names enclosed in square brackets. The function ensures no duplicate nodes are added.

### Class: `ForceGraphComponent`
This class extends `DataroomElement` and is responsible for creating a 3D force-directed graph.

#### Key Methods and Properties:
- **drawOverlay**: A method to display an overlay with information about a node. Currently, it's prepared but not used actively in the provided methods.
- **focusOnNode**: Adjusts the camera position to focus on a given node, smoothly transitioning to the new position.
- **initialize**: Prepares the graph by configuring styles, dimensions, and graph data. It uses `parseTextToJSON` to convert the inner text of the element into graph data and sets up the 3D graph with various properties such as background color, link color, and node objects. It also defines interactions such as what happens on a node click.
- **observedAttributes, attributeChangedCallback**: Placeholder methods for attribute changes. Currently, they are not actively used but are part of the custom element lifecycle hooks.

### 3D Graph Configuration
The `initialize` method sets up the 3D force graph with custom rendering for nodes using THREE.js objects and CSS2DRenderer for labels. It also configures interactions like focusing on a node upon clicking.

### Integration and Custom Elements
The class is registered as a custom element `graph-data`, allowing it to be used as a tag (`<graph-data></graph-data>`) within HTML. This approach encapsulates the functionality and makes the component reusable.

### Summary
This code is a sophisticated example of integrating 3D graphics, custom web components, and data visualization in a web application. It showcases the use of modern JavaScript libraries and custom elements to create interactive and visually appealing 3D force-directed graphs.

## Prior Work

https://github.com/vasturiano/3d-force-graph/tree/master
https://threejs.org/