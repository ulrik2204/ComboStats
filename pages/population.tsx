import { FC, useContext } from 'react';
import ListPage from '../components/ListPage';
import PopulationForm from '../components/PopulationForm/index';
import { PopulationContext } from '../lib/contexts';

const Population: FC = () => {
  const { population } = useContext(PopulationContext);

  return (
    <ListPage
      title="Deck"
      description="The group of cards that are drawn from."
      popupTitle="Add card to deck"
      infoList={population}
      addForm={<PopulationForm defaultName="" defaultRoles={[]} type="add" clearAllOnConfirm />}
    />
  );
};

export default Population;
