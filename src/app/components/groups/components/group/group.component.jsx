import React from 'react';
import PropTypes from 'prop-types';

import {Item} from './components';

import './group.style.scss';

export class GroupComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
  }

  onClickHandler() {
    const {group} = this.props;

    this.props.onGroupClick(group.id, group.items);
  }

  onMouseEnterHandler() {
    this.props.onGroupMouseEnter(this.props.group.items);
  }

  onMouseLeaveHandler() {
    this.props.onGroupMouseEnter([]);
  }

  render() {
    const {className, group} = this.props;
    const classes = [className];

    if (this.props.isSelected) {
      classes.push(`${className}--selected`);
    }

    return (
      <div
        className={classes.join(' ')}
        onClick={this.onClickHandler}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        <div className={`${className}__title`}>
          Group {this.props.group.id}
        </div>
        {group.items.length > 1 && (
          <div className={`${className}__sub-title`}>
            {group.items.length} similar entities
          </div>
        )}
        <div className={`${className}__items`}>
          {group.items.map(item => (
            <Item
              key={item.entity}
              item={item}
            />
          ))}
        </div>
      </div>
    );
  }
}

GroupComponent.propTypes = {
  group: PropTypes.object.isRequired,
  onGroupClick: PropTypes.func.isRequired,
  onGroupMouseEnter: PropTypes.func.isRequired,
  onGroupMouseLeave: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

GroupComponent.defaultProps = {
  className: 'group',
};

