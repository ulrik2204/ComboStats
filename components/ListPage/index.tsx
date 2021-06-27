import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { FC, useState } from 'react';
import { Element, sortElements } from '../../lib/core';
import ListView from '../ListView';
import PageTemplate from '../PageTemplate';
import PopulationForm from '../PopulationForm';
import Popup from '../Popup';

type ListPageProps = {
  title: string;
  description: string;
  infoList: Element[];
  popupTitle: string;
};

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

const ListPage: FC<ListPageProps> = (props) => {
  const [openPopup, setOpenPopup] = useState(false);
  const classes = useStyles();

  return (
    <PageTemplate title={props.title} description={props.description} column2={<div>Lorem ipsum dolor sit amet</div>}>
      <div>
        <div className={classes.buttonDiv}>
          <Popup open={openPopup} onClose={() => setOpenPopup(false)} title={props.popupTitle}>
            <PopulationForm defaultName="" defaultRoles={[]} type="add" clearAllOnConfirm />
          </Popup>
          <Button variant="contained" color="default" className={classes.addButton} onClick={() => setOpenPopup(true)}>
            Add
          </Button>
        </div>
        <ListView infoList={sortElements(props.infoList)} />
      </div>
    </PageTemplate>
  );
};

export default ListPage;
