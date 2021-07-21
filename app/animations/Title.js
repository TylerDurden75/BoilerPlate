import gsap from "gsap";
import Animation from "classes/Animation";
import { calculate, split } from "utils/text";

import each from "lodash/each";

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });

    split({ element: this.element, append: true });
    split({ element: this.element, append: true });

    this.elementLinesSpans = this.element.querySelectorAll("span span");
  }

  animateIn() {
    this.timeLineIn = gsap.timeline({
      delay: 0.5,
    });

    this.timeLineIn.set(this.element, {
      autoAlpha: 1,
    });

    each(this.elementsLines, (line, index) => {
      this.timeLineIn.fromTo(
        line,
        {
          y: "100%",
        },
        {
          delay: index * 0.2,
          duration: 1.5,
          ease: "expo.out",
          y: "0%",
        },
        0
      );
    });
  }

  animateOut() {
    gsap.set(this.element, {
      autoAlpha: 0,
    });
  }

  onResize() {
    this.elementsLines = calculate(this.elementLinesSpans);
  }
}
