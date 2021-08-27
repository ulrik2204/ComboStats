import { createStyles, makeStyles } from '@material-ui/core';
import { FC } from 'react';
import ElementForm from '../components/ElementForm';
import GlobalStateDropdown from '../components/GlobalStateDropdown/index';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
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

const PopulationPage: FC = () => {
  const populationState = useAppSelector((state) => state.population);
  const populationData = populationState.population;
  const classes = useStyles();
  // Show loading icon when population is loading
  useLoading(populationState.loading, 'Loading data...', 'Fetching your data from the server.');

  return (
    <PageTemplate
      title="Deck"
      description="The group of cards that are drawn from."
      column2={<div></div>}
    >
      <div className={classes.overDiv}>
        <GlobalStateDropdown type="population" className={classes.globalDropdown} />
        <ListView
          showAddButton={populationData.name !== ''}
          infoList={populationData.elements.map(({ elementId, name, roles, count }) => ({
            id: elementId,
            name,
            notes: roles,
            count,
          }))}
          addItemTitle="Add card"
          addItemForm={(setOpenAddPopup) => (
            <ElementForm
              defaultName=""
              defaultRoles={['']}
              defaultCount={1}
              type="add"
              afterConfirm={() => setOpenAddPopup(false)}
            />
          )}
          editItemTitle="Edit card(s)"
          editItemForm={(clickedItem, setOpenEditPopup) => (
            <ElementForm
              defaultName={clickedItem.item.name}
              defaultRoles={clickedItem.item.notes}
              defaultCount={
                populationData.elements.find((element) => element.elementId === clickedItem.item.id)
                  ?.count ?? -1 // It cannot be to -1
              }
              elementId={clickedItem.item.id}
              type="edit"
              afterConfirm={() => setOpenEditPopup(false)}
              afterDelete={() => setOpenEditPopup(false)}
            />
          )}
        />
      </div>
    </PageTemplate>
  );
};

export default PopulationPage;
