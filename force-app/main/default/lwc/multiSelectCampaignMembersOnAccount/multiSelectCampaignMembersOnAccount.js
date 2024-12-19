import { LightningElement, api, wire, track } from 'lwc';
import getCampaignMembersForAccount from '@salesforce/apex/MulSelCampaignMembersControllerAcc.getCampaignMembersForAccount';
import updateCampaignMemberStatus from '@salesforce/apex/MulSelCampaignMembersControllerAcc.updateCampaignMemberStatus';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import STATUS_FIELD from '@salesforce/schema/CampaignMember.Status';

const COLUMNS = [
    { label: 'Campaign Member Name', fieldName: 'campaignName', type: 'text' },
    {
        label: 'Status',
        fieldName: 'Status',
        type: 'picklist',
        editable: true,
        typeAttributes: {
            placeholder: 'Select Status',
            options: { fieldName: 'statusOptions' },
            value: { fieldName: 'Status' }
        }
    },
    { label: 'Notes', fieldName: 'Notes__c', type: 'textarea', editable: true }
];

export default class MultiSelectCampaignMembersOnAccount extends LightningElement {
    @api recordId;
    @track data = [];
    @track error;
    @track columns = COLUMNS;
    @track statusOptions = [];
    @track draftValues = [];
    @track isLoading = true;

    @wire(getCampaignMembersForAccount, { accountId: '$recordId' })
    wiredCampaignMembers(result) {
        this.wiredResult = result;
        const { data, error } = result;
        if (data) {
            this.data = data.map(record => ({
                ...record,
                campaignName: record.Campaign.Name
            }));
            this.error = undefined;
            this.isLoading = false;
        } else if (error) {
            this.error = error;
            this.data = [];
            this.isLoading = false;
        }
    }

    @wire(getPicklistValues, { fieldApiName: STATUS_FIELD })
    statusPicklistValues({ error, data }) {
        if (data) {
            this.statusOptions = data.values.map(option => ({
                label: option.label,
                value: option.value
            }));
        } else if (error) {
            this.error = error;
        }
    }

    handleSave(event) {
        const draftValues = event.detail.draftValues;
        const updates = draftValues.map(draft => ({
            Id: draft.Id,
            Status: draft.Status
        }));

        updateCampaignMemberStatus({ updates })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Campaign Members updated successfully.',
                    variant: 'success'
                }));
                return refreshApex(this.wiredResult);
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error updating Campaign Members',
                    message: error.body.message,
                    variant: 'error'
                }));
            });
    }
}
