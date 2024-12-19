import { LightningElement, wire, track,api } from 'lwc';
import saveworkItemRecords from "@salesforce/apex/AddPOItemsController.saveworkItemRecords";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import AI_PO_Item_Object from '@salesforce/schema/AI_PO_Item__c';
import COMPONENT_TYPE from '@salesforce/schema/AI_PO_Item__c.Order_Type__c';
import PLANTPICKLIST from '@salesforce/schema/AI_PO_Item__c.Plant__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getWorkItem from "@salesforce/apex/AddPOItemsController.getWorkItemRecord";
import getWorkItemComList from "@salesforce/apex/AddPOItemsController.getWorkItemComponentRecords";
import deleteWorkItemComponentRecord from "@salesforce/apex/AddPOItemsController.deleteWorkItemComponentRecord";
import updateWorkItemComponents from "@salesforce/apex/AddPOItemsController.updateWorkItemComponents";
import modal from "@salesforce/resourceUrl/custommodalcss";
import { loadStyle } from "lightning/platformResourceLoader";
export default class AddPOItems extends LightningElement {
    @track elementList = [];
    @track componentTypePicklistVal = [];
    @track PlantPicklistVal = [];
    @track disabledRemoveButton = true;
    @api recordId; //use the @api decorator to create a public recordId property
    @track workItemName;  
    @track workItemRecordId;
    @track username;  
    @track userid; 
    @track workItemRecord; 
    @track tableIndex = 0;
    @track showSpinner = false;
    @api workVariableForRefresh;
    isComponentEditMode = false;
    workItemComponents = [];
    @track workItemComponentElements = [];
    @track visibleElements;
    @track workItemComDeleteId;
    @track isConfirmationModalOpen = false;
    @track isWorkItemComponentRecFound = true;
    disabled = false;
    disabledEdit = false;
    //get the workitem object record  using recordid 
    @wire (getWorkItem , { workItemId: '$recordId' })
   
