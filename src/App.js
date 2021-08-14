import './App.css';
import React, {  } from 'react';
import { ColorCircleKonva } from './components/color-circle-konva';
import { getAngle, getCirclePoint, getDist } from './utils/konva-circle-utils';


function App() {


  return (
    <>
    <div>
    {window.getAngle = getAngle}
    {window.getDist = getDist}
    {window.getCirclePoint = getCirclePoint}

    <ColorCircleKonva/>
    
    </div>
    </>
  );
}

export default App;
