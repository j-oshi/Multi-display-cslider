import { 
  evaluteComparisonExpression 
} from "./comparison-operator-string-evaluator.js";

export class MultiDisplaySlider extends HTMLElement {
  constructor() {
    super();
    this.state = {
      slidesPerDisplay: this.getAttribute('slides-per-display') || 1,
      slidesPerDisplayStep: this.getAttribute('slides-per-display-step') || 1,
      slidesPerDisplayBreakpoint: this.getAttribute('slides-per-display-breakpoints') || 1,
      scrollSliderBy: this.getAttribute('scroll-slider-distance') || 'display'      
    }
    this.addStyleToHost();
    this.render();
    this.init = this.init.bind(this);
    this.debounce = this.debounce.bind(this);
    this.hideControlOnMinMax = this.hideControlOnMinMax.bind(this);
  }

  connectedCallback() {
    this.init();
    this.resize();
  }

  addStyleToHost() {
    let style = null, shadowRoot = null;
    style = document.createElement('style');
    shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(style);
    style.textContent = `
      :host { 
        position: relative;
        display: block;
        width: 100%;
        overflow: hidden; 
      }`;
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        .slide-display {
          overflow: hidden;
        }
    
        .slide-wrapper {
          display: flex;
          overflow-x: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
            
          /*
            scroll-snap-points-x: repeat(300px);
            scroll-snap-type: mandatory;
          */
        }
      
        .slide-wrapper::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        
        .slide-wrapper::-webkit-scrollbar-thumb {
            background: black;
            border-radius: 10px;
        }
    
        .slide-wrapper::-webkit-scrollbar-track {
            background: transparent;
        }

        .next {
          float: right;
        }
        .prev {
          float: left;
        }
        .next,
        .prev {
          position: relative;
          padding: 5px;
          background: #000;
          height: 30px;
          width: 30px;
          border-radius: 50%;
          transition: all 0.2s linear;
        }
        
        .next:hover,
        .prev:hover {
          background: #fff;
        }

        .next:hover::after,
        .prev:hover::after {
          border-top: 2px solid #000;
          border-left: 2px solid #000;
        }
        
        .next::after,
        .prev::after {
          content: "";
          position: relative;
          margin: 5px auto;
          z-index: 11;
          display: block;
          width: 15px;
          height: 15px;
          border-top: 2px solid #fff;
          border-left: 2px solid #fff;
        }

        .next::after {
          transform: rotate(135deg);
        }
        
        .prev::after {
          transform: rotate(-45deg);
        }

        .control {
          position: absolute;
          top: 50%;
          width:100%;
          transform: translateY(-50%);
          z-index: 999;
        }
      </style>

      <div class="slide-display">
        <div class="slide-wrapper"> 
          <slot></slot>
        </div>
        <div class="control">
          <div id="button-left" class='arrow prev'></div>
          <div id="button-right" class='arrow next'></div>
        </div>
      </div>`;
    this.shadowRoot.appendChild(template.content);
  }

  init() {
    this.scrollSlide();
  }

  resize() {
    window.addEventListener("resize", () => {
      this.debounce(this.init(), 1200);
    });    
  }

  scrollSlide() {
    let sliderWrapper = null, sliderDisplay = null, sliderControl = null, slidesToShow = null, slot = null, nodes = null, slidesWidth = null, breakpoint = null, numPerScroll = null;
    sliderDisplay = this.shadowRoot.querySelector('.slide-display');
    sliderWrapper = this.shadowRoot.querySelector('.slide-wrapper');
    sliderControl = this.shadowRoot.querySelector('.control');
    breakpoint = this.displayBreakpointSlides(sliderDisplay.scrollWidth, this.state.slidesPerDisplayBreakpoint);
    slidesToShow = Boolean(this.state.slidesPerDisplayBreakpoint) ? breakpoint : this.state.slidesPerDisplay; 
    numPerScroll = (breakpoint < this.state.slidesPerDisplayStep) ? breakpoint : this.state.slidesPerDisplayStep;
    slidesWidth = this.calculateSlideNewWidth(sliderDisplay, slidesToShow);

    this.hideControlOnMinMax(sliderWrapper, sliderControl)

    slot = this.shadowRoot.querySelector('slot');
    nodes = slot.assignedElements();

    if (nodes.length > 0) {
      nodes.forEach(node => {
        node.setAttribute("style", `width: ${slidesWidth}px; scroll-snap-align: start; flex-shrink: 0;`);
      })
    }

    this.leftClick(this.state.scrollSliderBy, sliderWrapper, slidesWidth, sliderDisplay.scrollWidth, numPerScroll, sliderControl);
    this.rightClick(this.state.scrollSliderBy, sliderWrapper, slidesWidth, sliderDisplay.scrollWidth, numPerScroll, sliderControl);
    this.scrollByKeyboard(this.state.scrollSliderBy, sliderWrapper, slidesWidth, sliderDisplay.scrollWidth, numPerScroll, sliderControl);
  }

  displayBreakpointSlides(slidewidth, breakpoint) {
    let breakpointArray = null;
    breakpointArray = JSON.parse(breakpoint);

    for (let bp in breakpointArray) {
      let bp_obj = null, bp_key = null, bp_value = null;
      bp_obj = breakpointArray[bp];
      bp_key = JSON.stringify(Object.keys(bp_obj)).replace(/[\])}[{("']/g, '');
      bp_value = Object.values(bp_obj);
 
      if (evaluteComparisonExpression(bp_key, slidewidth)) {
        return bp_value[0];
      }
    }  
    return 1;
  }

  debounce(callback, delay) {
    let timeout = null;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(callback, delay);
    }
  }

  calculateSlideNewWidth(displayWidth, numberOfSlidesPerDisplay) {
    return displayWidth.scrollWidth / numberOfSlidesPerDisplay;
  }

  scrollSlider(scrollBy, scrollContainer, slideWidth, displayWidth, slideStep, sliderControl) {
    switch (scrollBy) {
      case 'slide':
        scrollContainer.scrollLeft += slideStep * slideWidth;
        break;
      case 'display':
        scrollContainer.scrollLeft += displayWidth;
        break;
    }

    scrollContainer.addEventListener('scroll', () => {
      this.hideControlOnMinMax(scrollContainer, sliderControl);
    });
  }

  leftClick(scrollType, sliderWrapper, slidesWidth, displayWidth, scrollStep, sliderControl) {
    this.shadowRoot.querySelector('#button-left').onclick = () => {
      this.scrollSlider(scrollType, sliderWrapper, -slidesWidth, -displayWidth, scrollStep, sliderControl);
    }
  }

  rightClick(scrollType, sliderWrapper, slidesWidth, displayWidth, scrollStep, sliderControl) {
    this.shadowRoot.querySelector('#button-right').onclick = () => {
      this.scrollSlider(scrollType, sliderWrapper, slidesWidth, displayWidth, scrollStep, sliderControl);
    }
  }

  scrollByKeyboard(scrollType, sliderWrapper, slidesWidth, displayWidth, scrollStep, sliderControl) {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.scrollSlider(scrollType, sliderWrapper, -slidesWidth, -displayWidth, scrollStep, sliderControl);
          break;
        case 'ArrowRight':    
          this.scrollSlider(scrollType, sliderWrapper, slidesWidth, displayWidth, scrollStep, sliderControl);
          break;
      }
    });  
  }

  hideControlOnMinMax(scrollObj, sliderControl) {
    let left = null, right = null;
    left = sliderControl.querySelector('#button-left');
    right = sliderControl.querySelector('#button-right');

    if (scrollObj.scrollLeft == 0) {
      left.setAttribute('style', 'display:none;');
    } else {
      left.removeAttribute('style', 'display:none;');
    }

    if ((scrollObj.scrollLeft + scrollObj.offsetWidth) >= scrollObj.scrollWidth) {
      right.setAttribute('style', 'display:none;');
    } else {
      right.removeAttribute('style', 'display:none;');
    }
  }
}

customElements.define('multi-display-slider', MultiDisplaySlider);
