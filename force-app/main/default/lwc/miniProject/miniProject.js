import { LightningElement,wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';
import getEventAttendee from '@salesforce/apex/miniProjectController.getEventAttendee';
import createEventAttendee from '@salesforce/apex/miniProjectController.createEventAttendee';
export default class MiniProject extends LightningElement {
eventSelectedId;
availablelistOptions=[];
selectedlistOptions=[];
wiredEventAttendeeResult;
error;

@wire(getEventAttendee, { eventId: '$eventSelectedId' })
wiredEventAttendee(result) {
    console.log('result>>>>>>>>',result)
    this.wiredEventAttendeeResult=result;
    const {data,error}=result;
    console.log('resultdata>>>>>>>>',data)
    if (data) {
        this.availablelistOptions = data.map(item=>({
label :item.Name,
value :item.Id
        }));
                    
    } else if (error) {
        this.error=error;
    }
}







handleChange(event){
this.eventSelectedId=event.detail.recordId;
console.log('We got select recordId',this.eventSelectedId);
}
handleAttendee(event){
this.selectedlistOptions=event.detail.value;

}
handleSave(event){
    createEventAttendee({eventId:this.eventSelectedId,selectedAttendeeId:this.selectedlistOptions})
    .then(result=>{
        this.showToast('Success','Record save succussfully','success');
        return refreshApex(this.wiredEventAttendeeResult);

    })
    .catch(error=>{
        this.showToast('Error','Am errorRecord save succussfully','error');
    })
}
showToast(title,message,variant){
    const toastEvent=new ShowToastEvent({
        title:title,
        message:message,
        variant:variant
    });
    this.dispatchEvent(toastEvent);
}
}