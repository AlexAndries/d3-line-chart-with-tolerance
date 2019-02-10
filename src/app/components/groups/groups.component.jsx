import React from 'react';
import PropTypes from 'prop-types';

import {Group} from './components';

import './groups.style.scss';

export class GroupsComponent extends React.PureComponent {
  render() {
    const {className} = this.props;

    return (
      <div className={className}>
        {this.props.groupsData.map(group => (
          <Group
            onGroupClick={this.props.onGroupClick}
            key={group.id}
            group={group}
            isSelected={this.props.selectedGroupId === group.id}
            onGroupMouseEnter={this.props.onGroupMouseEnter}
            onGroupMouseLeave={this.props.onGroupMouseLeave}
          />
        ))}
      </div>
    );
  }
}

GroupsComponent.propTypes = {
  selectedGroupId: PropTypes.number.isRequired,
  groupsData: PropTypes.array.isRequired,
  onGroupClick: PropTypes.func.isRequired,
  onGroupMouseEnter: PropTypes.func.isRequired,
  onGroupMouseLeave: PropTypes.func.isRequired,
  className: PropTypes.string,
};

GroupsComponent.defaultProps = {
  className: 'groups',
};

