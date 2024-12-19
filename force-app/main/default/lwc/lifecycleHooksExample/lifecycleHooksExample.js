import { LightningElement } from 'lwc';

export default class LifecycleHooksExample extends LightningElement {
    constructor() {
        super();
        console.log('Parent constructor invoked');
    }

    connectedCallback() {
        console.log('Parent connectedCallback invoked');
    }

    renderedCallback() {
        console.log('Parent renderedCallback invoked');
    }
    errorCallback() {
        console.log('errorCallback invoked of child');
    
    }
}
