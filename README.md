live: palette-wheel.herokuapp.com

Palette-Wheel is a single page React App that allows users to create custom color palettes based upon general principles of Color Theory. 

The key elements involved in the creation of this React application are:
-Creating a data visualization component to display color information in an intuitive manner
-Using trigonometry to map user input from geometric values to scoped and meaningful color values 
-Developing interactive components with which a user can adjust and customize colors

I. DATA VISUALIZATION:
I owe a lot of gratitude to Cory Forsyth's guide "How to Handcode a Color Wheel with Canvas," available here: https://medium.com/@bantic/hand-coding-a-color-wheel-with-canvas-78256c9d7d43

I began by following along Forsyth's guide to create a fixed, non-interactive display of all visible hues in the color spectrum. 

Unlike Forsyth, I chose to create seperate elements to visualize hue, saturation and luminance -- which together make up the HSL color model. Colors were mapped through the use of HLS values because this color space measures hues using degrees/radians, and thus corresponded easily to the geometric values I used to iteratively and dynamically generate this visualization on the HTML canvas.
The first visual element consists of an outer ring which displays all of the hues within the visible light spectrum, mapping the degree value of the hue into a corresponding filled pixel of the ring.

In addition to the ring used to visualize hues, I created an inner circle to visualize all saturation and luminance values of a selected hue. The visualization maps saturation (measured as a percentage from 0 to 100) to a circle's radial distance, and lightness values (also a percentage) to a circle's radial arc.

These visualizations were both done iteratively and dynamically using the Canvas API. The canvas elements generated were then exported as image data to be used and displayed using the React-Konva libraray.


II. RECEIVING AND MAPPING USER INPUT
Using the React-Konva library, I created an interactive visual interface which allows Users to create Monochrome, Complementary, Triadic and Tetradic color harmonies based on a selected hue. I wanted this program to allow for both automatic palette creation based on mathematical color theory principals, but also allow for complete customization of hue, saturation and lightness values.

I created a draggable controller on the color visualizations to allow the user to select a primary color. With the harmonies set to fixed, the program displays additional (fixed) controllers representing it's color harmonies. With harmonies set to custom, the user may likewise  individually adjust the additional hues, and the inner visualization will change to show all saturation and luminescence values of that hue.
The controller for the shades of each hue operates similarly. When set to automatic, additional shades are calculated based on the User's input of the primary shade (outlined in black). When set individually, the user may change the saturation and luminance values for each shade individually.


This made use of several React Hooks for functional React components:
I used React's useRef hook to track, reference, and adjust the current position of the graphic elements used in both tracking user input and visualizing color information. 
I used React's useState hook to track and reference changes in the input from the User controller for the primary color (outlined in black).
I used React's useReducer to calculate and reference more complex geometric information and values. The useReducer hook allowed me to DRY up calculations by keeping them all in one reference outside of my component. It also allowed for this information to be organized and stored in one spot.

Since I made use of circular forms in the visual component of the interface, and used circular geometry to calculate user input, I needed to bind the User's controls to both a ring/donut-like area as well as a circular area. This was done through the use of a bindMouseDrag function and trignometry.
