import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
    messagefromparent='';
    handleChange(event){
       this.messagefromparent = event.target.value;

    }
}