import './../ux/reef-slider.js';
import './../../../bower_components/time-picker/dist/time-picker.js';
/**
 * @extends HTMLElement
 */
class ProfilesView extends HTMLElement {
  /**
   * Creates shadowRoot
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
          justify-content: center;
          background-color: var(--reef-primary-background-color);
        }
      </style>

      <reef-grid>
        <style>
          .btn {
            border: 1px solid #0097A7;
            border-radius: 3px;
            background-color: transparent;
          }
        </style>

        <div class="grid-item">
        <h1 style="font-size:24px;">Profiles - Standard Profile 1</h1>
          <p>Time: (per profile)</p>
          <time-picker opened></time-picker>
          <input type="checkbox" name="time" value="Oldtime">Use old start time.
          <span>(-- disable clock pick --)</span>
          <p>-- listbox or dropdown list #profiles --</p>
          <p>Fading:</p>
            <span>UV:</span>
            <reef-slider></reef-slider>
            <span>Sunrise:</span>
            <reef-slider></reef-slider>
            <button class="btn" type="submit" name="submit">Submit</button>
        </div>
        <div class="grid-item">
          <p>-- overall lamp brightness #extra --</p>
          <p>-- duration sunlight (max = 6 hours) #extra --</p>
          <br><br>
          <p>-- Enable: super user settings (not recommended) #extra --</p>
          <ul>
            <li>UV: set duration (no max)</li>
            <li>Sunlight: set duration (no max)</li>
          </ul>
          <p>-- Some profile settings can be placed in settings --</p>
        </div>
      </reef-grid>
    `;
  }
}
customElements.define('profiles-view', ProfilesView);
