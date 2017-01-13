"use strict";
customElements.define("distill-select-stepper", class extends HTMLElement {
  constructor() {
    super();
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
        }
      </style>
      <slot></slot>
    `;
    this.imageSlot = shadowRoot.querySelector("slot");
    this.imageSlot.addEventListener("slotchange", () => this.updateSlot());
  }

  connectedCallback() {
    this.updateSlot();
  }

  updateSlot() {
    this.slides = this.imageSlot.assignedNodes().filter((d) => d.nodeType === 1);
    this.value = this.getAttribute("value") ? this.getAttribute("value") : 0;
  }

  static get observedAttributes() {
    return ["labels", "value"];
  }

  set labels(val) {
    this.setAttribute("length", val);
  }
  get length() {
    return +this.getAttribute("length");
  }

  // Current displayed image value
  set value(val) {
    if (val < 0 || val > this.slides.length - 1) {
      throw new Error("Given value for distill-deck element is too big or too small given the number of children.");
    } else {
      this.setAttribute("value", val);
      this.slides.forEach((el) => {
        el.style.top = 0;
        el.style.left = 0;
        el.style.position = "absolute";
        el.style.zIndex = 0;
        el.style.opacity = 0;
        el.style.transition = "opacity 0.3s";
      });
      this.slides[val].style.position = "relative";
      this.slides[val].style.zIndex = this.slides.length;
      this.slides[val].style.opacity = 1;
    }
  }
  get value() {
    return +this.getAttribute("value");
  }
});
