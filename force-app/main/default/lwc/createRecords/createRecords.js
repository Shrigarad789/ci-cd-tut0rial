import { LightningElement, track,wire} from 'lwc';
import createAccount from '@salesforce/apex/Accountcontroller.createAccount';
import createOppty from '@salesforce/apex/Accountcontroller.createOppty';
import Account_Object from '@salesforce/schema/Account';
import { getObjectInfo,getPicklistValues } from 'lightning/uiObjectInfoApi';
import Name_FIELD from '@salesforce/schema/Account.Name';
import Site_FIELD from '@salesforce/schema/Account.Site';
import Industry_FIELD from '@salesforce/schema/Account.Industry';
import OpptyName_FIELD from '@salesforce/schema/Opportunity.Name';
import { NavigationMixin } from 'lightning/navigation';
export default class CreateRecords extends NavigationMixin(LightningElement) {

recordTypeId;
picklistValue;
optionsArray;
selectedCricketerNationality;

@wire(getObjectInfo, { objectApiName: Account_Object })
objectInfos({data,error}){
if(error){
console.log('error:'+JSON.stringify(Error))
}
else if(data){
this.recordTypeId =data.defaultRecordTypeId;
console.log('this.recordTypeId:'+JSON.stringify(this.recordTypeId))

}
}
@wire(getPicklistValues,{ recordTypeId:'$recordTypeId', fieldApiName: Industry_FIELD })
natioalityFieldvalues({data,error}){
if(error){
    console.log('error:'+JSON.stringify(Error))
}
else if(data){

    let arr=[];

    this.picklistValue =data.values;
            console.log('Picklist data'+JSON.stringify(this.picklistValue))

            this.picklistValue.forEach(  Element =>{
                arr.push({ label : Element.value, value : Element.value})
                    
            })
            this.optionsArray = arr;
            console.log('optionsArray'+JSON.stringify(this.optionsArray))

}

}
@track accErrorMessage;
@track  oppErrorMessage;
@track isShow=false;
@track  accountId;
@track accRecord={
Name:Name_FIELD,
Site:Site_FIELD,
Industry:Industry_FIELD 
}
@track oppRecord={
Name:OpptyName_FIELD
}
handleChangeName(){
this.accRecord.Name=this.template.querySelector(".accName").value;
}
handleChangeSite(){
this.accRecord.Site=this.template.querySelector(".accSite").value;
}


handleChangeOppName(){
this.oppRecord.Name=this.template.querySelector(".oppName").value;
}



handleOptionChange(){
    this.accRecord.Industry =this.template.querySelector(".IndustrySite").value;
    console.log('selectedCricketerNationality'+JSON.stringify(this.selectedCricketerNationality))
    }
handleSave(){
createAccount({acc:this.accRecord})
.then(account => {
    this.accountId=account.Id;
    this.accRecord={};
    console.log('@@@AccountId@@@'+this.accountId);
    createOppty({
        opp:this.oppRecord,
        accId:this.accountId,
        opptyStageName:'Closed Won'
})
})

.then(()=>{
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId:this.accountId,
            objectApiName: 'Account',
            actionName: 'view'
        },
    });
})
.catch(error=>{
    this.accErrorMessage=error;
    console.log('unable to insert the record due to '+JSON.stringify(this.accErrorMessage));
});
}   
}