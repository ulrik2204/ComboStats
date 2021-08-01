import { createStyles, makeStyles } from '@material-ui/core';
import { FC } from 'react';
import GlobalStateDropdown from '../components/GlobalStateDropdown/index';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
import PopulationForm from '../components/PopulationForm';
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
  const populationData = useAppSelector((state) => state.population.population);
  const classes = useStyles();

  return (
    <PageTemplate
      title="Deck"
      description="The group of cards that are drawn from."
      column2={<div>Lorem ipsum dolor sit amet</div>}
    >
      <div className={classes.overDiv}>
        <GlobalStateDropdown type="Population" className={classes.globalDropdown} />
        <ListView
          showAddButton={populationData.name !== ''}
          infoList={populationData.elements.map(({ elementId, name, roles, count }) => ({
            id: elementId,
            name,
            notes: roles,
            count,
          }))}
          addItemTitle="Add card"
          addItemForm={() => (
            <PopulationForm defaultName="" defaultRoles={[]} defaultCount={1} type="add" />
          )}
          editItemTitle="Edit card(s)"
          editItemForm={(clickedItem, setOpenEditPopup) => (
            <PopulationForm
              defaultName={clickedItem.item.name}
              defaultRoles={clickedItem.item.notes}
              defaultCount={
                populationData.elements.find((element) => element.elementId === clickedItem.item.id)
                  ?.count ?? -1 // It cannot coe to -1
              }
              elementId={clickedItem.item.id}
              type="edit"
              afterConfirm={() => setOpenEditPopup?.(false)}
              afterDeleteAll={() => setOpenEditPopup?.(false)}
            />
          )}
        />
      </div>
    </PageTemplate>
  );
};

export default PopulationPage;
