import gsap from "gsap";

import each from "lodash/each";
import Prefix from "prefix";

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
    };

    this.id = id;

    this.transformPrefix = Prefix("transform");

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
    };

    this.onMouseWheelEvent = this.onMouseWheel.bind(this);

    console.log(this.transformPrefix);
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
    };

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key] === 0) {
          this.elements[key] = null;
        } else if (this.elements[key] === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });
  }

  show() {
    return new Promise((resolve) => {
      this.animationIn = gsap.timeline();

      this.animationIn.fromTo(
        this.element,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        }
      );

      this.animationIn.call((_) => {
        this.addEventListeners();
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.removeEventListeners();

      this.animationOut = gsap.timeline();

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  onMouseWheel(event) {
    const { deltaY } = event;

    this.scroll.target += deltaY;
  }

  update() {
    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1
    );

    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }
  }

  addEventListeners() {
    window.addEventListener("mousewheel", this.onMouseWheelEvent);
  }

  removeEventListeners() {
    window.removeEventListener("mousewheel", this.onMouseWheelEvent);
  }
}
