import './App.css';
import React, {  } from 'react';
import { ColorCircleKonva } from './konva-src/components/color-circle-konva';
import { getAngle, getCirclePoint, getDist } from './utils/konva-circle-utils';


function App() {


  return (
    <>
    <div>

    <ColorCircleKonva radius={100}/>
    
    </div>
    </>
  );
}

export default App;
