# Multi-display-slider
Slider to display multiple slides per display.

## How to use
Add file as a module script to html file. <br >
Use the `<multi-display-slide></multi-display-slide>` tag to add the slider to page. <br >
Position slide elements  between `<multi-display-slide></multi-display-slide>` tag. <br ><br >

Check index.html for markup example. It will need a live server to run. <br ><br ><br >


| Name                            | Type              | Default    | Options           | Description  |
| :------------------------------ | :-----------------| :----------| :-----------------| :------------|
| slides-per-display              | {Number}          | 1          |                   | Allows to setup number of slides to display per screen when slides-per-display-breakpoints is not used. |
| slides-per-display-step         | {Number}          | 1          |                   | Allows scroll distance corresponding number of slide to be set up. Does not work when scroll-slider-distance is in display mode.  |
| slides-per-display-breakpoints  | `{string and array}`  | [ ]        |                   | Allows slide breakpoins to be set. |
| scroll-slider-distance          | {string}          | display    | (display or slide) | Allow scrolling step by number of slide width or display width |

 <br ><br ><br >

<pre>
  <multi-display-slider` 
        slides-per-display=2 
        slides-per-display-step=1 
        slides-per-display-breakpoints='[{"(width >= 1200)":"5"},{"(992 <= width <= 1199)":"4"},{"(768 <= width <= 991)":"3"},{"(576 <= width <= 767)":"2"},{"(width <= 575)":"1"}]'
        scroll-slider-distance="display" 
  `></multi-display-slider>`
</pre> <br ><br ><br >