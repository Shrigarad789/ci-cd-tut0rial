import { LightningElement } from 'lwc';

export default class LifecycleHooksChildComp extends LightningElement {
    constructor() {
        super();
        console.log('constructor invoked of child ');
    }

    connectedCallback() {
        console.log('connectedCallback invoked of child');
    }

    renderedCallback() {
        console.log('renderedCallback invoked of child');
    }
    disconnectedCallback() {

        console.log('disconnectedCallback invoked of child');
    }
    errorCallback() {
console.log('disconnectedCallback invoked of child');
    
    }
}