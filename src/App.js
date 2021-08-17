import './App.css';
import React, {  } from 'react';
import { ColorCircleKonva } from './konva-src/components/color-circle-konva';
import { getAngle, getCirclePoint, getDist } from './utils/konva-circle-utils';
import { AsyncTest } from './konva-src/components/color-circle-konva-asynctest';


function App() {


  return (
    <>
    <div>

    <AsyncTest radius={100}/>
    
    </div>
    </>
  );
}

export default App;
