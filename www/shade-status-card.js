//https://developers.home-assistant.io/docs/en/lovelace_custom_card.html

//You can use Polymer, Angular, Preact or any other popular framework

import { LitElement, html, css } from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class ShadeStatusCard extends LitElement {
  static get properties() {
    return {
      _hass: {},
      config: {},
      entity: {},
      stateString: String,
      name: String,
    };
  }

  set hass(hass) {
    if (!hass) return;
    const entity = this.config.entity;
    const name = this.config.name;
    const entityState = hass.states[entity];
    const stateString = entityState ? entityState.state : 'unavailable';
    this._hass = hass;
    if (stateString && this.stateString !== stateString) {
      this.stateString = stateString;
    }
    if (entity && this.entity !== entity) {
      this.entity = entity;
    }
    if (name && this.name !== name) {
      this.name = name;
    }
  }

  get hass() {
    return this._hass;
  }

  render() {
    return html`
      <style>
        .icon-button {
          background: none;
          border  : 1px transparent;
          cursor  : pointer;
        }
      </style>
      <div class="shade-status-card-container">
        <ha-card style="padding: 15px;">
          <div style="text-align: center;">
            ${this.stateString === 'Open' ? html`<ha-icon icon="mdi:blinds-open" />` : html`<ha-icon icon="mdi:blinds" />`}
          </div>
          <div style="text-align: center; font-weight: bold; padding-top: 5px;">
            ${this.stateString}
          </div>
          <div style="text-align: center; padding-top: 10px;">
            ${this.name}
          </div>
          <div style="text-align: center; padding-top:10px;">
            <button class="icon-button" id="container-down-arrow-${this.entity}"
               @click="${ev => this._singleShadeDown(this.entity)}" 
               @ha-hold="${ev => this._allShadesDown()}"
            >
              <ha-icon style="color: white;" id="down-arrow-${this.entity}" icon="mdi:arrow-down-bold" />
            </button>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <button class="icon-button" id="container-up-arrow-${this.entity}"
               @click="${ev => this._singleShadeUp(this.entity)}" 
               @ha-hold="${ev => this._allShadesUp()}"
            >
              <ha-icon style="color: white;" id="up-arrow-${this.entity}" icon="mdi:arrow-up-bold" />
            </button>
          </div>
        </ha-card>
      
      </div>
    `;
  }

  _singleShadeUp(entityId) {
    let eventCall = "";
    if (entityId === "sensor.kitchen_shade_position"){
      eventCall = "kitchen_blind_up_request";
    } else {
      eventCall = "main_blind_up_request";
    }

    this.hass.callService("ifttt", "trigger", {
      "event": eventCall
    });
    this.hass.callService("input_boolean", "turn_on", {
      "entity_id": "input_boolean.blind_override"
    });
  }

  _singleShadeDown(entityId) {
    let eventCall = "";
    if (entityId === "sensor.kitchen_shade_position") {
      eventCall = "kitchen_blind_down_request";
    } else {
      eventCall = "main_blind_down_request";
    }

    this.hass.callService("ifttt", "trigger", {
      "event": eventCall
    });
    this.hass.callService("input_boolean", "turn_on", {
      "entity_id": "input_boolean.blind_override"
    });
  }

  _allShadesUp() {
    this.hass.callService("ifttt", "trigger", {
      "event": "all_blinds_up_request"
    });
    this.hass.callService("input_boolean", "turn_on", {
      "entity_id": "input_boolean.blind_override"
    });
  }

  _allShadesDown() {
    this.hass.callService("ifttt", "trigger", {
      "event": "all_blinds_down_request"
    });
    this.hass.callService("input_boolean", "turn_on", {
      "entity_id": "input_boolean.blind_override"
    });
  }

  getCardSize() {
    return 2;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }
}

customElements.define('shade-status-card', ShadeStatusCard);