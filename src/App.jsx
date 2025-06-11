import React, { useState } from 'react';
import './App.css';
import TextField from './components/TextField';
import Button from './components/Button';
import Banner from './components/Banner';

function App() {
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = () => {
    alert(`You entered: ${inputValue}`);
  };

  return (
    <div className="App p-8 max-w-2xl mx-auto">
      {/* Banner saying Hello world */}
      <Banner 
        type="info" 
        title="Welcome!" 
        dismissible={true}
        className="mb-6"
      >
        Hello world
      </Banner>

      {/* TextField and Button */}
      <div className="space-y-4">
        <TextField
          label="Enter your message"
          placeholder="Type something here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          helperText="This is a sample text field"
          fullWidth
        />

        <Button
          onClick={handleButtonClick}
          variant="primary"
          size="medium"
          disabled={!inputValue.trim()}
        >
          Submit
        </Button>
      </div>

      {/* Additional examples */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Component Examples</h2>
        
        <div className="grid gap-4">
          <Banner type="success" dismissible>
            This is a success banner
          </Banner>
          
          <Banner type="warning">
            This is a warning banner
          </Banner>
          
          <Banner type="error" title="Error">
            This is an error banner with a title
          </Banner>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" size="small">Small Secondary</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="success" size="large">Large Success</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
