import { createStyles, makeStyles } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect } from 'react';
import GlobalStateDropdown from '../components/GlobalStateDropdown';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
import ScenarioForm from '../components/ScenarioForm/index';
import { populationPageUrl } from '../lib/constants-frontend';
import {
  parseStringListAsRequiredElements,
  parseStringListAsStringNumberTuples,
  requiredElementsToStringList,
  requiredRolesToStringList,
} from '../lib/core';
import { useLoading } from '../lib/utils-frontend';
import { useAppSelector } from '../store/index';

const useStyles = makeStyles(() =>
  createStyles({
    overDiv: {
      height: 'calc(100% - 5em)',
    },
    globalDropdown: {
      height: '5em',
    },
  }),
);
const SuccessesPage: FC = () => {
  const classes = useStyles();
  const state = useAppSelector((state) => state);
  const router = useRouter();
  useLoading(state.successes.loading, 'Loading data...', 'Fetching your data from the server.');

  // If the user tries to access the page without having a set population, redirect to populaiton.
  useEffect(() => {
    if (state.population.population.name === '') router.push(populationPageUrl);
  }, []);

  return (
    <PageTemplate
      title="Combos"
      description="Register a combo/success when either of these scenarios occur."
      column2={<div></div>}
    >
      <div className={classes.overDiv}>
        <GlobalStateDropdown type="successes" className={classes.globalDropdown} />
        <ListView
          showAddButton={state.successes.scenarioGroup.name !== ''}
          addItemTitle="Add combo"
          addItemForm={(setOpenAddPopup) => (
            <ScenarioForm
              defaultRequiredElements={[]}
              defaultRequiredRoles={[]}
              defaultScenarioName=""
              scenarioGroupType="successes"
              type="add"
              afterConfirm={() => setOpenAddPopup(false)}
            />
          )}
          editItemTitle="Edit combo"
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
                scenarioGroupType="successes"
                type="edit"
                scenarioId={clickedItem.item.id}
                afterConfirm={() => setOpenEditPopup(false)}
                afterDelete={() => setOpenEditPopup(false)}
              />
            );
          }}
          infoList={state.successes.scenarioGroup.scenarios.map(
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
          corrMoreInfoList={state.successes.scenarioGroup.scenarios.map(
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
    </PageTemplate>
  );
};

export default SuccessesPage;
{
  /* <ListView
        infoList={successGroups.main.map((els) => ({
          boldNotes: sortElements(els).map((el) => el.name),
        }))}
        addItemTitle="Add card"
        addItemForm={() => <SuccessesForm defaultSuccesses={[]} />}
        editItemTitle="Edit card(s)"
        editItemForm={(defaultValue) => (
          <SuccessesForm defaultSuccesses={defaultValue[0].name} />
        )}
      />  */
}
