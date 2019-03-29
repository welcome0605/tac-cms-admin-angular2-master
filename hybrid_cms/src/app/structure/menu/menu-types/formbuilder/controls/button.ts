/**
 * Button class
 * Output a <button>Label</button> form element
 */

import {control} from "../control";

export default class controlButton extends control {

  static get definition() : any {
    return {
      // mi18n custom mappings (defaults to camelCase type)
      mi18n: {
        button: 'Button'
      },
    };
  }

  /**
   * build a text DOM element, supporting other jquery text form-control's
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    return {
      field: super.markup('button', this.label, this.config),
      layout: 'noLabel'
    };
  }
}

// register the following controls
control.register('button', controlButton);
control.register(['button', 'submit', 'reset'], controlButton, 'button');
