import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import './tolerance-stepper.style.scss';

export class ToleranceStepperComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.container = null;
    this.svg = null;
    this.svgSizes = {
      width: 200,
      height: 50,
    };
    this.xScale = d3.scaleLinear().domain([0, 100]);
    this.circle = null;

    this.onDraggingEvent = this.onDraggingEvent.bind(this);
  }

  componentDidMount() {
    this.buildSvgElements();

    setTimeout(() => {
      this.props.setToleranceLevel(50);
    }, 300);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.toleranceLevel !== nextProps.toleranceLevel) {
      this.updateCircleXPosition(nextProps.toleranceLevel);
    }
  }

  onDraggingEvent() {
    let toleranceLevel = +this.xScale.invert(d3.event.x).toFixed(0);

    toleranceLevel = Math.max(0, Math.min(100, toleranceLevel));

    this.props.setToleranceLevel(toleranceLevel);
  }

  buildSvgElements() {
    this.svg = d3.select(this.container).append('svg');

    this.updateChartSizes();
  }

  buildAxis() {
    const {height} = this.svgSizes;

    const xAxis = this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${height / 2})`)
      .call(d3.axisBottom(this.xScale).tickValues([0, 25, 50, 75, 100])
        .tickSizeInner(-10)
        .tickSizeOuter(10));

    xAxis.selectAll('text')
      .remove();
    xAxis.selectAll('line')
      .attr('y1', 10);
  }

  buildCircle() {
    const {height} = this.svgSizes;
    this.circle = this.svg.append('circle')
      .attr('r', 6)
      .attr('fill', 'red')
      .attr('cy', height / 2)
      .call(d3.drag()
        .on('drag', this.onDraggingEvent));

    this.updateCircleXPosition(this.props.toleranceLevel);
  }

  updateChartSizes() {
    const {margin} = this.props;
    const {width, height} = this.svgSizes;

    this.svg.attr('width', width).attr('height', height);
    this.xScale.range([margin.left, width - (margin.left * 2)]);

    this.buildAxis();
    this.buildCircle();
  }

  updateCircleXPosition(toleranceLevel) {
    this.circle.attr('cx', this.xScale(toleranceLevel));
  }

  render() {
    const {className} = this.props;

    return (
      <div
        className={className}
      >
        <div className={`${className}__title`}>
          Tolerance
        </div>
        <div
          className={`${className}__chart`}
          ref={ref => this.container = ref}
        />
        <div className={`${className}__tolerance`}>
          {this.props.toleranceLevel}%
        </div>
      </div>
    );
  }
}

ToleranceStepperComponent.propTypes = {
  setToleranceLevel: PropTypes.func.isRequired,
  toleranceLevel: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  className: PropTypes.string,
};

ToleranceStepperComponent.defaultProps = {
  className: 'tolerance-stepper',
  margin: {
    top: 10,
    left: 10,
  },
};
