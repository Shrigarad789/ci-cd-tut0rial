import { LightningElement } from 'lwc';

export default class PtcExample extends LightningElement {
    messageSendFromParent='';
    HandleClick(event){
        this.messageSendFromParent=event.target.value;

    }
}