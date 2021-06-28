import { FC, useContext } from 'react';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
import SuccessesForm from '../components/SuccessesForm/index';
import { SuccessGroupsContext } from '../lib/contexts';
import { sortElements } from '../lib/core';

const Successes: FC = () => {
  const { successGroups } = useContext(SuccessGroupsContext);

  return (
    <PageTemplate
      title="Combos"
      description="Register a combo/success when either of these scenarios occur."
      column2={<div>Lorem ipsum dolor sit amet</div>}
    >
      <ListView
        infoList={sortElements(successGroups.main)}
        addItemTitle="Add card"
        addItemForm={() => <SuccessesForm />}
        editItemTitle="Edit card(s)"
        editItemForm={(defaultValue) => <SuccessesForm />}
      />
    </PageTemplate>
  );
};

export default Successes;
