import { Chat } from './components/Chat';

function App() {
  return (
    <div className="min-vh-100 bg-gradient-app d-flex align-items-center justify-content-center p-3">
      <div className="w-100 chat-container" style={{ maxWidth: '1200px', height: '85vh' }}>
        <Chat />
      </div>
    </div>
  );
}

export default App;
