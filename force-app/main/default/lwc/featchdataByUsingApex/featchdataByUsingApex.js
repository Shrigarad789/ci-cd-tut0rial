import { LightningElement , wire, track} from 'lwc';
import getAccountList from '@salesforce/apex/getRecordDataController.getAccountList';
 
export default class FeatchdataByUsingApex extends LightningElement {
    @track columns = [{
        label: 'Id',
        fieldName: 'Id',
        type: 'text'
    },
    {
        label: 'Account.Name',
        fieldName: 'AccountName',
        type: 'text'
    }
];
 
 error;
 accList ;
 
@wire(getAccountList)
 
wiredAccounts({ error, data}) {
    if (data) {
       console.log('data>>>>>>>',data);
 
        let contactData = JSON.parse(JSON.stringify(data));
        console.log(' contactDataa>>>>>>>', contactData);
 
      contactData.forEach(record => {
 
        if (record.AccountId) {
 
          record.AccountName = record.Account.Name;
 
         }
 
        });
 
      this.accList = contactData ;
      console.log(' this.accList>>>>>>>',  this.accList);
    } else if (error) {
        this.error = error;
    }
}
   
}
 
// let contactData = JSON.parse(JSON.stringify(data));
 
//       contactData.forEach(record => {
 
//         if (record.AccountId) {
 
//           record.AccountName = record.Account.Name;
 
//          }



// error;
//  accList ;
 
// @wire(getAccountList)
 
// wiredAccounts({ error, data}) {
//     if (data) {
//         this.accList = data;
//     } else if (error) {
//         this.error = error;
//     }
// }