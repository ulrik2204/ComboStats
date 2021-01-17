import Menu from "./components/Menu/Menu";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./routes/Home";
import BuildPool from "./routes/BuildPool";
import SelectSuccesses from "./routes/SelectSuccesses";
import OtherFeatures from "./routes/OtherFeatures";
import CalculateStats from "./routes/CalculateStats";

const Root = () => {
  return (
    <Router>
      <div>
        <Menu />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/buildpool" component={BuildPool} />
          <Route path="/selectsuccesses" component={SelectSuccesses} />
          <Route path="/otherfeatures" component={OtherFeatures} />
          <Route path="/calculatestats" component={CalculateStats} />
        </Switch>
      </div>
    </Router>
  );
};

export default Root;
