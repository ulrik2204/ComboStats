import { Population } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown/index';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
import PopulationForm from '../components/PopulationForm';
import { getPopulationsOnUserFromAPI } from '../lib/api-calls';
import { countElementName, sortElements } from '../lib/core';
import { useToast } from '../lib/utils-frontend';
import { setPopulation } from '../store/actions/population-actions';
import { useAppDispatch, useAppSelector } from '../store/index';

const PopulationPage: FC = () => {
  const population = useAppSelector((state) => state.population.population);
  const dispatch = useAppDispatch();
  const [populations, setPopulations] = useState<Population[]>([]);
  const [currentPopulationName, setCurrentPopulationName] = useState(population.name);
  const toast = useToast();

  // Find user populations on page load
  useEffect(() => {
    getPopulationsOnUserFromAPI().then((res) => {
      if (!res.ok) {
        toast({
          title: 'Unable to retrieve your decks/populations',
          description: `Error getting data from the server: ${res.status}.`,
          type: 'alert',
          color: 'error',
        });
      }
      // Else update the populations state
      setPopulations(res.data.allUserPopulations);
    });
  }, []);

  // Update the global population to the popualtion with name as currentPopulationName
  // when currentPopulationName changes.
  useEffect(() => {
    if (populations.length > 0) {
      const populationWithName = populations.find((pop) => pop.name === currentPopulationName);
      if (populationWithName === undefined) return;
      dispatch(setPopulation(populationWithName));
    }
  }, [currentPopulationName]);

  // useEffect(() => console.log(population), [population]);

  return (
    <PageTemplate
      title="Deck"
      description="The group of cards that are drawn from."
      column2={<div>Lorem ipsum dolor sit amet</div>}
    >
      <div>
        <Dropdown
          itemList={populations.map((pop) => pop.name)}
          value={currentPopulationName}
          setValue={setCurrentPopulationName}
          inputLabel="Deck"
          addButtonOnClick={() => {
            console.log('AddButtonOnClick');
            toast({
              title: 'Add deck',
              description: 'Create a new deck.',
              type: 'alert',
              color: 'primary',
            });
          }}
        />
        <ListView
          infoList={sortElements(population.elements).map((el) => ({
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
              defaultCount={countElementName(population.elements, defaultValue[0].boldNotes[0])}
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
