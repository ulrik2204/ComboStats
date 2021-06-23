import { Button, makeStyles, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import { FC, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ListElement from '../ListElement';
import Popup from '../Popup';
/**
 * The props of the ListPres component.
 * If corrMoreInfoList is used, it has to be the same length as infoList
 */
type ListPresProps = {
  infoList: [string, string[]][];
  corrMoreInfoList?: [string, string[]][];
};

function requireTwoSameLengthArrays<T extends readonly [] | readonly any[]>(t: T, u: { [K in keyof T]: any }): void {}

const useStyles = makeStyles((theme: Theme) => ({
  viewDiv: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ListView: FC<ListPresProps> = (props) => {
  if (props.corrMoreInfoList) requireTwoSameLengthArrays(props.infoList, props.corrMoreInfoList);
  const classes = useStyles();
  const [open, setOpen] = useState(false);



  return (
    <div className={classes.viewDiv}>

      <List>
        {(() => {
          const listElements: JSX.Element[] = [];
          for (let i = 0; i < props.infoList.length; i++) {
            const el = props.infoList[i];
            const corr = props?.corrMoreInfoList;
            const corrEl = corr ? corr[i] : [undefined, undefined];
            listElements.push(
              <ListElement title={el[0]} infoList={el[1]} title2={corrEl[0]} bulletList={corrEl[1]} key={uuidv4()} />,
            );
          }
          return listElements;
        })()}
      </List>
    </div>
  );
};
export default ListView;
