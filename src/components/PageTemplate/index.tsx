import { makeStyles } from '@material-ui/core';
import { FC } from 'react';

type PageTemplateProps = {
  title: string;
  description: string;
  children?: JSX.Element;
  column2?: JSX.Element;
};

const useStyles = (col2: boolean) =>
  makeStyles((theme) => ({
    overDiv: {
      width: '100vw',
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'center',
      height: '100vh',
    },
    afterMenuDiv: {
      minHeight: 80,
    },
    contentDiv: {
      display: 'flex',
      justifyContent: 'center',
      flexGrow: 2,
      width: '50em',
    },
    intro: {
      width: '50em',
    },
    column1: {
      width: col2 === true ? '35em' : '50em',
      height: '100%',
    },
    column2: {
      marginLeft: 20,
      width: '15em',
      height: '100%',
    },
    '@media screen and (max-width: 750px)': {
      afterMenuDiv: {
        minHeight: 60,
      },
    },
    '@media screen and (max-width: 800px)': {
      column2: {
        display: 'none',
      },
      column1: {
        width: 'calc(100vw - 20px)',
      },
      contentDiv: {
        width: 'auto',
      },
      intro: {
        width: 'calc(100vw - 20px)',
      },
    },
  }))();

/**
 * A component determining the structure of a page and where to place it.
 */
const PageTemplate: FC<PageTemplateProps> = (props) => {
  const classes = useStyles(!!props.column2);
  return (
    <div className={classes.overDiv}>
      <div className={classes.afterMenuDiv}></div>
      <div className={classes.intro}>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
      </div>
      <div className={classes.contentDiv}>
        <span className={classes.column1}>{props.children}</span>
        {props.column2 && <span className={classes.column2}>{props.column2}</span>}
      </div>
    </div>
  );
};
export default PageTemplate;
