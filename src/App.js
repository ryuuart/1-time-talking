import logo from './logo.svg';
import './App.css';
import './Messages.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Pages/Login"
import Messages from "./Pages/Messages"

function App() {
  return (
    <main>
      <Router>
        <Switch>
          <Route path="/login" exact component={() => <Login />} />
          <Route path="/" exact component={() => <Messages />} />
        </Switch>
      </Router>
    </main>
  );
}

export default App;
