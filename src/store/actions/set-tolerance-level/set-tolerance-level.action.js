import {actionTypes} from '../action-types';

export const setToleranceLevelAction = toleranceLevel => (dispatch) => {
  dispatch({
    type: actionTypes.SET_TOLERANCE_LEVEL,
    payload: toleranceLevel,
  });
};
