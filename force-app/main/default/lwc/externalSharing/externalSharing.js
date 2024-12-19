import { LightningElement, wire, api } from "lwc";
import getExternalSharingRecords from '@salesforce/apex/ExternalSharingController.getExternalSharing';

export default class ExternalSharing extends LightningElement {
    columns = [
    { label: 'Connection Name', fieldName: 'connectionName' },
    { label: 'Status', fieldName: 'status'},
    { label: 'Start Date', fieldName: 'startTime'},
    { label: 'Master Org Record Id', fieldName: 'subOrgRecordId'},
];
    @api recordId;
    @api wiredsObjectData;
    rowOffset = 0;

    @wire(getExternalSharingRecords, { recordId: '$recordId' })
    externalSharingrecord(result)  {
        console.log(result.data);
        this.wiredsObjectData = result.data;
        if (result.data) {
        }
    }

}