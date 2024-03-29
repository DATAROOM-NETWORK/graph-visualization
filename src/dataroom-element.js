export default class DataroomElement extends HTMLElement {
  /**
   * This function runs when the element is 
   * connected to the dom. It calls all the 
   * dom elements and runs initilization code
   */

  connectedCallback() {

    // Continue with the rest of the initialization
    this.observeChildChanges();
    this.observeAttributeChanges();
    this.stepThroughChildNodes(this);
    this.initialize();
  }
  /**
   * Initialize runs when the component is connected. 
   * This function should be overridden in the child class
   * @return {null} returns nothing
   */
  async initialize() {
    console.log('Override this class when creating a new dataroom element');
    // override this class to run initialization code here
  }

  disconnectedCallback() {
    this.childNodeObserver.disconnect();
    this.disconnect();
  }


  /**
   * If the user wishes to do something when the component is 
   * disconnected, they will override this function
   * @return {null} Does not return
   */
  async disconnect() {
    // override this function to run disconnect code
  }

  /**
   * A fetch helper that handles most of the complexity of 
   * talking to the server. 
   * @param  {string} endpoint the endpoint we want to talk to
   * @param  {object} body     the content of the server call
   * @return {object}          the response from the server as an object
   */
  async post(endpoint, body = {}){
    const bearer_token = localStorage.getItem('dataroom-token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer_token}`
    }
    const response = await fetch(endpoint, {
      method: 'post',
      headers,
      body: JSON.stringify(body)
    });

    if(response.ok){
      const response_value = await response.json();
      return response_value;
    } else {
      const error = response
      throw new Error(error.statusText);
    }
  }

  async get(endpoint){
    const response = await fetch(endpoint);
    const response_value = await response.json();
    return response_value;
  }

  /**
   * Steps through all child nodes and announces their connection to DATAROOM
   * @param  {HTML Element} node the HTML Element we are analyzing
   * @return {HTML Element}      the HTML Element we have found
   */
  stepThroughChildNodes(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      this.event('NODE-ADDED', {node: node});
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      this.stepThroughChildNodes(node.childNodes[i]);
    }
  }

  /**
   * Observes all child elements of an element for changes
   * @return {undefined} does not return
   */
  observeChildChanges() {
    this.childNodeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' || mutation.type === 'childList') {
          this.htmlObjectChanged(mutation);
        }
      });
    });
    const config = { attributes: true, childList: true, subtree: true };
    this.childNodeObserver.observe(this, config);
  }

  observeAttributeChanges() {
    this.attributeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          this.event('NODE-CHANGED', {
            attribute: mutation.attributeName,
            oldValue: mutation.oldValue,
            newValue: this.getAttribute(mutation.attributeName)
          });
        }
      });
    });
    const config = { attributes: true, attributeOldValue: true };
    this.attributeObserver.observe(this, config);
  }


  /**
   * Helper function to make emitting events easier
   * @param  {string} name   the name of the event we want to emit
   * @param  {Object} detail the content of the event we want to emit
   * @return {undefined}        does not return
   */
  event(name, detail = {}){
    const dtrmEvent = new CustomEvent(name, {
      detail
    });
    this.dispatchEvent(dtrmEvent);
  }
  /**
   * What to do when a child object changes
   * @param  {object} mutation the mutation object from the HTML Element
   * @return {undefined}          does not return
   */
  htmlObjectChanged(mutation) {
    // Handle added nodes
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        this.event('NODE-ADDED', {node: node});
      }
    });

    // Handle removed nodes
    mutation.removedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        this.event('NODE-REMOVED', {node: node});
      }
    });

    // Handle attribute changes
    if (mutation.type === 'attributes') {
      this.event('CHILD-NODE-CHANGED', {
        node: mutation.target,
        attribute: mutation.attributeName,
        value: mutation.target.getAttribute(mutation.attributeName)
      });
    }
  }

}
