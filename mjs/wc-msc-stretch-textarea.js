import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

/*
 * Reference:
 * The Cleanest Trick for Autogrowing Textareas
 * https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
 */

const defaults = {
  name: '',
  value: '',
  maxLength: -1,
  placeholder: '',
  pattern: '',
  disabled: false,
  readOnly: false,
  required: false
};
const booleanAttrs = ['disabled', 'readOnly', 'required'];
const custumEvents = {
  input: 'msc-stretch-textarea-input',
  invalid: 'msc-stretch-textarea-invalid'
};
const attrMappings = {
  maxLength: 'maxlength',
  readOnly: 'readonly'
};
const propMappings = Object.keys(attrMappings).reduce(
  (acc, prop) => {
    const attr = attrMappings[prop];
    acc[attr] = prop;
    return acc;
  }
, {});

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host{position:relative;display:block;}
:host {
  /* textarea basic font setting */
  --msc-stretch-textarea-font-size: 16px;
  --msc-stretch-textarea-font-weight: 400;
  --msc-stretch-textarea-color: #000;
  --msc-stretch-textarea-line-height: 1;
  --msc-stretch-textarea-letter-spacing: normal;

  /* textarea > placeholder font setting */
  --msc-stretch-textarea-placeholder-font-size: var(--msc-stretch-textarea-font-size);
  --msc-stretch-textarea-placeholder-font-weight: var(--msc-stretch-textarea-font-weight);
  --msc-stretch-textarea-placeholder-color: currentColor;
  --msc-stretch-textarea-placeholder-line-height: var(--msc-stretch-textarea-line-height);

  /* textarea others setting */
  --msc-stretch-textarea-background: transparent;
  --msc-stretch-textarea-min-block-size: 0;
  --msc-stretch-textarea-padding: .5em;
  --msc-stretch-textarea-margin: 0;
  --msc-stretch-textarea-box-sizing: border-box;
  --msc-stretch-textarea-border: 0 none;
  --msc-stretch-textarea-border-radius: 0;
  --msc-stretch-textarea-box-shadow: none;
  --msc-stretch-textarea-transition: initial;
  --msc-stretch-textarea-caret-color: var(--msc-stretch-textarea-color);
  --msc-stretch-textarea-accent-color: auto;
  --msc-stretch-textarea-selection-color: initial;
  --msc-stretch-textarea-selection-background: initial;
}

.main{display:grid;}
.main::after,
.main__textarea{
  font-family: inherit;
  font-size: var(--msc-stretch-textarea-font-size);
  font-weight: var(--msc-stretch-textarea-font-weight);
  color: var(--msc-stretch-textarea-color);
  line-height: var(--msc-stretch-textarea-line-height);
  letter-spacing: var(--msc-stretch-textarea-letter-spacing);
  background: var(--msc-stretch-textarea-background);
  caret-color: var(--msc-stretch-textarea-caret-color);
  min-block-size: var(--msc-stretch-textarea-min-block-size);
  padding: var(--msc-stretch-textarea-padding);
  margin: var(--msc-stretch-textarea-margin);
  box-sizing: var(--msc-stretch-textarea-box-sizing);
  border: var(--msc-stretch-textarea-border);
  border-radius: var(--msc-stretch-textarea-border-radius);
  box-shadow: var(--msc-stretch-textarea-box-shadow);
  transition: var(--msc-stretch-textarea-transition);
  grid-area: 1/1/2/2;

  -webkit-appearance: none;
  white-space: pre-wrap;
  word-break: break-all;
  hyphens: auto;
  -webkit-hyphens: auto;
}
.main__textarea{resize:none;overflow:hidden;}
.main__textarea::selection{color:var(--msc-stretch-textarea-selection-color);background:var(--msc-stretch-textarea-selection-background);}
.main__textarea:focus{outline:0 none;}
.main__textarea::-webkit-input-placeholder {
  font-size: var(--msc-stretch-textarea-placeholder-font-size);
  font-weight: var(--msc-stretch-textarea-placeholder-font-weight);
  color: var(--msc-stretch-textarea-placeholder-color);
  line-height: var(--msc-stretch-textarea-placeholder-line-height);
}
.main__textarea::-moz-input-placeholder {
  font-size: var(--msc-stretch-textarea-placeholder-font-size);
  font-weight: var(--msc-stretch-textarea-placeholder-font-weight);
  color: var(--msc-stretch-textarea-placeholder-color);
  line-height: var(--msc-stretch-textarea-placeholder-line-height);
}
.main::after{content:attr(data-replicated-value) " ";visibility:hidden;pointer-events:none;}
</style>

<div class="main" data-replicated-value>
  <textarea class="main__textarea"></textarea>
