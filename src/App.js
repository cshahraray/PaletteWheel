import './App.css';
import React, {  } from 'react';
import { ColorCircleKonva } from './konva-src/components/color-circle-konva';
import { getAngle, getCirclePoint, getDist } from './utils/konva-circle-utils';
import { RainbowFill } from './graphics/rainbowfill';


function App() {


  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  return (
    <>
    <div>
    <ColorCircleKonva window={[window.innerWidth, window.innerHeight]}/>
    </div>
    </>
  );
}

export default App;
