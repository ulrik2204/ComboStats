import { Button } from '@material-ui/core';
import { FC, useState } from 'react';
import PageTemplate from '../components/PageTemplate/index';
import { useLoading } from '../lib/utils-frontend';
const Home: FC = () => {
  const [count, setCount] = useState(0);
  const startLoading = useLoading(count, 'Hei', 'somehing');
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
      </div>
    </PageTemplate>
  );
};

export default Home;
