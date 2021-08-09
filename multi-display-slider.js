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
    window.addEventListener("resize", function() {
      console.log('this is test');
    });
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        .slider {
          overflow: hidden;
        }
    
        .slides {
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
      
        .slides::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        
        .slides::-webkit-scrollbar-thumb {
            background: black;
            border-radius: 10px;
        }
    
        .slides::-webkit-scrollbar-track {
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

      <div class="slider">
        <div class="slides"> 
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
    let sliderWrapper = null, slideDisplay = null, leftControl = null, rightControl = null, slidesToShow;
    sliderWrapper = this.shadowRoot.querySelector('.slider');
    slideDisplay = this.shadowRoot.querySelector('.slides');

    let slot = null, nodes = null, slidesWidth = null;
    slidesToShow = Boolean(this.slidesPerDisplayBreakpoint) ? this.displayBreakpointSlides(sliderWrapper.scrollWidth) : this.slidesPerDisplay;
    slidesWidth = this.calculateSlideNewWidth(sliderWrapper, slidesToShow);

    slot = this.shadowRoot.querySelector('slot');
    nodes = slot.assignedElements();

    if (nodes.length > 0) {
      nodes.forEach(node => {
        console.log(node);
        node.setAttribute("style", `width: ${slidesWidth}px`);
      })
    }

    let root = this;

    this.shadowRoot.querySelector('#button-left').onclick = () => {
      root.scrollSlider(root.scrollSliderBy, slideDisplay, -slidesWidth, -sliderWrapper.scrollWidth, this.slidesPerDisplayStep)
    };
    this.shadowRoot.querySelector('#button-right').onclick = () => {
      root.scrollSlider(root.scrollSliderBy, slideDisplay, slidesWidth, sliderWrapper.scrollWidth, this.slidesPerDisplayStep)
    };
  }

  displayBreakpointSlides(width) {
    let breakpoint = null, breakpointArray = null;
    breakpoint = this.slidesPerDisplayBreakpoint;
    breakpointArray = JSON.parse(breakpoint);
    for (let i in breakpointArray) {
      let obj = null, obj_key = null, obj_value = null;
      obj = breakpointArray[i];
      obj_key = JSON.stringify(Object.keys(obj)).replace(/[\])}[{("']/g, '');
      obj_value = Object.values(obj);
 
      if (evaluteComparisonExpression(obj_key, width)) {
        return obj_value[0];
      }
    }  
    return 1;
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