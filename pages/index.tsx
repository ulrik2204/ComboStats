import { Button } from '@material-ui/core';
import { FC, useState } from 'react';
import FormTemplate from '../components/FormTemplate/index';
import PageTemplate from '../components/PageTemplate/index';
import { FormState } from '../lib/types-frontend';
import { useForm, useLoading } from '../lib/utils-frontend';
import { useAppDispatch, useAppSelector } from '../store';
import { editPopulation, getPopulation } from '../store/actions/population-actions';

const Home: FC = () => {
  const [load, setLoad] = useState(false);
  const startLoading = useLoading(load, 'Hei', 'somehing');
  const population = useAppSelector((state) => state.population);
  const dispatch = useAppDispatch();
  const [populationId, setPopualtionId] = useState('');
  const initialState = {
    submitFinished: false,
    loading: false,
    form: [
      [
        {
          value: '',
          label: 'Firstname',
        },
        {
          value: '',
          label: 'Lastname',
        },
        {
          value: 0,
          label: 'Age',
        },
      ],
      [{ value: [], label: 'Dognames' }],
    ],
  } as FormState;
  const [state, stateDispatch] = useForm(initialState);

  return (
    <PageTemplate title="Home" description="Home">
      <div>
        Lorem ipsum
        <Button
          onClick={() => {
            setLoad(true);
            startLoading();
            setTimeout(() => {
              setLoad(false);
            }, 1000);
          }}
        >
          Loading {load}
        </Button>
        <div>PopulationId {populationId}</div>
        <div>
          Something
          <Button onClick={() => dispatch(editPopulation({ newName: 'Super' }))}>
            Change name
          </Button>
          <Button onClick={() => dispatch(getPopulation())}>Get population els</Button>
          <div>
            <FormTemplate
              formState={state}
              formDispatch={stateDispatch}
              onSubmit={() => {
                return new Promise((resolve, reject) => resolve({}));
              }}
            >
              <div>Hei</div>
            </FormTemplate>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Home;
