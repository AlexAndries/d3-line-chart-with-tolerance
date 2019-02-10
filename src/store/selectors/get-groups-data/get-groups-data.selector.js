import {createSelector} from 'reselect';
import {omit} from 'lodash';

import {features} from '../constants';

const getUnitValue = (data, feature) => {
  const items = data.map(item => item[feature]);
  const range = {
    min: Math.min(...items),
    max: Math.max(...items),
  };

  return (range.max - range.min) / 100;
};

const dataState = state => state.root.toJS().data;
const toleranceLevelState = state => state.root.toJS().toleranceLevel;

export const getGroupsDataSelector = createSelector(
  dataState,
  toleranceLevelState,
  (data, toleranceLevel) => {
    const groups = [];
    const groupsPerFeatures = [];
    const groupedEntities = [];

    features.forEach((feature) => {
      const groupPerFeatures = {
        feature,
        unitValue: getUnitValue(data, feature),
        groups: [],
      };

      data.forEach((item) => {
        const toleratedRange = {
          min: item[feature] - (groupPerFeatures.unitValue * toleranceLevel),
          max: item[feature] + (groupPerFeatures.unitValue * toleranceLevel),
        };

        const group = groupPerFeatures.groups.find(({range}) => range.min <= item[feature] && range.max >= item[feature]);

        if (group) {
          group.items.push(item.entity);
        } else {
          groupPerFeatures.groups.push({
            range: toleratedRange,
            items: [item.entity],
          });
        }
      });

      groupsPerFeatures.push(groupPerFeatures);
    });

    groupsPerFeatures[0].groups.forEach((group) => {
      const sharedGroups = groupsPerFeatures.reduce((acc, featureGroups) => {
        const foundedGroup = featureGroups.groups.find(featureGroup => group.items.some(item => featureGroup.items.includes(item)));

        if (foundedGroup) {
          const sharedEntities = group.items.filter(item => foundedGroup.items.includes(item));

          if (sharedEntities.length > 1) {
            acc.push({
              ...foundedGroup,
              items: sharedEntities,
              feature: featureGroups.feature,
            });
          }
        }

        return acc;
      }, []);

      if (sharedGroups.length === groupsPerFeatures.length) {
        groupedEntities.push(...group.items);
        groups.push({
          items: data.reduce((acc, item) => {
            if (group.items.includes(item.entity)) {
              acc.push({
                entity: item.entity,
                color: item.color,
              });
            }

            return acc;
          }, []),

          avgValues: sharedGroups.reduce((acc, item) => {
            acc[item.feature] = (item.range.min + item.range.max) / 2;

            return acc;
          }, {}),
        });
      }
    });

    if (groupedEntities.length !== data.length) {
      data.forEach((item) => {
        if (groupedEntities.includes(item.entity)) {
          return;
        }

        groups.push({
          items: [
            {
              entity: item.entity,
              color: item.color,
            }],
          avgValue: omit(item, ['entity', 'color']),
        });
      });
    }

    groups.sort((a, b) => b.items.length - a.items.length);

    return groups.map((group, index) => ({
      ...group,
      id: index + 1,
    }));
  },
);
