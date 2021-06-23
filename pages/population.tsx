import { createStyles, makeStyles, Theme, Button } from '@material-ui/core';
import { FC, useCallback, useContext, useState } from 'react';
import ListView from '../components/ListView';
import PageTemplate from '../components/PageTemplate';
import Popup from '../components/Popup';
import { PopulationContext } from '../lib/contexts';
import { Element, Population as Pop } from '../lib/core';
import PopulationForm from '../components/PopulationForm';

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
  const pop = new Pop()
    .add(new Element('Test', 'test1', 'test2'))
    .add(new Element('Hallo', 'noen der', 'noen her'))
    .add(new Element('Monster reborn', 'extender'));
  const thisInfoList: [string, string[]][] = pop.toArray().map((el) => [el.getName(), Array.from(el.getRoles())]);

  const [openPopup, setOpenPopup] = useState(false);
  const { population } = useContext(PopulationContext);
  const classes = useStyles();

  const handleAddClick = useCallback(() => {
    setOpenPopup(true);
    console.log('Add knappen klikka');
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
              <Popup open={openPopup} onClose={() => setOpenPopup(false)} title={'Hei'}>
                <PopulationForm />
              </Popup>
              <Button variant="contained" color="default" className={classes.addButton} onClick={handleAddClick}>
                Add
              </Button>
            </div>
            <ListView infoList={thisInfoList} />
          </div>
        </PageTemplate>
      </div>
    </div>
  );
};

export default Population;
