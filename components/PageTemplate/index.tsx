import { makeStyles } from '@material-ui/core';
import { FC } from 'react';

type PageTemplateProps = {
  title: string;
  description: string;
  children?: JSX.Element;
  column2?: JSX.Element;
};

const useStyles = makeStyles((theme) => ({
  overDiv: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentDiv: {
    display: 'flex',
    justifyContent: 'center',
    width: '50em',
  },
  intro: {
    width: '50em',
  },
  column1: {
    width: '30em',
  },
  column2: {
    marginLeft: 20,
    width: '20em',
  },
  '@media screen and (max-width: 800px)': {
    column2: {
      display: 'none',
    },
    column1: {
      width: '100vw',
    },
    contentDiv: {
      width: 'auto',
    },
    intro: {
      width: 'calc(100vw - 20px)',
      marginLeft: 20,
    },
  },
}));

/**
 * A component determining the structure of a page and where to place it.
 * @param props The title, description and children of the page
 */
const PageTemplate: FC<PageTemplateProps> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.overDiv}>
      <div className={classes.intro}>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
      </div>
      <div className={classes.contentDiv}>
        <span className={classes.column1}>{props.children}</span>
        <span className={classes.column2}>{props.column2}</span>
      </div>
    </div>
  );
};
export default PageTemplate;