    getWorkItemRecord( {error, data}){
        this.showSpinner = true;
        if(data){
            this.workItemRecord = JSON.parse(data);
            this.workVariableForRefresh = data;
            this.createRow();
            this.showSpinner = false;
        }else if(error){
          this.showSpinner = false;
        }
    }
    constructor() { 
        super(); 
        let self = this; 
        setTimeout(() => { 
        self.style = document.createElement('style'); 
        self.style.innerHTML = `.picklist_combobox .slds-listbox { max-height: calc(((0.8125rem * 1.5) + 1rem) * 5) !important; }`; 
        document.head.appendChild(self.style); }, 50); 
    }
    connectedCallback() {
        loadStyle(this, modal);
        this.message = this.recordId;
    }
    //create initial row 
    createRow(){
        this.elementList = [];//initialize elementList 
        this.tableIndex = 0;
        
        let element = {"id":"tr1", "tableIndex" : this.tableIndex,"parentId":this.recordId, "name":name, "poline":"", "quantity":0.00, "unitprice":0, "osiflag":false,"salesorder":"", "soline":"","part" : "","ordertype" : "","ordertypedescription":"","customersoline":"","customerso":"","plant":"","shippinginstruction":"","showAddButton":true};
        this.elementList.push(element);
        this.disabledRemoveButton = true;
    }
    @wire(getObjectInfo, { objectApiName: AI_PO_Item_Object })
    objectInfo;
    //get picklist values using standard api
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName : COMPONENT_TYPE})    
    componentTypePicklistValues( {error, data}){
        if(data){
            this.componentTypePicklistVal = data;            
        }else if(error){
          console.showNotification(error);
        }
    }
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName : PLANTPICKLIST})    
    PlantPicklistValues( {error, data}){
        if(data){
            this.PlantPicklistVal = data;            
        }else if(error){
          console.showNotification(error);
        }
    }
    
    //select workItem 
    onWorkItemSelection(event){  
        this.workItemName = event.detail.selectedValue;  
        this.workItemRecordId = event.detail.selectedRecordId;  
    }
    //get the values from child components  lwcLookup
    onUserSelection(event){
        this.username = event.detail.selectedValue;  
        this.userid = event.detail.selectedRecordId;
        let tableRowIndex= event.detail.rowid;
        this.elementList[tableRowIndex].releasedBy = this.userid;
    }  
    //add row dynamically
    addRow(event){
        console.log(event.currentTarget);
        let tableElement = this.template.querySelector('.slds-table');
        this.elementList[this.tableIndex].showAddButton = false;
        //clone previous row values
        let poline = this.elementList[this.tableIndex].poline;
        let quantity = this.elementList[this.tableIndex].quantity;
        let name = this.elementList[this.tableIndex].name;
        let description = this.elementList[this.tableIndex].description;
        let unitprice = this.elementList[this.tableIndex].unitprice;
        let salesorder = this.elementList[this.tableIndex].salesorder;
        let soline =  this.elementList[this.tableIndex].soline;
        let part = this.elementList[this.tableIndex].part;
        let ordertype = this.elementList[this.tableIndex].ordertype;
        let ordertypedescription = this.elementList[this.tableIndex].ordertypedescription;
        let customersoline = this.elementList[this.tableIndex].customersoline;
        let customerso = this.elementList[this.tableIndex].customerso;
        let plant = this.elementList[this.tableIndex].plant;
        let shippinginstruction = this.elementList[this.tableIndex].shippinginstruction;
        let tRowId = "tr" + (Date.now());
        this.tableIndex++;
        let element = {"id":tRowId, "tableIndex" : this.tableIndex, "parentId":this.recordId,"quantity":0.00,"unitprice":0.00,"showAddButton":false};
        this.elementList.push(element);
        this.elementList[this.tableIndex].showAddButton = true;
        this.disabledRemoveButton = (tableElement.tBodies[0].rows.length >= 1) ? false : true;
        //this.applyScrollBar();
    }

    /*applyScrollBar(){
        let scrollDivElement = this.template.querySelector('.scrollDiv');
        let elemtLengt = this.elementList.length;
        let heightvalue = parseInt(elemtLengt)*4+2;
        //scrollDivElement.style.cssText = "height: "+ heightvalue + "rem";
        if(heightvalue <= 40){
            scrollDivElement.setAttribute("style","height:" + heightvalue + "rem;" );
        }else{
            scrollDivElement.setAttribute("style","height: 40rem; overflow-y: scroll;" );
        }
    }*/

    //Remove Row Dynamically
    removeRow(event){
        let currentElement = event.currentTarget.dataset.id;
        let tableRow = this.template.querySelectorAll('.tbodyclass > .slds-hint-parent');
        let index = 0;
        tableRow.forEach(element => {
            if(currentElement == element.dataset.rowid){
                this.elementList.splice(index,1);
            }
            index++;
        });
        this.tableIndex--;
        let tableElement = this.template.querySelector('.slds-table');
        this.disabledRemoveButton = (tableElement.tBodies[0].rows.length <= 2) ? true : false;
        if(this.tableIndex == 0 || tableElement.tBodies[0].rows.length-2 == this.tableIndex){
            this.elementList[this.tableIndex].showAddButton = true;
        }
        //this.applyScrollBar();
    }
    //udpate json when the values is changed
    valueChangeHandle(event){
        let tableRow = this.template.querySelectorAll('.tbodyclass > .slds-hint-parent');
        let index = 0;
        tableRow.forEach(element => {
            if(element.dataset.rowid == event.currentTarget.dataset.polineid){                
                 this.elementList[index].poline = event.currentTarget.value;
            }else if(element.dataset.rowid == event.currentTarget.dataset.quantityid){
                if(event.currentTarget.value == '' || event.currentTarget.value == null || event.currentTarget.value == ""){
                    this.elementList[index].quantity = 0;
                }else{
                    this.elementList[index].quantity = event.currentTarget.value;
                }
                
            }else if(element.dataset.rowid == event.currentTarget.dataset.descriptionid){
                this.elementList[index].description = event.currentTarget.value;
            }else if(element.dataset.rowid == event.currentTarget.dataset.customerpartid){
                this.elementList[index].name = event.currentTarget.value;
            }else if(element.dataset.rowid == event.currentTarget.dataset.unitpriceid){
                if(event.currentTarget.value == '' || event.currentTarget.value == null || event.currentTarget.value == ""){
                    this.elementList[index].unitprice = 0;
                }
                else{
                    this.elementList[index].unitprice = event.currentTarget.value;
                }
                
            }else if(element.dataset.rowid == event.currentTarget.dataset.avnetsalesorderid){
                this.elementList[index].salesorder = event.currentTarget.value;
            }else if(element.dataset.rowid == event.currentTarget.dataset.avnetsolineid){
                this.elementList[index].soline = event.currentTarget.value;
            }else if(element.dataset.rowid == event.currentTarget.dataset.avnetpartid){
                this.elementList[index].part = event.currentTarget.value;
            }else if(element.dataset.rowid == event.currentTarget.dataset.ordertypeid){
                this.elementList[index].ordertype = event.currentTarget.value;
            }else if(element.dataset.rowid == event.currentTarget.dataset.ordertypedescriptionid){
                this.elementList[index].ordertypedescription = event.currentTarget.value;                
            }else if(element.dataset.rowid == event.currentTarget.dataset.osiflagid){
                this.elementList[index].osiflag = event.currentTarget.checked;                
            }else if(element.dataset.rowid == event.currentTarget.dataset.customersolineid){
                this.elementList[index].customersoline = event.currentTarget.value;                
            }else if(element.dataset.rowid == event.currentTarget.dataset.customersoid){
                this.elementList[index].customerso = event.currentTarget.value;                
            }else if(element.dataset.rowid == event.currentTarget.dataset.plantid){
                this.elementList[index].plant = event.currentTarget.value;                
            }else if(element.dataset.rowid == event.currentTarget.dataset.shippinginstructionid){
                this.elementList[index].shippinginstruction = event.currentTarget.value;                
            }
            index++;
        });
    }
    //method to handle the add and edit mode of work item component using flag
    handleToggleChange(event){
        //check true is for edit mode 
        if(event.target.checked){
            this.showSpinner = true;
            this.getWorkItemComList();
        }else{
            this.isComponentEditMode = false;
        }
    }
    //method to get the records when the user swith to edit mode
    getWorkItemComList(){
        getWorkItemComList({ workItemId: this.recordId
         }).then(result => {
            console.log('result',result);
            this.workItemComponentElements = [];
            this.workItemComponents = result;
            if( this.workItemComponents.length > 0){
                this.isWorkItemComponentRecFound = true;
                for ( var i = 0; i < result.length; i++ ) {
                    let tRowId = "tr" + (Date.now());
                    let element = {"id":tRowId,"POid": result[i].Id,"poline":result[i].PO_Line__c, "quantity":result[i].POItem_Qantity__c,"description":result[i].POItemDescription__c,
                     "name":result[i].Name ,"unitprice":result[i].POItem_Unit_Price__c , "salesorder":result[i].Avnet_Sales_Order__c, 
                     "soline":result[i].Avnet_SO_Line__c,"part" : result[i].Avnet_Part__c,"ordertype" : result[i].Order_Type__c,
                     "ordertypedescription" : result[i].Order_Type_Description__c ,"osiflag" : result[i].OSI_Flag__c,
                     "customersoline" : result[i].Customer_SO_Line__c,"customerso" : result[i].Customer_SO__c,"plant" :result[i].Plant__c,"shippinginstruction" :result[i].POItem_Shipping_Instructions__c
                     };
                    this.workItemComponentElements.push(element);
                }
                this.isComponentEditMode = true;
            }else{
                this.isComponentEditMode = true;
                this.workItemComponentElements = null;
                
                this.isWorkItemComponentRecFound = false;
            }
            this.showSpinner = false;
        }).catch(err => {
            console.log("Error in getRecords= ", err);
            this.showSpinner = false;
        });
    }
    updateWorkItemComHandler(event){
        console.log(event.detail.records);
        this.visibleElements = [...event.detail.records]
        console.log('visible',this.visibleElements);
    }
    //method to delete the work item component records
    removeWorkItemComponentRecord(event){
        let currentWorkItemComId = event.currentTarget.dataset.id;
        if(currentWorkItemComId){
            console.log('currentWorkItemComId..',currentWorkItemComId);
            this.workItemComDeleteId = currentWorkItemComId;
            this.isConfirmationModalOpen = true;
        }
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isConfirmationModalOpen = false;
    }
    submitDetails() {
        this.isConfirmationModalOpen = false;
        if(this.workItemComDeleteId){
            this.showSpinner = true;
            deleteWorkItemComponentRecord({ workItemComponentId : this.workItemComDeleteId})
                .then(result => {
                    console.log("saveRecords promise=", result);
                    this.showNotification('Success',result,'success');
                    this.showSpinner = false;
                    for ( var i = 0; i < this.workItemComponentElements.length; i++ ) {
                        if(this.workItemComponentElements[i].POid == this.workItemComDeleteId){
                            this.workItemComponentElements.splice(i,1);
                            break;
                        }
                    }
                    let paginationCom = this.template.querySelector('c-pagination');
                    if(paginationCom){
                        paginationCom.reArrangeWorkItemComRecords();
                    }
                    if(this.workItemComponentElements.length > 0){
                        this.isWorkItemComponentRecFound = true;
                    }else{
                        
                        this.isWorkItemComponentRecFound = false;
                    }
                    console.log('length',this.workItemComponentElements.length);
                    eval("$A.get('e.force:refreshView').fire();");
                }).catch(err => {
                    console.log('error',err)
                    if(err.body && err.body.legth > 0){
                       this.showNotification('Error',err.body.message,'error');
                    }
                    this.showSpinner = false;
             });
        }
    }
    //value change handle for update table 
    editModeValueChangeHandle(event){
        
        for ( var i = 0; i < this.workItemComponentElements.length; i++ ) {
            
            if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.polineid){                
                 this.workItemComponentElements[i].poline = event.currentTarget.value;
                 break;
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.quantityid){
                if(event.currentTarget.value == '' || event.currentTarget.value == null || event.currentTarget.value == ""){
                    this.workItemComponentElements[i].quantity = 0;
                }else{
                    this.workItemComponentElements[i].quantity = event.currentTarget.value;
                }
                
                break;
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.customerpartid){
                this.workItemComponentElements[i].name = event.currentTarget.value;
                break;
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.unitpriceid || event.currentTarget.value == ""){
                if(event.currentTarget.value == '' || event.currentTarget.value == null){
                    this.workItemComponentElements[i].unitprice = 0;
                }else{
                    this.workItemComponentElements[i].unitprice = event.currentTarget.value;
                }
                break;
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.descriptionid){
                this.workItemComponentElements[i].description = event.currentTarget.value;
                break;
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.avnetsalesorderid){
                this.workItemComponentElements[i].salesorder = event.currentTarget.value;
                break;
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.avnetsolineid){
                this.workItemComponentElements[i].soline = event.currentTarget.value;
                break;
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.avnetpartid){
                this.workItemComponentElements[i].part = event.currentTarget.value;
                break;
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.ordertypeid){
                this.workItemComponentElements[i].ordertype = event.currentTarget.value;
                break;
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.ordertypedescriptionid){
                this.workItemComponentElements[i].ordertypedescription = event.currentTarget.value;  
                break;          
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.osiflagid){
                this.workItemComponentElements[i].osiflag = event.currentTarget.checked;                
                break;
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.customersolineid){
                this.workItemComponentElements[i].customersoline = event.currentTarget.value;      
                break;          
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.customersoid){
                this.workItemComponentElements[i].customerso = event.currentTarget.value;         
                break;       
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.plantid){
                this.workItemComponentElements[i].plant = event.currentTarget.value;         
                break;       
            }else if(this.workItemComponentElements[i].POid == event.currentTarget.dataset.shippinginstructionid){
                this.workItemComponentElements[i].shippinginstruction = event.currentTarget.value;         
                break;       
            }
        }
    }
    //save records
    saveRecord(){

        //check the all mandatory fields are filled or not
        const allValid = [...this.template.querySelectorAll('.mandatoryField')]
            .reduce((validSoFar, inputCmp) => {
                        inputCmp.reportValidity();
                        return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            this.disabled = true;
            this.showSpinner = true;
            //alert('All form entries look valid. Ready to submit!');
            let workItemInsertArray = [];
            this.elementList.forEach(element => {
                console.log('element..',element);
                //if(element.componentType && element.componentName){
                    let obj = {"parentId":element.parentId, "ordertype": element.ordertype, "poline": element.poline, "quantity": element.quantity,"description":element.description,"name":element.name, "unitprice": element.unitprice,"salesorder" : element.salesorder,"soline":element.soline,"part":element.part,"ordertypedescription":element.ordertypedescription,"osiflag":element.osiflag,"customersoline":element.customersoline,"customerso":element.customerso,"plant":element.plant,"shippinginstruction":element.shippinginstruction};
                    workItemInsertArray.push(obj);
                //}
            });
            console.log('workItemInsertArray'+JSON.stringify(workItemInsertArray));
            if(workItemInsertArray != null && workItemInsertArray.length > 0){
                let jsonStringElement = JSON.stringify(workItemInsertArray);                
                console.log('jsonStringElement..'+jsonStringElement);
                //insert work item records
                saveworkItemRecords({ workItemRecords : jsonStringElement})
                    .then(result => {
                        console.log("saveRecords promise=", result);
                        this.showNotification('Success',result,'success');
                        this.showSpinner = false;
                        //window.location.reload();
                        eval("$A.get('e.force:refreshView').fire();");
                        this.createRow(); 
                        this.disabled = false;
                    }).catch(err => {
                        //if(err.body && err.body.pageErrors.length > 0){
                            console.log('## error in creating records: ' + JSON.stringify(err));
                            //this.showNotification("Error", "Error in creating record!", "err");
                            this.showNotification('Error',err.body.pageErrors[0].message,'error');
                        //}
                        this.showSpinner = false;
                        this.disabled = false;
                });
            }else{
                this.showSpinner = false;
                this.disabled =false
            }  
        } else {
            //alert('Please update the invalid form entries and try again.');
        }
    }

    handleCancel(event){
        var url = window.location.href;
        var value = url.substr(0,url.lastIndexOf('/') + 1);
        window.history.back();
        return false;
        }

    //mehtod to update the multiple work item components
    updateWorkItemComponentsRecords(){
         //check the all mandatory fields are filled or not
         const allValid = [...this.template.querySelectorAll('.editModeMandatoryField')]
         .reduce((validSoFar, inputCmp) => {
            console.log('*********');
            console.log(JSON.stringify(inputCmp));
                     inputCmp.reportValidity();
                     return validSoFar && inputCmp.checkValidity();
         }, true);
            if(allValid){
                this.disabledEdit = true;                
                this.showSpinner = true;

                //alert('All form entries look valid. Ready to submit!');
                let workItemInsertArray = [];
                this.elementList.forEach(element => {
                    console.log('element..',element);
                    //if(element.componentType && element.componentName){
                        let obj = {"parentId":element.parentId, "ordertype": element.ordertype, "poline": element.poline,"description":element.description, "quantity": element.quantity,"name":element.name, "unitprice": element.unitprice,"salesorder" : element.salesorder,"soline":element.soline,"part":element.part,"ordertypedescription":element.ordertypedescription,"osiflag":element.osiflag,"customersoline":element.customersoline,"customerso":element.customerso,"plant":element.plant};
                        workItemInsertArray.push(obj);
                    //}
                });
                console.log('workItemInsertArray'+JSON.stringify(workItemInsertArray));
                if(workItemInsertArray != null && workItemInsertArray.length > 0){
                {
                    let jsonStringElement = JSON.stringify(this.workItemComponentElements);
                    console.log('jsonStringElement',jsonStringElement);
                    updateWorkItemComponents({ workItemCompRecords : jsonStringElement})
                    .then(result => {
                        console.log("saveRecords promise=", result);
                        this.showNotification('Success',result,'success');
                        this.showSpinner = false;
                        this.disabledEdit = false;
                        eval("$A.get('e.force:refreshView').fire();");
                    }).catch(err => {
                        console.log('## error in updating records: ' + JSON.stringify(err));
                        //if(err.body && err.body.length > 0){
                            this.showNotification('Error',err.body.pageErrors[0].message,'error');
                        //}
                        this.showSpinner = false;
                        this.disabledEdit = false;
                    }); 
                }
         }else{
            this.disabledEdit = false;
         }
         }
    }
    //Display Toast Notifications
    showNotification(notificationTitle,notificationMessage,notificationVariant) {
        const evt = new ShowToastEvent({
            title: notificationTitle,
            message: notificationMessage,
            variant: notificationVariant,
        });
        this.dispatchEvent(evt);
    }

    
}