import { FC, useEffect } from 'react';
import { INITIAL_FAILURES_STATE, INITIAL_SUCCESSES_STATE } from '../../lib/constants-frontend';
import { useLoginTempUser } from '../../lib/utils-frontend';
import { useAppSelector } from '../../store';
import { useAppDispatch } from '../../store/index';
import { failuresActions, successesActions } from '../../store/reducers/scenario-group';

/**
 * Component handling the common logic that affects all pages.
 */
const CommonLogic: FC = () => {
  const populationState = useAppSelector((state) => state.population);
  const appDispatch = useAppDispatch();

  // Login in user on page load
  useLoginTempUser();

  // When id of the current population changes, set the curretn successes and failures to the initlaState.
  useEffect(() => {
    appDispatch(successesActions.setScenarioGroup(INITIAL_SUCCESSES_STATE.scenarioGroup));
    appDispatch(failuresActions.setScenarioGroup(INITIAL_FAILURES_STATE.scenarioGroup));
  }, [populationState.population.populationId]);

  return <></>;
};

export default CommonLogic;
