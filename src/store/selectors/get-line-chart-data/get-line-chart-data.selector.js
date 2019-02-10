import {createSelector} from 'reselect';

const dataState = state => state.root.toJS().data;
const toleranceLevelState = state => state.root.toJS().toleranceLevel;

export const getLineChartDataSelector = createSelector(
  dataState,
  toleranceLevelState,
  (data, toleranceLevel) => {

    return data;
  },
);
