import Component from "../classes/Components";

export default class Animation extends Component {
  constructor({ element, elements }) {
    super({ element, elements });

    this.createObserver();

    this.animateOut();
  }

  createObserver() {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("animatein");
          this.animateIn();
        } else {
          console.log("animateout");
          this.animateOut();
        }
      });
    });

    this.observer.observe(this.element);
  }
}
