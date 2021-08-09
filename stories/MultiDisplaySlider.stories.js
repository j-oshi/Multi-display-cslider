import '../multi-display-slider';

export default {
    title: 'Components/Multi Display Slider',
};
  
const Template = () => `<multi-display-slider
                            slides-per-display=2
                            slides-per-display-step=1
                            slides-per-display-breakpoints='[{"(width >= 1200)":"5"},{"(992 <= width <= 1199)":"3"},{"(768  <= width <= 991)":"2"},{"(576 <= width <= 767)":"2"},{"(width <= 575)":"1"}]'
                            scroll-slider-distance="slide"
                        >
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                            <div class="slide-item"></div>
                        </multi-display-slider>`; 
  
export const MultiDisplaySlider = Template.bind({});
MultiDisplaySlider.args = {};
