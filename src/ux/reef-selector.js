/**
 * @extends HTMLElement
 */
Backed(class ReefSelector extends HTMLElement {
  /**
   * Attributes to observer
   * @return {Array} ['selected']
   */
   static get observedAttributes() {
     return ['selected'];
   }

	created() {
		this.root = this.attachShadow({mode: 'open'});
    this.root.innerHTML = '<slot></slot>';
		this._onClick = this._onClick.bind(this);
	}

   /**
    * Stamps innerHTML & add's eventListeners
    */
   connected() {
     this.addEventListener('click', this._onClick);
   }

   /**
    * Runs whenever attribute changes are detected
    * @param {string} name The name of the attribute that changed.
    * @param {string|object|array} oldValue
    * @param {string|object|array} newValue
    */
   attributeChangedCallback(name, oldValue, newValue) {
     if (oldVal !== newVal) {
       this[name] = newVal;
     }
   }

   /**
    * @return {String}
    */
   get attrForSelected() {
     return this.getAttribute('attr-for-selected');
   }

   /**
    * @return {Boolean}
    */
   get hasAttrForSelected() {
     return this.hasAttribute('attr-for-selected');
   }

   /**
    * @return {String|Number|HTMLElement}
    */
   get selected() {
     return this.getAttribute('selected') || 0;
   }

   /**
    * @param {String|Number|HTMLElement} value
    */
   set selected(value) {
     this.setAttribute('selected', value);
     this._updateSelected(value);
   }

   /**
    * @param {Object} event
    */
   _onClick(event) {
     this.selected = event.target;
   }

   /**
    * @param {String|Number|HTMLElement} selected
    */
   _updateSelected(selected) {
     if (typeof selected === 'object') {
       if (this.previousSelected !== undefined) {
         this.previousSelected.classList.remove('reef-selected');
       }
       this.previousSelected = selected;
       selected.classList.add('reef-selected');
     } else {
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i];
				if (child.getAttribute(this.attrForSelected) === selected) {
					child.classList.add('reef-selected');
				} else {
					child.classList.remove('reef-selected');
				};
			}
		}
  }
});
