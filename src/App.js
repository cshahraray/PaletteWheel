import './App.css';
import { ChromePicker } from 'react-color'
import React, { useState } from 'react';

function App() {
  const [color, setColor] = useState('#fff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  return (
    <div>
    <button onClick={ () => setShowColorPicker(!showColorPicker)} > Toggle </button>
    { showColorPicker && ( 
      <ChromePicker
      color={color}
      onChange={ updatedColor => setColor(updatedColor)}
      />
    )} 
    </div>
  );
}

export default App;
