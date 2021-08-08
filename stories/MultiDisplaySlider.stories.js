import '../multi-display-slider';

export default {
    title: 'Components/Multi Display Slider',
};
  
const Template = () => `<multi-display-slider
                            slides-per-display=2
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
                        </multi-display-slider>`; 
  
export const MultiDisplaySlider = Template.bind({});
MultiDisplaySlider.args = {};
  