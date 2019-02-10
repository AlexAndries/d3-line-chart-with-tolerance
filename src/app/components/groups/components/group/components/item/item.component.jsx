import React from 'react';
import PropTypes from 'prop-types';

import './item.style.scss';

export class ItemComponent extends React.PureComponent {
  render() {
    const {className, item} = this.props;
    return (
      <div className={className}>
        <div
          className={`${className}__legend`}
          style={{
            backgroundColor: item.color,
          }}
        />
        <div className={`${className}__entity`}>
          {item.entity}
        </div>
      </div>
    );
  }
}

ItemComponent.propTypes = {
  item: PropTypes.shape({
    entity: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

ItemComponent.defaultProps = {
  className: 'item',
};

