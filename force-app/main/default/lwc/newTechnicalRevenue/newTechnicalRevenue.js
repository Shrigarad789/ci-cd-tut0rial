import { LightningElement , api, track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import saveTechnicalRevenue from '@salesforce/apex/technicalRevenueController.createTechnicalRevenue';
export default class NewTechnicalRevenue extends LightningElement {
    @api recordId;
    @track techRevenue = [];
    @track supplierOptions = []; 
    isLoading = false;
 
    connectedCallback() {
        // this.addNewClickHandler();
           this.techRevenue.push({
            tempId: this.techRevenue.length,
            Product_Part_Number__c: '',
            Additional_Comments__c: '',
            
        });
        
    }
       handlePPNumberChange(event) {
 
        console.log('dataId:::' + event.currentTarget.dataset.id)
        this.techRevenue[event.currentTarget.dataset.id].Product_Part_Number__c = event.detail.value;
 
        console.log('this.inputValues' + JSON.stringify(this.techRevenue))
    }
    handleCommentsChange(event) {
        console.log('dataId' + event.detail.value)
        this.techRevenue[event.currentTarget.dataset.id].Additional_Comments__c = event.detail.value;
 
        console.log('this.inputValues' + JSON.stringify(this.techRevenue))
    }
 
    
    addNewClickHandler() {
        console.log('this.techRevenue[0].Product_Part_Number__c: '+this.techRevenue[0].Product_Part_Number__c)
        this.techRevenue.push({
            tempId: this.techRevenue.length,
            Product_Part_Number__c: this.techRevenue[0].Product_Part_Number__c,
            Additional_Comments__c: this.techRevenue[0].Additional_Comments__c,
            
        });
        console.log('Final: ' + JSON.stringify(this.techRevenue))
    }
 
    deleteClickHandler(event) {
        if (this.techRevenue.length == 1) {
            this.showToast('You cannot delete the last Technical Revenue.');
            return;
        }
        let tempId = event.target?.dataset.tempId;
        this.techRevenue = this.techRevenue.filter(a => a.tempId != tempId);
    }
 
    elementChangeHandler(event) {
        let  technicalRow = this.techRevenue.find(a => a.tempId == event.target.dataset.tempId || a.tempId == event.target.dataset.id);
        if ( technicalRow) {
            if (event.target.type === 'checkbox') {
                 technicalRow[event.target.name] = event.target.checked;
            } else if (event.target.fieldName) {
                technicalctRow[event.target.fieldName] = event.target.value;
            } else {
                 technicalRow[event.target.name] = event.target.value;
            }
        }
    }
    async submitClickHandler(event) {
        const allValid = this.checkControlsValidity();
        if (allValid) {
            this.isLoading = true;
            this.techRevenue.forEach(a => a.Case__c = this.recordId);
 
            let response = await saveTechnicalRevenue({ techRevenue: this.techRevenue });
            if (response.isSuccess) {
                this.showToast('Technical Revenue saved successfully', 'Success', 'success');
                this.dispatchEvent(new CloseActionScreenEvent());
            } else {
                this.showToast('Something went wrong while saving tech - ' + response.message);
            }
            this.isLoading = false;
        } else {
            this.showToast('Please correct the below errors to proceed further.');
        }
    }
 
    checkControlsValidity() {
        let isValid = true,
            controls = this.template.querySelectorAll('lightning-input,lightning-combobox');
 
        controls.forEach(field => {
            if (!field.checkValidity()) {
                field.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }
 
    showToast(message, title = 'Error', variant = 'error') {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}