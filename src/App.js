import './App.css';
import './Messages.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Messages from "./Pages/Messages"
import Day from "./Pages/Day"

function App() {
  return (
    <main>
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Messages />} />
          <Route path="/day" exact component={() => <Day />} />
          <Route path="/music" exact component={() => <Messages />} />
          <Route path="/task" exact component={() => <Messages />} />
        </Switch>
      </Router>
    </main>
  );
}

export default App;
