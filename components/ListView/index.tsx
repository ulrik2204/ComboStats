import { Button, makeStyles, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Element } from '../../lib/core';
import ListElement from '../ListElement';
import Popup from '../Popup/index';

/**
 * The props of the ListPres component.
 * If corrMoreInfoList is used, it has to be the same length as infoList.
 * editItemForm is the form that will be used for editing an item.
 * This is a renderprop where the provided argument for the function, defaultValue,
 * is a tuple of the element that is to be edited,
 * and the optional corresponding element that can also be edited.
 */
type ListViewProps = {
  infoList: Element[];
  corrMoreInfoList?: Element[];
  addItemTitle: string;
  addItemForm: (setOpenAddPopup?: Dispatch<SetStateAction<boolean>>) => JSX.Element;
  editItemTitle: string;
  editItemForm: (defaultValue: [Element, Element | undefined], setOpenEditPopup?: Dispatch<SetStateAction<boolean>>) => JSX.Element;
};

function requireTwoSameLengthArrays<T extends readonly [] | readonly any[]>(t: T, u: { [K in keyof T]: any }): void {}

const useStyles = makeStyles((theme: Theme) => ({
  viewDiv: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
  },
  list: {
    flexGrow: 1,
    flexBasis: 300,
    overflow: 'auto',
  },
  buttonDiv: {
    width: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  addButton: {
    width: 50,
  },
}));

const ListView: FC<ListViewProps> = (props) => {
  if (props.corrMoreInfoList) requireTwoSameLengthArrays(props.infoList, props.corrMoreInfoList);
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [clickedElement, setClickedElement] = useState<[Element, Element | undefined]>([
    { name: '', roles: [] },
    undefined,
  ]);
  const classes = useStyles();

  return (
    <div className={classes.viewDiv}>
      <div className={classes.buttonDiv}>
        <Popup open={openAddPopup} onClose={() => setOpenAddPopup(false)} title={props.addItemTitle}>
          {props.addItemForm(setOpenAddPopup)}
        </Popup>
        <Button variant="contained" color="default" className={classes.addButton} onClick={() => setOpenAddPopup(true)}>
          Add
        </Button>
      </div>
      <Popup open={openEditPopup} onClose={() => setOpenEditPopup(false)} title={props.editItemTitle}>
        {props.editItemForm(clickedElement, setOpenEditPopup)}
      </Popup>
      <List className={classes.list}>
        {(() => {
          const listElements: JSX.Element[] = [];
          for (let i = 0; i < props.infoList.length; i++) {
            const el = props.infoList[i];
            const corrEl = props.corrMoreInfoList?.[i];
            listElements.push(
              <ListElement
                title={el.name}
                infoList={el.roles}
                title2={corrEl?.name}
                bulletList={corrEl?.roles}
                key={uuidv4()}
                onClick={() => {
                  setOpenEditPopup(true);
                  setClickedElement([
                    { name: el.name, roles: el.roles },
                    corrEl ? { name: corrEl.name, roles: corrEl.roles } : undefined,
                  ]);
                }}
              />,
            );
          }
          return listElements;
        })()}
      </List>
    </div>
  );
};
export default ListView;
