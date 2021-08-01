import { FC, useContext } from 'react';
import PageTemplate from '../components/PageTemplate/index';
import { SuccessGroupsContext } from '../lib/contexts';

const Successes: FC = () => {
  const { successGroups, setSuccessGroups } = useContext(SuccessGroupsContext);

  return (
    <PageTemplate
      title="Combos"
      description="Register a combo/success when either of these scenarios occur."
      column2={<div>Lorem ipsum dolor sit amet</div>}
    >
      <div>Hello</div>
      {/* <ListView
        infoList={successGroups.main.map((els) => ({
          boldNotes: sortElements(els).map((el) => el.name),
        }))}
        addItemTitle="Add card"
        addItemForm={() => <SuccessesForm defaultSuccesses={[]} />}
        editItemTitle="Edit card(s)"
        editItemForm={(defaultValue) => (
          <SuccessesForm defaultSuccesses={defaultValue[0].name} />
        )}
      /> */}
    </PageTemplate>
  );
};

export default Successes;
