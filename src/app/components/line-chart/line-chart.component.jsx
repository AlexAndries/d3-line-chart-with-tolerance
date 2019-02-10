import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {capitalize} from 'lodash';

import './line-chart.style.scss';

export class LineChartComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.container = null;
    this.svg = null;
    this.xScale = d3.scaleBand();
    this.yScales = {};
    this.gXAxis = null;
    this.gYAxis = null;
    this.gPaths = null;
    this.features = [];
    this.svgSizes = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    this.buildSvgElements();
  }

  componentDidUpdate() {
    this.updateChartSizes();
  }

  buildSvgElements() {
    this.svg = d3.select(this.container).append('svg');

    const axis = this.svg.append('g')
      .classed('axis', true);

    this.gXAxis = axis.append('g')
      .classed('x axis', true);

    this.gYAxis = axis.append('g')
      .classed('y axis', true);

    this.gPaths = this.svg.append('g')
      .classed('paths', true);

    this.updateChartSizes();
  }

  updateChartSizes() {
    const containerSizes = this.container.getBoundingClientRect();

    this.svgSizes = {
      width: containerSizes.width,
      height: containerSizes.height,
    };

    this.svg.attr('height', containerSizes.height)
      .attr('width', containerSizes.width);

    this.updateChart();
  }

  updateChart() {
    const {data, margin} = this.props;
    const {height} = this.svgSizes;

    if (!data.length) {
      return;
    }

    this.features = Object.keys(data[0]).filter(key => !['entity', 'color', 'isHighlighted'].includes(key));
    this.yScales = this.features.reduce((acc, feature) => {
      acc[feature] = d3.scaleLinear()
        .domain([0, d3.extent(this.props.data, (d) => d[feature])[1] * 1.1])
        .range([height - (margin.top * 2), margin.top]);

      return acc;
    }, {});

    this.updateXAxis();
    this.updateYAxis();
    this.updatePaths();
  }

  updateXAxis() {
    const {margin} = this.props;
    const {width} = this.svgSizes;

    this.xScale.domain(this.features)
      .range([margin.left, width - (margin.left * 2)]);

    this.gXAxis.attr('transform', `translate(0, ${margin.top})`)
      .transition()
      .call(d3.axisTop()
        .scale(this.xScale)
        .tickSizeOuter(0)
        .tickSizeInner(0)
        .tickFormat(d => capitalize(d.replace('_', ' '))));
  }

  updateYAxis() {
    const {margin} = this.props;

    const yAxis = this.gYAxis.selectAll('.feature-axis')
      .data(this.features);

    yAxis.enter()
      .append('g')
      .classed('feature-axis', true)
      .merge(yAxis)
      .each((d, i, items) => {
        d3.select(items[i])
          .transition()
          .call(d3.axisRight(this.yScales[d])
            .tickSizeOuter(0)
            .tickSizeInner(0));
      })
      .transition()
      .attr('transform', d => `translate(${this.xScale(d) + (this.xScale.bandwidth() / 2)}, ${margin.top})`);

    yAxis.exit().remove();
  }

  updatePaths() {
    const {margin} = this.props;
    const line = d3.line()
      .x((d, i) => this.xScale(this.features[i]))
      .y((d, i) => this.yScales[this.features[i]](d))
      .curve(d3.curveMonotoneX);

    const paths = this.gPaths.selectAll('g')
      .data(this.props.data);

    paths.enter()
      .append('g')
      .merge(paths)
      .attr('transform', `translate(${this.xScale.bandwidth() / 2}, ${margin.top})`)
      .each((data, i, items) => {

        const path = d3.select(items[i])
          .selectAll('path')
          .data([1]);

        path.enter()
          .append('path')
          .merge(path)
          .datum(this.features.map(key => data[key]))
          .attr('stroke', data.color)
          .classed('highlighted', data.isHighlighted)
          .transition()
          .attr('d', line);

        path.exit().remove();
      });

    paths.exit().remove();
  }

  render() {
    const {className} = this.props;

    return (
      <div
        ref={ref => this.container = ref}
        className={className}
      />
    );
  }
}

LineChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  className: PropTypes.string,
};

LineChartComponent.defaultProps = {
  className: 'line-chart',
  margin: {
    top: 20,
    left: 20,
  },
};
