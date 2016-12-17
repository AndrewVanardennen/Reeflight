/**
 * SettingsView
 * @extends HTMLElement
 */
class SettingsView extends HTMLElement {
  /**
   * Create shadowRoot (root) & stamp template
   */
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
  }

  /**
   * Stamps innerHTML
   */
  connectedCallback() {
    this.root.innerHTML = `
      <style>
        :host {
          display: flex;
          height: 100%;
          // align-items: center;
          justify-content: center;
          background-color: var(--reef-primary-background-color);
        }
      </style>
      <reef-grid class="grid">
        <div class="grid-item">
          <p>-- Manual globalclock setting --</p>
          <p>-- Startclock setting without user profile changes --</p>
        </div>
        <div class="grid-item">
          <p>-- logbook errors, start, stop,... #extra --</p>
        </div>
        <div class="grid-item">
          <p>
            -- Gradual time shifter (less degrading coral growth)  #extra --
          </p>
          <p>-- SU: tweak frequency of leds #extra --</p>
        </div>
        <div class="grid-item">
          <p>-- cloud settings (may go to profile settings) --</p>
          <p>-- lightning settings (may go to profile settings) --</p>
          <p>-- Season simulation #extra --</p>
          <p>-- Matched weather settings outside/inside #extra --</p>
          <p>-- Mooncycle settings (may go to profile settings) --</p>
        </div>
        <div class="grid-item">
          <p>
            <input
            type="checkbox"
            name="phoneWifi"
            value="wified"
            title="
            Enable sunlight only when smartphone is connected to wifi.">
            Out of the house mode.
          </p>
          <p>
            <input
              type="checkbox"
              name="phoneBT"
              value="bted"
              title="
              Enable sunlight only when smartphone is connected to Bluetooth">
              Out of the room mode.
          </p>
        </div>
      </reef-grid>
    `;
  }
}
customElements.define('settings-view', SettingsView);
