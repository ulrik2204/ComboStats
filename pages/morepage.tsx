import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/dist/client/router';
import React, { FC, useEffect } from 'react';
import ListView from '../components/ListView';
import PageTemplate from '../components/PageTemplate/index';
import ScenarioForm from '../components/ScenarioForm';
import { getScenarioGroupsFromAPI } from '../lib/api-calls';
import { populationPageUrl, successesPageUrl } from '../lib/constants-frontend';
import {
  parseStringListAsRequiredElements,
  parseStringListAsStringNumberTuples,
  requiredElementsToStringList,
  requiredRolesToStringList,
} from '../lib/core';
import { useLoading, useToast } from '../lib/utils-frontend';
import {
  createScenarioGroupTAction,
  getScenarioGroupTAction,
} from '../store/actions/scenario-group-actions';
import { useAppDispatch, useAppSelector } from '../store/index';
import { failuresActions } from '../store/reducers/scenario-group';

const useStyles = makeStyles(() =>
  createStyles({
    overDiv: {
      height: 'calc(100% - 7em)',
    },
    globalDropdown: {
      height: '5em',
    },
  }),
);
const More: FC = () => {
  const state = useAppSelector((state) => state);
  const router = useRouter();
  const classes = useStyles();
  const toast = useToast();
  const appDispatch = useAppDispatch();
  useLoading(state.failures.loading, 'Loading data...', 'Fetching your data from the server.');
  // If the user tries to access the page without having a set population or successes, redirect to that page.
  useEffect(() => {
    if (state.population.population.name === '') router.push(populationPageUrl);
    else if (state.successes.scenarioGroup.name === '') router.push(successesPageUrl);
    else {
      // Check if there is a failure scenario on this populatiuon, and if not create it
      getScenarioGroupsFromAPI(state.population.population.populationId, 'failures').then((res) => {
        if (!res.ok)
          return toast({
            title: 'There was an error fetching form server',
            description: res.data.errorMsg,
            type: 'alert',
            color: 'error',
          });
        // Else it is ok
        const scenarioGroups = res.data.scenarioGroups;
        // If scenarioGroups is not empty, set the failure state to the first item (there will only be one item)
        if (scenarioGroups.length !== 0)
          appDispatch(failuresActions.setScenarioGroup(scenarioGroups[0]));
        else appDispatch(createScenarioGroupTAction({ name: 'Failures', type: 'FAILURES' }));
      });
    }
  }, []);

  useEffect(() => {
    if (state.failures.scenarioGroup.scenarioGroupId === '') return;
    // Else fetch the data for that scenarioGroup
    appDispatch(getScenarioGroupTAction('failures')).then((res) => {
      if (!res.ok)
        return toast({
          title: 'Unable to retrieve cards or scenarios, try again later',
          description: `Error getting data from the server: ${res.status}.`,
          type: 'alert',
          color: 'error',
        });
    });
  }, [state.failures.scenarioGroup.scenarioGroupId]);

  return (
    <PageTemplate
      title="More features (optional)"
      description="More handy, optional features to determine when success or failure occurs."
    >
      <div>
        <h2>Bricks</h2>
        <p>Register failure/brick when either of these scenarios are drawn.</p>
        <div className={classes.overDiv}>
          <ListView
            showAddButton={state.failures.scenarioGroup.name !== ''}
            addItemTitle="Add brick"
            addItemForm={(setOpenAddPopup) => (
              <ScenarioForm
                defaultRequiredElements={[]}
                defaultRequiredRoles={[]}
                defaultScenarioName=""
                scenarioGroupType="failures"
                type="add"
                afterConfirm={() => setOpenAddPopup(false)}
              />
            )}
            editItemTitle="Edit brick"
            editItemForm={(clickedItem, setOpenEditPopup) => {
              return (
                <ScenarioForm
                  // Handle the default later
                  defaultRequiredElements={parseStringListAsRequiredElements(
                    clickedItem.item.notes,
                    state.population.population.elements,
                  )}
                  defaultRequiredRoles={parseStringListAsStringNumberTuples(
                    clickedItem.corrItem?.notes || [],
                  )}
                  defaultScenarioName={clickedItem.item.name}
                  scenarioGroupType="failures"
                  type="edit"
                  scenarioId={clickedItem.item.id}
                  afterConfirm={() => setOpenEditPopup(false)}
                  afterDelete={() => setOpenEditPopup(false)}
                />
              );
            }}
            infoList={state.failures.scenarioGroup.scenarios.map(
              ({ scenarioId, name, requiredElements }) => {
                const elementInfo = requiredElementsToStringList(requiredElements);
                return {
                  id: scenarioId,
                  name,
                  notes: elementInfo,
                  count: 1,
                };
              },
            )}
            corrMoreInfoList={state.failures.scenarioGroup.scenarios.map(
              ({ scenarioId, requiredRoles }) => {
                const rolesInfo = requiredRolesToStringList(requiredRoles);
                return {
                  id: scenarioId,
                  name: '',
                  notes: rolesInfo,
                  count: 1,
                };
              },
            )}
          />
        </div>
      </div>
    </PageTemplate>
  );
};

export default More;
