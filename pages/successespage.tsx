import { FC, useContext } from 'react';
import ListView from '../components/ListView/index';
import PageTemplate from '../components/PageTemplate/index';
import SuccessesForm from '../components/SuccessesForm/index';
import { SuccessGroupsContext } from '../lib/contexts';
import { sortElements } from '../lib/core';

const Successes: FC = () => {
  const { successGroups, setSuccessGroups } = useContext(SuccessGroupsContext);

  return (
    <PageTemplate
      title="Combos"
      description="Register a combo/success when either of these scenarios occur."
      column2={<div>Lorem ipsum dolor sit amet</div>}
    >
      <ListView
        infoList={successGroups.main.map((els) => ({
          boldNotes: sortElements(els).map((el) => el.name),
        }))}
        addItemTitle="Add card"
        addItemForm={() => <SuccessesForm defaultSuccesses={[]} />}
        editItemTitle="Edit card(s)"
        editItemForm={(defaultValue) => (
          <SuccessesForm defaultSuccesses={defaultValue[0].boldNotes} />
        )}
      />
    </PageTemplate>
  );
};

export default Successes;
