import { makeStyles, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import { FC } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Element } from '../../lib/core';
import ListElement from '../ListElement';

/**
 * The props of the ListPres component.
 * If corrMoreInfoList is used, it has to be the same length as infoList
 */
type ListPresProps = {
  infoList: Element[];
  corrMoreInfoList?: Element[];
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

  return (
    <div className={classes.viewDiv}>
      <List>
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