</div>
`;

export class MscStretchTextarea extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      main: this.shadowRoot.querySelector('.main'),
      textarea: this.shadowRoot.querySelector('.main__textarea'),
      textareaInLightDOM: ''
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscStretchTextarea(config)
    };

    // evts
    this._onInput = this._onInput.bind(this);
    this._onInvalid = this._onInvalid.bind(this);
  }

  async connectedCallback() {
    const { textarea } = this.#nodes;
    const { config, error } = await _wcl.getWCConfig(this);

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // textarea in lightDOM
    if (this.querySelector('textarea')) {
      const config = {};
      const textarea = this.querySelector('textarea');
      this.#nodes.textareaInLightDOM = textarea;

      Object.keys(defaults).forEach(
        (prop) => {
          if (booleanAttrs.includes(prop)) {
            config[prop] = textarea.hasAttribute(attrMappings[prop] || prop);
          } else {
            config[prop] = textarea[prop] || defaults[prop];
          }
        }
      );
      this.#config = {
        ...this.#config,
        ...config
      };
    } else {
      const textarea = document.createElement('textarea');
      this.#nodes.textareaInLightDOM = textarea;
      this.appendChild(textarea);

      Object.keys(defaults).forEach(
        (prop) => {
          const defaultValue = defaults[prop];
          if (!defaultValue) {
            return;
          }
          
          if (prop !== 'value') {
            // value should set by prop
            const value = booleanAttrs.includes(prop) ? '' : defaultValue;
            textarea.setAttribute(attrMappings[prop] || prop, value);
          }
        }
      );
      
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this._upgradeProperty(key));

    // value
    this._setValue(this.value);

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    textarea.addEventListener('input', this._onInput, { signal });
    textarea.addEventListener('invalid', this._onInvalid, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  _format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;
    const prop = propMappings[attrName] || attrName;

    if (!hasValue) {
      if (booleanAttrs.includes(prop)) {
        this.#config[prop] = false;
      } else {
        this.#config[prop] = defaults[prop];
      }
    } else {
      switch (attrName) {
        case 'maxlength':
          if (_wcl.isNumeric(newValue)) {
            this.#config[prop] = parseFloat(newValue);
          }
          break;
        case 'name':
        case 'placeholder':
        case 'pattern':
          this.#config[prop] = newValue;
          break;
        case 'disabled':
        case 'required':
        case 'readonly':
          this.#config[prop] = true;
          break;
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    const { textarea, textareaInLightDOM } = this.#nodes;
    const prop = propMappings[attrName] || attrName;

    if (!MscStretchTextarea.observedAttributes.includes(attrName)) {
      return;
    }

    this._format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'name':
      case 'placeholder':
      case 'maxlength':
      case 'pattern': {
        if (this.#config[prop]) {
          if (textareaInLightDOM) {
            textareaInLightDOM.setAttribute(attrName, this.#config[prop]);
          }
          textarea.setAttribute(attrName, this.#config[prop]);
        } else {
          if (textareaInLightDOM) {
            textareaInLightDOM.removeAttribute(attrName);
          }
          textarea.removeAttribute(attrName);
        }
        break;
      }
      case 'disabled':
      case 'readonly':
      case 'required':
        if (this.#config[prop]) {
          if (textareaInLightDOM) {
            textareaInLightDOM.setAttribute(attrName, '');
          }
          textarea.setAttribute(attrName, '');
        } else {
          if (textareaInLightDOM) {
            textareaInLightDOM.removeAttribute(attrName);
          }
          textarea.removeAttribute(attrName);
        }
        break;
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults)
      .filter((key) => !['value'].includes(key))
      .map(
        (prop) => {
          return attrMappings[prop] || prop;
        }
      );
  }

  _upgradeProperty(prop) {
    let value;
    const attr = attrMappings[prop] || prop;

    if (MscStretchTextarea.observedAttributes.includes(attr)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(attr) || this.#config[prop]) ? true : false;
        } else {
          value = this.hasAttribute(attr) ? this.getAttribute(attr) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set name(value) {
    if (value) {
      this.setAttribute('name', value);
    } else {
      this.removeAttribute('name');
    }
  }

  get name() {
    return this.#config.name;
  }

  set value(value) {
    this._setValue(this.#nodes.textarea.value);
  }

  get value() {
    return this.#config.value;
  }

  set maxLength(value) {
    if (value) {
      this.setAttribute('maxlength', value);
    } else {
      this.removeAttribute('maxlength');
    }
  }

  get maxLength() {
    return this.#config.maxLength;
  }

  set placeholder(value) {
    if (value) {
      this.setAttribute('placeholder', value);
    } else {
      this.removeAttribute('placeholder');
    }
  }

  get placeholder() {
    return this.#config.placeholder;
  }

  set pattern(value) {
    if (value) {
      this.setAttribute('pattern', value);
    } else {
      this.removeAttribute('pattern');
    }
  }

  get pattern() {
    return this.#config.pattern;
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get disabled() {
    return this.#config.disabled;
  }

  set readOnly(value) {
    if (value) {
      this.setAttribute('readonly', '');
    } else {
      this.removeAttribute('readonly');
    }
  }

  get readOnly() {
    return this.#config.readOnly;
  }

  set required(value) {
    if (value) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }

  get required() {
    return this.#config.required;
  }

  _fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  _setValue(value, updateTextareaInShadowDOM = true) {
    const { main, textareaInLightDOM, textarea } = this.#nodes;

    this.#config.value = value;
    main.dataset.replicatedValue = value;
    textareaInLightDOM.value = value;
    if (updateTextareaInShadowDOM) {
      textarea.value = value;
    }

    this.dataset.contentLength = value.length;
  }

  _onInput() {
    this._setValue(this.#nodes.textarea.value, false);

    // custom event
    this._fireEvent(custumEvents.input);
  }

  _onInvalid(evt) {
    const detail = {
      baseEvent: evt // original invalid event
    };

    // custom event
    this._fireEvent(custumEvents.invalid, detail);
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscStretchTextarea');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(T, MscStretchTextarea);
}