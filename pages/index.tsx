import { FC } from "react";
import Menu from "../components/Menu";
import Simple from "../components/Simple";

const Home: FC = () => {
  return (
    <div>
      {" "}
      <Menu />
      <h1>Hello!</h1>
      <Simple />
    </div>
  );
};

export default Home;
