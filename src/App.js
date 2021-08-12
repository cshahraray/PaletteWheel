import './App.css';
import { ChromePicker } from 'react-color'
import React, { useState } from 'react';
import ColorCircle from './components/color-circle';
import { ColorSquare } from './components/color-square';

function App() {
  const [color, setColor] = useState('#fff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  return (
    <>
    <div>
    {/* <button onClick={ () => setShowColorPicker(!showColorPicker)} > Toggle </button>
    { showColorPicker && ( 
      <ChromePicker
      color={color}
      onChange={ updatedColor => setColor(updatedColor)}
      />
    )}  */}
    <ColorCircle />

    
    </div>
      <div id='color-wheel'></div>
    </>
  );
}

export default App;
