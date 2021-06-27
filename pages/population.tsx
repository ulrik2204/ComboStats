import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { FC, useContext } from 'react';
import ListPage from '../components/ListPage';
import { PopulationContext } from '../lib/contexts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonDiv: {
      width: 'auto',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    addButton: {
      width: 50,
    },
  }),
);

const Population: FC = () => {
  const { population } = useContext(PopulationContext);

  return (
    <ListPage
      title="Deck"
      description="The group of cards that are drawn from."
      popupTitle="Add card to deck"
      infoList={population}
    />
  );
};

export default Population;
