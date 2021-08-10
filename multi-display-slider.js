import { 
  evaluteComparisonExpression 
} from "./comparison-operator-string-evaluator.js";

export class MultiDisplaySlider extends HTMLElement {
  constructor() {
    super();

    const style = document.createElement('style');
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(style);
    style.textContent = `
      :host { 
        position: relative;
        display: block;
        width: 100%;
        overflow: hidden; 
      }
    `;

    this.slidesPerDisplay = this.getAttribute('slides-per-display') || 1;
    this.slidesPerDisplayStep = this.getAttribute('slides-per-display-step') || 1;
    this.slidesPerDisplayBreakpoint = this.getAttribute('slides-per-display-breakpoints') || 1;
    this.scrollSliderBy = this.getAttribute('scroll-slider-distance') || 'display';
  }

  connectedCallback() {
    this.render();
    this.init();
    this.resize();
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
    let root = this;
    window.addEventListener("resize", function() {
      root.debounce(root.init(), 1200);
    });    
  }

  scrollSlide() {
    let sliderWrapper = null, sliderDisplay = null, slidesToShow = null, slot = null, nodes = null, slidesWidth = null, root = null;
    sliderDisplay = this.shadowRoot.querySelector('.slide-display');
    sliderWrapper = this.shadowRoot.querySelector('.slide-wrapper');
    slidesToShow = Boolean(this.slidesPerDisplayBreakpoint) ? this.displayBreakpointSlides(sliderDisplay.scrollWidth, this.slidesPerDisplayBreakpoint) : this.slidesPerDisplay;   
    slidesWidth = this.calculateSlideNewWidth(sliderDisplay, slidesToShow);

    slot = this.shadowRoot.querySelector('slot');
    nodes = slot.assignedElements();

    if (nodes.length > 0) {
      nodes.forEach(node => {
        node.setAttribute("style", `width: ${slidesWidth}px`);
      })
    }

    root = this;

    this.shadowRoot.querySelector('#button-left').onclick = () => {
      root.scrollSlider(root.scrollSliderBy, sliderWrapper, -slidesWidth, -sliderDisplay.scrollWidth, this.slidesPerDisplayStep);
    }
    this.shadowRoot.querySelector('#button-right').onclick = () => {
      root.scrollSlider(root.scrollSliderBy, sliderWrapper, slidesWidth, sliderDisplay.scrollWidth, this.slidesPerDisplayStep);
    }
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
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(callback, delay);
    }
  }

  calculateSlideNewWidth(displayWidth, numberOfSlidesPerDisplay) {
    return displayWidth.scrollWidth / numberOfSlidesPerDisplay;
  }

  scrollSlider(scrollBy, scrollContainer, slideWidth, displayWidth, slideStep) {
    switch (scrollBy) {
      case 'slide':
        scrollContainer.scrollLeft += slideStep * slideWidth;
        break;
      case 'display':
        scrollContainer.scrollLeft += displayWidth;
        break;
    }
  }
}

customElements.define('multi-display-slider', MultiDisplaySlider);