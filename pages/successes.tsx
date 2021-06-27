import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { FC, useContext } from 'react';
import ListPage from '../components/ListPage';
import SuccessesForm from '../components/SuccessesForm/';
import { SuccessGroupsContext } from '../lib/contexts';


const Successes: FC = () => {
  const { successGroups } = useContext(SuccessGroupsContext);

  return (
    <ListPage
      title="Combos"
      description="Register combo when either of these scenarios occur."
      popupTitle="Add combo"
      infoList={successGroups.main}
      addForm={<SuccessesForm />}
    />
  );
};

export default Successes;
