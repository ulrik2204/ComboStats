import { Button, makeStyles, MuiThemeProvider, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { buttonTheme } from '../../lib/themes';
import { useToast } from '../../lib/utils-frontend';
import ListElement, { ListEl } from '../ListElement';
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
  infoList: ListEl[];
  corrMoreInfoList?: ListEl[];
  onDeleteAllClick: () => void;
  addItemTitle: string;
  addItemForm: (setOpenAddPopup?: Dispatch<SetStateAction<boolean>>) => JSX.Element;
  editItemTitle: string;
  editItemForm: (
    defaultValue: [ListEl, ListEl | undefined],
    setOpenEditPopup?: Dispatch<SetStateAction<boolean>>,
  ) => JSX.Element;
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
    justifyContent: 'space-between',
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
  const [clickedElement, setClickedElement] = useState<[ListEl, ListEl | undefined]>([
    { boldNotes: [''], fadedNotes: [] },
    undefined,
  ]);
  const confirmAction = useToast();
  const classes = useStyles();

  return (
    <div className={classes.viewDiv}>
      <div className={classes.buttonDiv}>
        <Popup open={openAddPopup} onClose={() => setOpenAddPopup(false)} title={props.addItemTitle}>
          {props.addItemForm(setOpenAddPopup)}
        </Popup>
        <MuiThemeProvider theme={buttonTheme}>
          <Button
            variant="contained"
            color="default"
            onClick={() =>
              confirmAction({
                title: 'Delete all items in list?',
                type: 'confirm',
                onYes: props.onDeleteAllClick,
                description: 'This action is irreversible.',
              })
            }
          >
            Delete all
          </Button>
          <Button
            variant="contained"
            color="default"
            className={classes.addButton}
            onClick={() => setOpenAddPopup(true)}
          >
            Add
          </Button>
        </MuiThemeProvider>
      </div>
      <Popup open={openEditPopup} onClose={() => setOpenEditPopup(false)} title={props.editItemTitle}>
        {props.editItemForm(clickedElement, setOpenEditPopup)}
      </Popup>
      <MuiThemeProvider theme={buttonTheme}>
        <List className={classes.list}>
          {(() => {
            const listElements: JSX.Element[] = [];
            for (let i = 0; i < props.infoList.length; i++) {
              const el = props.infoList[i];
              const corrEl = props.corrMoreInfoList?.[i];
              const elItem = { boldNotes: el.boldNotes, fadedNotes: el.fadedNotes };
              const corrElItem = corrEl ? { boldNotes: corrEl.boldNotes, fadedNotes: corrEl.fadedNotes } : undefined;
              listElements.push(
                <ListElement
                  item={elItem}
                  item2={corrElItem}
                  key={uuidv4()}
                  onClick={() => {
                    setOpenEditPopup(true);
                    setClickedElement([elItem, corrElItem]);
                  }}
                />,
              );
            }
            return listElements;
          })()}
        </List>
      </MuiThemeProvider>
    </div>
  );
};
export default ListView;
