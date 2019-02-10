import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {setToleranceLevelAction} from 'store/actions';
import {getLineChartDataSelector, getGroupsDataSelector} from 'store/selectors';

import {ToleranceStepper, Groups, LineChart} from './components';

import './app.style.scss';

class AppComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroupId: 0,
      selectedEntities: [],
      highlightedEntities: [],
    };

    this.onGroupClickHandler = this.onGroupClickHandler.bind(this);
    this.onGroupHoverHandler = this.onGroupHoverHandler.bind(this);
    this.onToleranceLevelUpdate = this.onToleranceLevelUpdate.bind(this);
  }

  onGroupClickHandler(groupId, items) {
    let selectedGroupId = groupId;
    let selectedEntities = [];

    if (this.state.selectedGroupId === groupId) {
      selectedGroupId = 0;
    } else {
      selectedEntities = items.map(item => item.entity);
    }

    this.setState({selectedGroupId, selectedEntities});
  }

  onGroupHoverHandler(items) {
    this.setState({
      highlightedEntities: items.map(item => item.entity),
    });
  }

  onToleranceLevelUpdate(toleranceLevel) {
    this.props.setToleranceLevel(toleranceLevel);

    this.setState({
      selectedGroupId: 0,
      selectedEntities: []
    })
  }

  render() {
    const {className} = this.props;
    const {selectedGroupId, selectedEntities, highlightedEntities} = this.state;
    let lineChartData = this.props.lineChartData;

    if (selectedEntities.length) {
      lineChartData = lineChartData.filter(item => selectedEntities.includes(item.entity));
    }

    if (highlightedEntities.length) {
      lineChartData = lineChartData.map(item => ({
        ...item,
        isHighlighted: highlightedEntities.includes(item.entity),
      }));
    }

    return (
      <div className={className}>
        <div className={`${className}__chart`}>
          <LineChart
            data={lineChartData}
          />
          <ToleranceStepper
            setToleranceLevel={this.onToleranceLevelUpdate}
            toleranceLevel={this.props.toleranceLevel}
          />
        </div>
        <div className={`${className}__groups`}>
          <Groups
            selectedGroupId={selectedGroupId}
            onGroupClick={this.onGroupClickHandler}
            groupsData={this.props.groupsData}
            onGroupMouseLeave={this.onGroupHoverHandler}
            onGroupMouseEnter={this.onGroupHoverHandler}
          />
        </div>
      </div>
    );
  }
}

AppComponent.propTypes = {
  setToleranceLevel: PropTypes.func.isRequired,
  toleranceLevel: PropTypes.number.isRequired,
  lineChartData: PropTypes.array.isRequired,
  groupsData: PropTypes.array.isRequired,
  className: PropTypes.string,
};

AppComponent.defaultProps = {
  className: 'app',
};

const mapStateToProps = state => ({
  lineChartData: getLineChartDataSelector(state),
  groupsData: getGroupsDataSelector(state),
  toleranceLevel: state.root.toJS().toleranceLevel,
});

const mapDispatchToProps = dispatch => ({
  setToleranceLevel: toleranceLevel => dispatch(setToleranceLevelAction(toleranceLevel)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
