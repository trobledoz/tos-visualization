// Load the JSON data
d3.json('merged_data.json').then(data => {
    // Convert the data to a hierarchical structure suitable for D3.js
    const root = d3.stratify()
        .id(d => d.paper)
        .parentId(d => d.ToS === 'root' ? null : d.ToS)
        (data);

    // Set the dimensions and margins of the diagram
    const margin = { top: 20, right: 90, bottom: 30, left: 90 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#tree-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + margin.top + ")");

    const treeLayout = d3.tree().size([height, width]);

    const treeData = treeLayout(root);

    const nodes = treeData.descendants(),
        links = treeData.links();

    // Normalize for fixed-depth
    nodes.forEach(d => d.y = d.depth * 180);

    // Add links between nodes
    const link = svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // Add nodes
    const node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
        .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

    node.append("circle")
        .attr("r", 10);

    node.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -13 : 13)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.id);
});
