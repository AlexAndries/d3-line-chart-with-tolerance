import {fromJS} from 'immutable';
import {entitiesMock} from 'mock';
import {actionTypes} from 'store/actions';

const initialState = fromJS({
  toleranceLevel: 0,
  data: entitiesMock,
});

export const rootReducer = (state = initialState, action) => {

  switch (action.type) {
    case actionTypes.SET_TOLERANCE_LEVEL:
      return state.set('toleranceLevel', action.payload);
    default:
      return state;
  }
};
