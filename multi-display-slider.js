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

    this.slidesPerDisplay = this.getAttribute('slides-per-display');
    this.scrollSliderBy = this.getAttribute('scroll-slider-distance') || 'display';
  }

  connectedCallback() {
    this.render();
    this.init();
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

      .arrow {
        display: inline-block;
        font-size: 16px; /* adjust size */
        line-height: 1em; /* adjust vertical positioning */
        border: 3px solid #000000;
        border-left: transparent;
        border-bottom: transparent;
        width: 1em; /* use font-size to change overall size */
        height: 1em; /* use font-size to change overall size */
      }
    
      .arrow:before {
        content: \"00a0\"; /* needed to hook line-height to "something" */
      }
    
      .arrow.left {
        margin-left: 0.5em;
        -webkit-transform: rotate(225deg);
        -moz-transform: rotate(225deg);
        -o-transform: rotate(225deg);
        -ms-transform: rotate(225deg);
        transform: rotate(225deg);
      }
      
      .arrow.right {
        margin-right: 0.5em;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
      }
  
      .arrow.left:hover {
        border: 3px solid red;
      }
      
      .arrow.right:hover {
        border: 3px solid red;
      }
    </style>

    <div class="slider">
      <div class="slides"> 
        <slot></slot>
      </div>
      <div class="control" style="position: absolute;top: 50%;">
        <div id="button-left" class='arrow left'></div>
        <div id="button-right" class='arrow right'></div>
      </div>
    </div>`;
    this.shadowRoot.appendChild(template.content);
  }

  init() {
    let sliderWrapper = null, slideDisplay = null, leftControl = null, rightControl = null;
    sliderWrapper = this.shadowRoot.querySelector('.slider');
    slideDisplay = this.shadowRoot.querySelector('.slides');

    let slot = null, nodes = null, slidesWidth = null;
    slidesWidth = this.calculateSlideNewWidth(sliderWrapper, this.slidesPerDisplay);

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
      root.scrollSlider(root.scrollSliderBy, slideDisplay, -slidesWidth, -sliderWrapper.scrollWidth)
    };
    this.shadowRoot.querySelector('#button-right').onclick = () => {
      root.scrollSlider(root.scrollSliderBy, slideDisplay, slidesWidth, sliderWrapper.scrollWidth)
    };
  }

  calculateSlideNewWidth(displayWidth, numberOfSlidesPerDisplay) {
    return displayWidth.scrollWidth / numberOfSlidesPerDisplay;
  }

  scrollSlider(scrollBy, scrollContainer, slideWidth, displayWidth) {
    switch (scrollBy) {
      case 'slide':
        scrollContainer.scrollLeft += slideWidth;
        break;
      case 'display':
        scrollContainer.scrollLeft += displayWidth;
        break;
    }
  }
}

customElements.define('multi-display-slider', MultiDisplaySlider);