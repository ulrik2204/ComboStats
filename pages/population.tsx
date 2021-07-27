import { Population } from '@prisma/client';
import { FC } from 'react';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
import PopulationForm from '../components/PopulationForm';
import { countElementName, sortElements } from '../lib/core';
import { useAppSelector } from '../store/index';

const Population: FC = () => {
  const elements = useAppSelector((state) => state.population.population.elements);

  return (
    <PageTemplate
      title="Deck"
      description="The group of cards that are drawn from."
      column2={<div>Lorem ipsum dolor sit amet</div>}
    >
      <ListView
        infoList={sortElements(elements).map((el) => ({
          boldNotes: [el.name],
          fadedNotes: el.roles,
        }))}
        addItemTitle="Add card"
        addItemForm={() => (
          <PopulationForm
            defaultName=""
            defaultRoles={[]}
            defaultCount={1}
            type="add"
            clearAllOnConfirm
          />
        )}
        editItemTitle="Edit card(s)"
        editItemForm={(defaultValue, setOpenEditPopup) => (
          <PopulationForm
            defaultName={defaultValue[0].boldNotes[0]}
            defaultRoles={defaultValue[0].fadedNotes ?? []}
            defaultCount={countElementName(elements, defaultValue[0].boldNotes[0])}
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
