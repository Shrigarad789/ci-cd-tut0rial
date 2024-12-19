import { LightningElement,api, wire, track } from 'lwc';
import loadingPicklist from '@salesforce/apex/getDependentPicklistValues.loadingPicklist';


export default class CustomMultiplePicklist extends LightningElement {
    @track thePicklist;
    @track typeOptions;
    @api myobjectName = 'Lead';
    @api fieldName = 'job_function__c'; 
    @api controlValue = 'TR04';
    @api label = 'Select Job Functions';
    @api multipleSelection = false;
    @api selectedValue;
    @track selectedVal = '';


    @wire(loadingPicklist, {objectName:'$myobjectName',fieldName:'$fieldName',controlValue:'$controlValue'})
    wiredLoadingPicklist({ error, data }) {
        if (data) {
            try {
                this.thePicklist = data;
                let options = [];
                for(var key in data){              
                    options.push({ label: key, value: data[key] });
                }
                this.typeOptions = options;
                if(this.selectedValue!=null){
                    var tmpList = this.selectedValue.toString().split(';');
                    this.selectedVal = tmpList;
                }
            } catch (error) {
                console.error('check error here', error);
            }
        } else if (error) {
            console.error('check error here', error);
        }

    }

    handleChange(event) {
        try {
            this.selectedVal = event.detail.value;
            var tmpValue = this.selectedVal.join(";");
            this.selectedValue = tmpValue;   
            //this.selectedValue = event.detail.value;   
            console.info('debug error selectedValue:', this.selectedValue);   
        } catch (error) {
            console.error('check error here', error);
        }

    }
}