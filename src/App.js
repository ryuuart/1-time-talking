import logo from './logo.svg';
import './App.css';
import './Messages.css';

// Components 
import Display from './Components/UI/Display';

function App() {
  return (
    <main>
      <Display className="messages-display--receiver"/>
      <Display className="messages-display--sender"/>
    </main>
  );
}

export default App;
