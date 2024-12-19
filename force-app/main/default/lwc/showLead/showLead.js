import { LightningElement, wire } from 'lwc';
import leadList from '@salesforce/apex/LeadRecodsShowInLwcCompoent.test1';
import searchleadList from '@salesforce/apex/LeadRecodsShowInLwcCompoent.searchLeads';


export default class ShowLead extends LightningElement {
    columns = [{ label: 'Last Name', type: 'text', fieldName: 'LastName' }];
    leadList;
    error;
    searchKey = '';

    @wire(leadList)
    Leadrecord({ error, data }) {
        if (data) {
            this.leadList = data;
        } else if (error) {
            this.error = error;
        }
    }

    handleChange(event) {
        this.searchKey = event.target.value;
        searchleadList({ searchValue: this.searchKey })
            .then(result => {
                this.leadList = result;
            })
            .catch(error => {
                this.error = error;
            });
    }
}