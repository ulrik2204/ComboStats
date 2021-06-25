import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { FC, useCallback, useContext, useState } from 'react';
import ListView from '../components/ListView';
import PageTemplate from '../components/PageTemplate';
import PopulationForm from '../components/PopulationForm';
import Popup from '../components/Popup';
import { PopulationContext } from '../lib/contexts';
import { sortElements } from '../lib/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    overDiv: {
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    contentDiv: {},
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
  const [openPopup, setOpenPopup] = useState(false);
  const { population } = useContext(PopulationContext);
  const classes = useStyles();

  const handleAddClick = useCallback(() => {
    setOpenPopup(true);
  }, [setOpenPopup]);

  return (
    <div className={classes.overDiv}>
      <div className={classes.contentDiv}>
        <PageTemplate
          title="Deck"
          description="The group of cards that are drawn from."
          column2={<div>Lorem ipsum dolor sit amet </div>}
        >
          <div>
            <div className={classes.buttonDiv}>
              <Popup open={openPopup} onClose={() => setOpenPopup(false)} title={'Add card to deck'}>
                <PopulationForm defaultName="" defaultRoles={[]} type="add" clearAllOnConfirm />
              </Popup>
              <Button variant="contained" color="default" className={classes.addButton} onClick={handleAddClick}>
                Add
              </Button>
            </div>
            <ListView infoList={sortElements(population)} />
          </div>
        </PageTemplate>
      </div>
    </div>
  );
};

export default Population;
