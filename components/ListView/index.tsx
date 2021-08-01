import { Button, makeStyles, MuiThemeProvider, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { buttonTheme } from '../../lib/themes';
import { ListObject } from '../../lib/types-frontend';
import { useToast } from '../../lib/utils-frontend';
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
  infoList: ListObject[];
  corrMoreInfoList?: ListObject[];
  // onDeleteAllClick: () => void;
  showAddButton: boolean;
  addItemTitle: string;
  addItemForm: (setOpenAddPopup?: Dispatch<SetStateAction<boolean>>) => JSX.Element;
  editItemTitle: string;
  editItemForm: (
    clickedItem: { item: ListObject; corrItem?: ListObject },
    setOpenEditPopup?: Dispatch<SetStateAction<boolean>>,
  ) => JSX.Element;
};

function requireTwoSameLengthArrays<T extends readonly [] | readonly any[]>(
  t: T,
  u: { [K in keyof T]: any },
): void {}

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
  const [clickedElement, setClickedElement] = useState<{ item: ListObject; corrItem?: ListObject }>(
    { item: { id: '', name: '', notes: [], count: 0 } },
  );
  const toast = useToast();
  const classes = useStyles();

  return (
    <div className={classes.viewDiv}>
      <div className={classes.buttonDiv}>
        <Popup
          open={openAddPopup}
          onClose={() => setOpenAddPopup(false)}
          title={props.addItemTitle}
        >
          {props.addItemForm(setOpenAddPopup)}
        </Popup>
        <MuiThemeProvider theme={buttonTheme}>
          {/* <Button
            variant="contained"
            color="default"
            onClick={() =>
              toast({
                title: 'Delete all items in list?',
                type: 'confirm',
                onYes: props.onDeleteAllClick,
                description: 'This action is irreversible.',
              })
            }
          >
            Delete all
          </Button> */}
          {props.showAddButton && (
            <Button
              variant="contained"
              color="default"
              className={classes.addButton}
              onClick={() => setOpenAddPopup(true)}
            >
              Add
            </Button>
          )}
        </MuiThemeProvider>
      </div>
      <Popup
        open={openEditPopup}
        onClose={() => setOpenEditPopup(false)}
        title={props.editItemTitle}
      >
        {props.editItemForm(clickedElement, setOpenEditPopup)}
      </Popup>
      <MuiThemeProvider theme={buttonTheme}>
        <List className={classes.list}>
          {(() => {
            const listElements: JSX.Element[] = [];
            for (let i = 0; i < props.infoList.length; i++) {
              const item = props.infoList[i];
              const corrItem = props.corrMoreInfoList?.[i];
              const items = [];
              const element = (id: string) => (
                <ListElement
                  item={item}
                  item2={corrItem}
                  key={`${item.id} ${id}`}
                  onClick={() => {
                    setOpenEditPopup(true);
                    setClickedElement({ item, corrItem });
                  }}
                />
              );
              for (let x = 0; x < item.count; x++) items.push(element(x.toString()));
              listElements.push(...items);
            }
            return listElements;
          })()}
        </List>
      </MuiThemeProvider>
    </div>
  );
};
export default ListView;

// props.infoList.reduce((listElements: JSX.Element[], item: ListObject, i) => {
//   const corrItem = props.corrMoreInfoList?.[i];
//   const items = [];
//   const listElement = (
//     <ListElement
//       item={item}
//       item2={corrItem}
//       key={uuidv4()}
//       onClick={() => {
//         setOpenEditPopup(true);
//         setClickedElement({ item, corrItem });
//       }}
//     />
//   );
//   for (let x = 0; x < item.count; i++) items.push(listElement);
//   return [...listElements, ...items];
// }, [])}
