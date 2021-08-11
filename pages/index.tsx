import { Button } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import PageTemplate from '../components/PageTemplate/index';
import { buttonTheme } from '../lib/themes';

const Home: FC = () => {
  const router = useRouter();
  return (
    <PageTemplate title="Home" description="Home">
      <div>
        <MuiThemeProvider theme={buttonTheme}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              router.push('/populationpage');
            }}
          >
            Start
          </Button>
        </MuiThemeProvider>
      </div>
    </PageTemplate>
  );
};

export default Home;
