import { useRouter } from 'next/dist/client/router';
import { FC, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate/index';
import { populationPageUrl, successesPageUrl } from '../lib/constants-frontend';
import { useAppSelector } from '../store/index';

const More: FC = () => {
  const state = useAppSelector((state) => state);
  const router = useRouter();
  // If the user tries to access the page without having a set population or successes, redirect to that page.
  useEffect(() => {
    if (state.population.population.name === '') router.push(populationPageUrl);
    else if (state.successes.scenarioGroup.name === '') router.push(successesPageUrl);
  }, []);
  return (
    <PageTemplate title="More" description="More">
      <div>More</div>
    </PageTemplate>
  );
};

export default More;
