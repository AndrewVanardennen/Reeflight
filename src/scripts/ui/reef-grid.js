/**
 * @extends HTMLElement
 */
class ReefGrid extends HTMLElement {
  /**
   * Creates shadowRoot
   */
   constructor() {
     super();
     this.root = this.attachShadow({mode: 'open'});
   }

   /**
    * Set's up children & styles
    */
   connectedCallback() {
     this.root.innerHTML = `
      <style>
        :host {
          display: flex;
          --reef-view-padding: 0;
          --reef-view-background: none;
        }
        .grid {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 100%;
          height: 100%;
        }
        .grid-item {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                      0 1px 5px 0 rgba(0, 0, 0, 0.12),
                      0 3px 1px -2px rgba(0, 0, 0, 0.2);
          box-sizing: border-box;
          width: 100%;
          padding: 8px 16px;
          margin-bottom: 6px;
          background: #FFF;
        }
        @media (min-width: 1109px) {
          :host {
            --reef-view-container-direction: row;
          }
          .grid {
            flex-flow: row wrap;
          }
          .grid-item {
            width: calc(50% - 6px);
          }
          :host:last-child {
            width: calc(100% - 6px);
          }
        }
      </style>
      <reef-view no-shadow>
        <div class="grid"></div>
      </reef-view>
     `;
     // TODO: check for child changes
     let styles = this.querySelectorAll('style');
     for (let i = 0; i < styles.length; i++) {
       this.root.appendChild(styles[i]);
     }
     let childs = this.querySelectorAll('.grid-item');
     setTimeout(() => {
       for (let i = 0; i < childs.length; i++) {
         requestAnimationFrame(() => {
           this.root.querySelector('.grid').appendChild(childs[i]);
         });
       }
     }, 10);
   }
}
customElements.define('reef-grid', ReefGrid);
