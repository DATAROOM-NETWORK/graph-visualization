const fs = require('fs');
const { LoremIpsum } = require("lorem-ipsum");

// Create a lorem ipsum generator with default configuration
const lorem = new LoremIpsum();

// Function to generate unique ID for nodes
function generateId(index) {
  return `node_${index}`;
}

const group = ['red team', 'green team','blue team', 'yello team', 'purple team'];

// Generate 1000 nodes with titles and content
const nodes = Array.from({ length: 30 }, (_, index) => ({
  id: generateId(index),
  title: lorem.generateWords(8), // Generating a title with ~8 words
  content: lorem.generateSentences(5), // Generating content with ~5 sentences
  weight: Math.random() * 100,
  group: group[Math.floor(Math.random() * group.length)]
}));

// Function to randomly select two different nodes for links
function getRandomNodes(count) {
  const indices = new Set();
  while (indices.size < count) {
    const index = Math.floor(Math.random() * nodes.length);
    indices.add(index);
  }
  return [...indices];
}

// Generate 2000 links with titles
const links = Array.from({ length: 20 }, () => {
  const [sourceIndex, targetIndex] = getRandomNodes(2);
  return {
    source: generateId(sourceIndex),
    target: generateId(targetIndex),
    title: lorem.generateWords(6) // Generating a title with ~6-7 words
  };
});

// Combine nodes and links into one object
const graph = { nodes, links };

// Write the JSON to a file
fs.writeFile('../graph.json', JSON.stringify(graph, null, 2), (err) => {
  if (err) throw err;
  console.log('The file with dynamic Lorem Ipsum has been saved!');
});
