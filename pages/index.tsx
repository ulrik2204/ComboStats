import { Button } from '@material-ui/core';
import { FC, useEffect, useState } from 'react';
import PageTemplate from '../components/PageTemplate/index';
import { createPopulationFromAPI } from '../lib/api-calls';
import { useLoading } from '../lib/utils-frontend';
import { useAppDispatch, useAppSelector } from '../store';
import { editPopulation, getPopulation } from '../store/actions/population-actions';

const Home: FC = () => {
  const [count, setCount] = useState(0);
  const startLoading = useLoading(count, 'Hei', 'somehing');
  const population = useAppSelector((state) => state.population);
  const dispatch = useAppDispatch();
  const [populationId, setPopualtionId] = useState('');
  // const [isLogged, setIsLogged] = useState(false);
  // const startLoadingLogging = useLoading(isLogged, 'Logging in as temporary user...', 'Waiting for database.');

  // useEffect(() => {
  //   startLoadingLogging();
  // }, []);
  // useEffect(() => {
  //   setTimeout(() => {
  //     isLoggedIn().then((is) => setIsLogged(is));
  //   }, 2000);
  // });
  //useLoginTempUser();
  useEffect(() => {
    createPopulationFromAPI({ name: '' }).then((res) => {
      if (res.ok) {
        setPopualtionId(res.data.population.populationId);
      }
    });
  }, []);

  return (
    <PageTemplate title="Home" description="Home">
      <div>
        Lorem ipsum
        <Button
          onClick={() => {
            startLoading();
            setTimeout(() => {
              setCount(count + 1);
            }, 1000);
          }}
        >
          {count}
        </Button>
        <div>PopulationId {populationId}</div>
        <div>
          Something
          <Button onClick={() => dispatch(editPopulation({ newName: 'Super' }))}>
            Change name
          </Button>
          <Button onClick={() => dispatch(getPopulation())}>Get population els</Button>
          <div>{JSON.stringify(population)}</div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Home;
