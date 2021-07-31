import { FC } from 'react';
import GlobalStateDropdown from '../components/GlobalStateDropdown/index';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
import PopulationForm from '../components/PopulationForm';
import { countElementName, sortElements } from '../lib/core';
import { useAppSelector } from '../store/index';

const PopulationPage: FC = () => {
  const populationData = useAppSelector((state) => state.population.population);

  return (
    <PageTemplate
      title="Deck"
      description="The group of cards that are drawn from."
      column2={<div>Lorem ipsum dolor sit amet</div>}
    >
      <div>
        <GlobalStateDropdown type="Population" />
        <ListView
          infoList={sortElements(populationData.elements).map((el) => ({
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
              defaultCount={countElementName(populationData.elements, defaultValue[0].boldNotes[0])}
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
