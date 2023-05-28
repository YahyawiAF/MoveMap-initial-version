import * as d3 from "d3"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useD3 } from 'hooks/useD3';
import { prettyNumberFormat } from 'utils';
import consts from "const";

const margin = {top: 10, right: 30, bottom: 20, left: 60};
const ANIMATION_DURATION = 500;


function ScatterPlot({ data, filterValues, meetsCriteria, xAxisField, yAxisField, height, width, getColor, setHoveredData, maxValues}) {
  const [node, setNode] = useState();
  const [rootSvg, setRootSvg] = useState();
  const [isInitialized, setIsInitialized] = useState(false);
  const [ bubbleNodes, setBubbleNodes] = useState();

  const router = useRouter();

  useEffect(() => {
    const xAxisMaxVal = d3.max(Object.keys(data), function(d) { return data[d][xAxisField]} );
    const xAxisScale = d3.scaleLinear()
      .domain([0, xAxisMaxVal])
      .range([0, width - margin.left - margin.right]);
  }, [xAxisField])

  useEffect(() => {
    if (node) {
      initializeScatterPlot(node)
    }
  }, [width])

  const updateAxes = (xAxisNode, yAxisNode, x, y) => {
    xAxisNode
    .transition().duration(ANIMATION_DURATION)
    .call(d3.axisBottom(x).tickFormat(x => `${prettyNumberFormat(x, true)}`));
    yAxisNode
    .transition().duration(ANIMATION_DURATION)
    .call(d3.axisLeft(y).tickFormat(y => `${prettyNumberFormat(y, true)}`));
  }

  const createBubbles = (containerNode) => {
    const bubbles = containerNode.selectAll("circle")
    .data(Object.keys(data), d => d)
    .join(
      enter => enter.append("circle"),
      update => update,
      exit => exit.remove()
    )
    .attr("id", "scatter-bubble")
    .on("mouseover", function (event, key) {
      setHoveredData(data[key]);
      d3.selectAll("circle")
        .each(function(d,i) { 
          d3.select(this)
            .style("stroke", d == key ? "black" : "transparent")
            .style("stroke-width", d == key ? '2px' : '0')
            .style("opacity", d == key ? 0.5 : 1)
          
        })
      d3.select(".react-tooltip")
        .transition()
        .duration(100)
        .style("opacity", 1);
    })
    .on("mouseout", function (event, key) {
      d3.selectAll("circle")
        .each(function(d,i) { 
          d3.select(this)
            .style("stroke", this.id == key ? "black" : "transparent")
            .style("opacity", 1)
        })
        .style("stroke",  "transparent");
      d3.select(".react-tooltip")
        .style("opacity", 0);
    })
    const {x, y} = getAxes();
    updateBubbles(bubbles, x, y);
  }

  const updateBubbles = (bubbles, x, y) => {
    const maxBubbleSizeVal = d3.max(Object.keys(data), function() { return maxValues[consts.dbFields.civilianLaborForce2020]} );
    const bubbleSizeScale = d3.scaleLinear()
      .domain([0, maxBubbleSizeVal])
      .range([0, 200]);

    bubbles
      .attr("r", d => {
        if (meetsCriteria(data[d], router.query)) {
          return Math.sqrt(bubbleSizeScale(data[d][consts.dbFields.civilianLaborForce2020]))
        }
        return 0;
      })
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("cx", function (d) { 
        if (!data[d]) {
          return;
        }
        return x(data[d][xAxisField]); 
      } )
      .attr("cy", function (d) {
        if (!data[d]) {
          return;
        }
        return y(data[d][yAxisField]);
      } )
      .attr("fill", d => {
        return getColor(data[d][yAxisField])
      })
  }

  const getXAxisMax = () => d3.max(Object.keys(data), (key) => maxValues[xAxisField]);
  const getYAxisMax = () => d3.max(Object.keys(data), (key) => maxValues[yAxisField]);

  const getAxes = () => {
    const x = d3.scaleLinear()
      .domain([0, getXAxisMax()])
      .range([ 0, width - margin.left - margin.right ]);
    const y = d3.scaleLinear()
      .domain([0, getYAxisMax()])
      .range([ height - margin.top - margin.bottom, 0]);
    return {x, y};
  }


  const initializeScatterPlot = (node) => {
    // if we've already initialized the map, tear everything down first.  This happens when window is resized (not common)
    if (isInitialized) {
      node.select("svg").remove();
      d3.select("body").select(".tooltip").remove();
    }

    const svg = node
    .append("svg")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

      svg.on("mouseout", (event, d) => {
      setHoveredData();
      d3.select(".react-tooltip")
        .style("opacity", 0);
    })

    const {x, y} = getAxes();
    const xAxisNode = svg.append("g")
    .attr("id", "xAxis")
    .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`);
    
    const yAxisNode = svg.append("g")
      .attr("id", "yAxis");

      
    const containerNode = svg.append("g").attr("id", "bubbleContainer");
    
    createBubbles(containerNode);
    updateAxes(xAxisNode, yAxisNode, x, y);

    setRootSvg(svg);
    setIsInitialized(true);
    }

  const alterScatterPlot = (node) => {
    const {x, y} = getAxes();
    const bubbles = d3.select("#bubbleContainer").selectAll("#scatter-bubble");
    updateBubbles(bubbles, x, y);
    updateAxes(d3.select("#xAxis"), d3.select("#yAxis"), x, y)

  }

    const ref = useD3(
      (node) => {
        setNode(node);
        if (!width > 0) {
          return
        }
        if (!isInitialized) {
          initializeScatterPlot(node);
        } else {
          alterScatterPlot(node);
        }
      }, [filterValues, xAxisField, height, width, data, maxValues]
    );

    return (
      <svg 
        ref={ref}
        width={width}
        height={height}
      >
      </svg>
    );
}

export default ScatterPlot;