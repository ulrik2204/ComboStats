import { useRouter } from 'next/dist/client/router';
import { FC, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate/index';
import { populationPageUrl, successesPageUrl } from '../lib/constants-frontend';
import { useAppSelector } from '../store/index';

const Calculate: FC = () => {
  const router = useRouter();
  const state = useAppSelector((state) => state);
  // If the user tries to access the page without having a set population or successes, redirect to that page.
  useEffect(() => {
    if (state.population.population.name === '') router.push(populationPageUrl);
    else if (state.successes.scenarioGroup.name === '') router.push(successesPageUrl);
  }, []);
  return (
    <PageTemplate title="Calculate" description="Calculate">
      <div>
        Hei
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet lobortis leo, a
          gravida arcu. In id placerat est. Morbi laoreet semper erat, vel bibendum enim. Phasellus
          sed cursus turpis, non tincidunt sapien. Curabitur tristique nisl quis risus tempus
          lacinia. Aenean accumsan turpis sed odio ornare aliquet semper non sapien. Nullam a
          pretium nisl. Fusce faucibus ex ac euismod iaculis. Maecenas lobortis purus sed nibh
          efficitur sollicitudin.
        </p>
        Mauris quam est, suscipit nec nisl id, hendrerit tristique massa. Pellentesque gravida
        tempus metus, sit amet dapibus quam. Mauris sed volutpat felis. Sed nec consectetur eros.
        Quisque ac ultrices magna. Fusce arcu ante, porta in lacus vel, facilisis ullamcorper risus.
        Etiam fermentum in tortor vitae mollis. Pellentesque cursus dui quis nisi interdum mattis.
        Quisque et scelerisque tellus. Praesent condimentum sem lacinia, elementum velit eget,
        bibendum magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
        cubilia curae; Donec non elit at mi porttitor pulvinar. Praesent sollicitudin blandit
        luctus. Aenean cursus velit ex, in pretium sem venenatis eu. Nulla quis vestibulum tellus.
        Donec et facilisis dolor. Phasellus id accumsan lacus.
      </div>
    </PageTemplate>
  );
};

export default Calculate;
