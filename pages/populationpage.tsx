import { FC, useEffect } from 'react';
import GlobalStateDropdown from '../components/GlobalStateDropdown/index';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
import PopulationForm from '../components/PopulationForm';
import { countElementName, sortElements } from '../lib/core';
import { getPopulation } from '../store/actions/population-actions';
import { useAppDispatch, useAppSelector } from '../store/index';

const PopulationPage: FC = () => {
  const populationData = useAppSelector((state) => state.population.population);
  const appDispatch = useAppDispatch();

  // When the population data is set, update it with its elements
  useEffect(() => {
    // Do not fetch data if the name is empty.
    if (populationData.name === '') return;
    appDispatch(getPopulation());
  }, [populationData]);

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
