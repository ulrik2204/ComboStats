import { FC, useContext } from 'react';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
import PopulationForm from '../components/PopulationForm';
import { PopulationContext } from '../lib/contexts';
import { countElementName, sortElements } from '../lib/core';

const Population: FC = () => {
  const { population, setPopulation } = useContext(PopulationContext);

  return (
    <PageTemplate
      title="Deck"
      description="The group of cards that are drawn from."
      column2={<div>Lorem ipsum dolor sit amet</div>}
    >
      <ListView
        infoList={sortElements(population)}
        onDeleteAllClick={() => setPopulation([])}
        addItemTitle="Add card"
        addItemForm={() => (
          <PopulationForm defaultName="" defaultRoles={[]} defaultCount={1} type="add" clearAllOnConfirm />
        )}
        editItemTitle="Edit card(s)"
        editItemForm={(defaultValue, setOpenEditPopup) => (
          <PopulationForm
            defaultName={defaultValue[0].name}
            defaultRoles={defaultValue[0].roles}
            defaultCount={countElementName(population, defaultValue[0].name)}
            type="edit"
            afterConfirm={() => setOpenEditPopup?.(false)}
            afterDeleteAll={() => setOpenEditPopup?.(false)}
          />
        )}
      />
    </PageTemplate>
  );
};

export default Population;
