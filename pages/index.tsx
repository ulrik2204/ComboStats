import { Button } from '@material-ui/core';
import { FC, useState } from 'react';
import PageTemplate from '../components/PageTemplate/index';
import { isLoggedIn } from '../lib/api-calls';
const Home: FC = () => {
  const [isLogged, setIsLogged] = useState('Nothing');
  return (
    <PageTemplate title="Home" description="Home">
      <div>
        Lorem ipsum
        <Button
          onClick={async () => {
            const il = await isLoggedIn();
            setIsLogged(il.toString());
          }}
        >
          {isLogged}
        </Button>
      </div>
    </PageTemplate>
  );
};

export default Home;
