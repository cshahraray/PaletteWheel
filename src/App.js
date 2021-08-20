import './App.css';
import React, {  } from 'react';
import { ColorCircleKonva } from './konva-src/components/color-circle-konva';
import { deg2Rad, getAngle, getCirclePoint, getDist } from './utils/konva-circle-utils';
import { RainbowFill } from './graphics/rainbowfill';
import { SatLumCircle } from './graphics/sat-lum-circle-graphic';
import { FastLayer, Stage } from 'react-konva';
import { hslToRgb } from '@material-ui/core';


function App() {


  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  return (
    <>
    <div>
    <ColorCircleKonva window={[window.innerWidth, window.innerHeight]}/>
    {/* <Stage height={windowHeight} width={windowWidth} >
    <FastLayer>

    </FastLayer>
    </Stage> */}
    </div>
    </>
  );


}

export default App;
