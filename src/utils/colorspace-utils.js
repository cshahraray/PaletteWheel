//Helper methods for working between and with
//various color spaces


//convert hsv values to rgb (source: )
// export function hsv2rgb(h, s, l){
//   var r, g, b;

//   if(s === 0){
//       r = g = b = l; // achromatic
//   }else{
//       var hue2rgb = function hue2rgb(p, q, t){
//           if(t < 0) t += 1;
//           if(t > 1) t -= 1;
//           if(t < 1/6) return p + (q - p) * 6 * t;
//           if(t < 1/2) return q;
//           if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
//           return p;
//       }

//       var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//       var p = 2 * l - q;
//       r = hue2rgb(p, q, h + 1/3);
//       g = hue2rgb(p, q, h);
//       b = hue2rgb(p, q, h - 1/3);
//   }

//   return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
// }
export function hsv2rgb(hue, saturation, value) {
  let chroma = value * saturation;
  let hue1 = hue / 60;
  let x = chroma * (1- Math.abs((hue1 % 2) - 1));
  let r1, g1, b1;
  if (hue1 >= 0 && hue1 <= 1) {
    ([r1, g1, b1] = [chroma, x, 0]);
  } else if (hue1 >= 1 && hue1 <= 2) {
    ([r1, g1, b1] = [x, chroma, 0]);
  } else if (hue1 >= 2 && hue1 <= 3) {
    ([r1, g1, b1] = [0, chroma, x]);
  } else if (hue1 >= 3 && hue1 <= 4) {
    ([r1, g1, b1] = [0, x, chroma]);
  } else if (hue1 >= 4 && hue1 <= 5) {
    ([r1, g1, b1] = [x, 0, chroma]);
  } else if (hue1 >= 5 && hue1 <= 6) {
    ([r1, g1, b1] = [chroma, 0, x]);
  }
  
  let m = value - chroma;
  let [r,g,b] = [r1+m, g1+m, b1+m];
  
  // Change r,g,b values from [0,1] to [0,255]
  return [255*r,255*g,255*b];
}

//given an angle (in degrees) return the
//corresponding color RGB values as string for fill
export const angle2Color = (angle) => {
  const rgbArr = hsv2rgb(angle, .5, .5)
  return `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`
}


//