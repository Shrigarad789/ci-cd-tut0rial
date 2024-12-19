import { LightningElement } from 'lwc';

export default class LifecycleHooksChildComp2 extends LightningElement {
    constructor() {
        super();
        console.log('constructor invoked of child2 ');
    }

    connectedCallback() {
        console.log('connectedCallback invoked of child2');
    }

    renderedCallback() {
        console.log('renderedCallback invoked of child2');
    }
    disconnectedCallback() {

        console.log('disconnectedCallback invoked of child2');
    }
    errorCallback() {
console.log('disconnectedCallback invoked of child2');
    
    }
}