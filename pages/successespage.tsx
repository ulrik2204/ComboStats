import { createStyles, makeStyles } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect } from 'react';
import GlobalStateDropdown from '../components/GlobalStateDropdown';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
import ScenarioForm from '../components/ScenarioForm/index';
import { populationPageUrl } from '../lib/constants-frontend';
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

  // If the user tries to access the page without having a set population, redirect to populaiton.
  useEffect(() => {
    if (state.population.population.name === '') router.push(populationPageUrl);
  }, []);

  return (
    <PageTemplate
      title="Combos"
      description="Register a combo/success when either of these scenarios occur."
      column2={<div>Lorem ipsum dolor sit amet</div>}
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
              type="add"
            />
          )}
          editItemTitle="Edit combo"
          editItemForm={(clickedItem, setOpenEditPopup) => {
            return (
              <ScenarioForm
                // Handle the default later
                defaultRequiredElements={[]}
                defaultRequiredRoles={[]}
                defaultScenarioName=""
                type="edit"
                scenarioId={clickedItem.item.id}
              />
            );
          }}
          infoList={state.successes.scenarioGroup.scenarios.map(
            ({ scenarioId, name, requiredElements }) => {
              const elementInfo = requiredElements.map(
                (reqEl) => `${reqEl.element.name} (${reqEl.minCount})`,
              );
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
              const rolesInfo = requiredRoles.map(
                (reqRole) => `${reqRole.requiredRole} (${reqRole.minCount})`,
              );
              return {
                id: scenarioId,
                name: 'Required roles',
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
