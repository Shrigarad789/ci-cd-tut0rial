import { LightningElement,api, wire, track } from 'lwc';
import loadingPicklist from '@salesforce/apex/getDependentPicklistValues.loadingPicklist';


export default class CustomPicklist extends LightningElement {
    @track thePicklist;
    @track typeOptions;
    @api myobjectName = 'Lead';
    @api fieldName = 'job_function__c'; 
    @api controlValue = 'TR04';
    @api label = 'Select Job Functions';
    @api selectedValue;


    @wire(loadingPicklist, {objectName:'$myobjectName',fieldName:'$fieldName',controlValue:'$controlValue'})
    wiredLoadingPicklist({ error, data }) {
        if (data) {
            try {
                this.thePicklist = data;
                console.info('debug here', data);
                let options = [];

                for(var key in data){
                    console.log('key : '+ key+ 'Map value: ', data[key]);
                
                    options.push({ label: key, value: data[key] });
                }
                
                
                this.typeOptions = options;
                console.info('debug here options:', this.typeOptions);
            } catch (error) {
                console.error('check error here', error);
            }
        } else if (error) {
            console.error('check error here', error);
        }
    }

    handleChange(event) {
        try {
            this.selectedValue = event.detail.value;   
            console.info('debug error selectedValue:', this.selectedValue);   
        } catch (error) {
            console.error('check error here', error);
        }

    }
}