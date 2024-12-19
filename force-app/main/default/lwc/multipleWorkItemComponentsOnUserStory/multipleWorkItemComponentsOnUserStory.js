import {
    LightningElement,
    wire,
    track,
    api
} from 'lwc';
import saveworkItemRecords from "@salesforce/apex/WorkItemComponentController.saveworkItemRecords";
import {
    getObjectInfo
} from 'lightning/uiObjectInfoApi';
import {
    getPicklistValues
} from 'lightning/uiObjectInfoApi';
import WORK_ITEM_COMPONENT_OBJECT from '@salesforce/schema/Work_Item_Component__c';
import COMPONENT_TYPE from '@salesforce/schema/Work_Item_Component__c.Component_Type__c';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import getWorkItemComList from "@salesforce/apex/WorkItemComponentController.getWorkItemComponentRecords";
import deleteWorkItemComponentRecord from "@salesforce/apex/WorkItemComponentController.deleteWorkItemComponentRecord";
import updateWorkItemComponents from "@salesforce/apex/WorkItemComponentController.updateWorkItemComponents";

import DEPLOYMENT_ORGS from '@salesforce/schema/Work_Item_Component__c.Deployment_Org__c';
import CURRENT_ENVRMNT from '@salesforce/schema/Work_Item_Component__c.Current_Environment__c';

export default class MultipleWorkItemComponentsOnUserStory extends LightningElement {
    @track elementList = [];
    @track componentTypePicklistVal = [];
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
    //get the workitem object record  using recordid 

    @track selectedValue_DepOrgs = [];
    @track options;
    @track optionscn;
    @track selectedValue_CurrEnvrmnt = [];
    @track oldSelectedStringValue;
    @track oldSelectedStringValuecn;
    @track isEditMode;
    @track rowid;


    constructor() {
        super();
        this.showSpinner = true;
        let self = this;
        setTimeout(() => {
            self.style = document.createElement('style');
            self.style.innerHTML = `.picklist_combobox .slds-listbox { max-height: calc(((0.8125rem * 1.5) + 1rem) * 5) !important; }`;
            document.head.appendChild(self.style);
        }, 50);
    }
    connectedCallback() {
        this.message = this.recordId;
        this.createRow();
        this.showSpinner = false;
    }
    //create initial row 
    createRow() {
        console.log("**** ");
        console.log(this.recordId);
        this.elementList = []; //initialize elementList 
        this.selectedValue_CurrEnvrmnt = [];
        this.selectedValue_DepOrgs = [];
        this.tableIndex = 0;
        this.username = "";
        let lwcLookup = this.template.querySelector("c-lwc-lookup");
        if (lwcLookup) {
            lwcLookup.selectedValue = ""; //re-initialize child component variable for reset lookup value
        }
        let element = {
            "id": "tr1",
            "tableIndex": this.tableIndex,
            "parentId": this.recordId,
            "workItem": this.workItemRecord,
            "componentType": "",
            "componentName": "",
            "relatedObjectName": "",
            "selectedValue_DepOrgs": "",
            "selectedValue_CurrEnvrmnt": "",
            "includeInChangeSet": false,
            "postDeploymentActivity": "",
            "manualChangesSteps": "",
            "changeSetName": "",
            "releasedBy": "",
            "lookupSelectedValue": "",
            "showAddButton": true
        };
        this.elementList.push(element);
        this.disabledRemoveButton = true;
    }

    @wire(getObjectInfo, {
        objectApiName: WORK_ITEM_COMPONENT_OBJECT
    })
    objectInfo;
    //get picklist values using standard api
    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: COMPONENT_TYPE
    })
    componentTypePicklistValues({
        error,
        data
    }) {
        if (data) {
            this.componentTypePicklistVal = data;
        } else if (error) {

        }
    }

    //fetch picklist options
    @wire(getPicklistValues, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        fieldApiName: DEPLOYMENT_ORGS
    })
    wirePickList({
        error,
        data
    }) {
        if (data) {
            this.options = data.values;
        } else if (error) {
            console.log(error);
        }
    }
    @wire(getPicklistValues, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        fieldApiName: CURRENT_ENVRMNT
    })
    wirePickListcn({
        error,
        data
    }) {
        if (data) {
            //     console.log('child cmp pick list data >>> ', data.values);
            // this.optionDatacn = data.values;
            this.optionscn = data.values;
            //  console.log('1217 this.options_CN!@@! ',this.optionscn);
            //   this.showOptions();
            //   this.handleBlur();
        } else if (error) {
            console.log(error);
        }
    }

    //for multiselect picklist
    handleSelectOptionList(event) {
        this.selectedValue_DepOrgs = [];
        this.selectedValue_DepOrgs = event.detail.value;
        let newstring = this.selectedValue_DepOrgs.toString().replaceAll(',', ';');
        if (!this.isEditMode) {
            let tableRowIndex = event.detail.rowid;
            this.oldSelectedStringValue = newstring;
            if (tableRowIndex == this.elementList[tableRowIndex].tableIndex) {
                this.elementList[tableRowIndex].selectedValue_DepOrgs = newstring;
            }
        } else {
            for (var i = 0; i < this.workItemComponentElements.length; i++) {
                if (this.workItemComponentElements[i].workItemComId == event.detail.workitemcomid) {
                    this.workItemComponentElements[i].selectedValue_DepOrgs = newstring.toString().replaceAll(',', ';') != null ? newstring.toString().replaceAll(',', ';') : null;
                }
            }
        }
    }

    handleselectoptionaddrow(event) {
        this.selectedValue_DepOrgs = [];
        this.selectedValue_DepOrgs = event.detail.value;
        let newstring = this.selectedValue_DepOrgs.toString().replaceAll(',', ';');
        this.oldSelectedStringValue = newstring;
        let tableRowIndex = event.detail.rowid;
        if (tableRowIndex == this.elementList[tableRowIndex].tableIndex) {
            this.elementList[tableRowIndex].selectedValue_DepOrgs = newstring;
        }
    }

    handleSelectOptionListcn(event) {
        this.selectedValue_CurrEnvrmnt = [];
        this.selectedValue_CurrEnvrmnt = event.detail.valuescn;
        let newstring = this.selectedValue_CurrEnvrmnt.toString().replaceAll(',', ';');
        this.oldSelectedStringValuecn = newstring;
        if (!this.isEditMode) {
            let tableRowIndex = event.detail.rowidcn;
            if (tableRowIndex == this.elementList[tableRowIndex].tableIndex) {
                this.elementList[tableRowIndex].selectedValue_CurrEnvrmnt = newstring;
            }
        } else {
            for (var i = 0; i < this.workItemComponentElements.length; i++) {
                if (this.workItemComponentElements[i].workItemComId == event.detail.workitemcomidcn) {
                    this.workItemComponentElements[i].selectedValue_CurrEnvrmnt = newstring.toString().replaceAll(',', ';') != null ? newstring.toString().replaceAll(',', ';') : null;
                }
            }
        }
    }

    //select workItem 
    onWorkItemSelection(event) {
        this.workItemName = event.detail.selectedValue;
        this.workItemRecordId = event.detail.selectedRecordId;
    }

    //get the values from child components  lwcLookup
    onUserSelection(event) {
        this.username = event.detail.selectedValue;
        this.userid = event.detail.selectedRecordId;
        let tableRowIndex = event.detail.rowid;
        this.elementList[tableRowIndex].releasedBy = this.userid;
    }

    //add row dynamically
    addRow(event) {
        var rowId = this.tableIndex;
        let tableElement = this.template.querySelector('.slds-table');
        this.elementList[this.tableIndex].showAddButton = false;
        //clone previous row values
        let componentType = this.elementList[this.tableIndex].componentType;
        let componentName = this.elementList[this.tableIndex].componentName;
        let relatedObjectName = this.elementList[this.tableIndex].relatedObjectName;
        let includeInChangeSet = this.elementList[this.tableIndex].includeInChangeSet;
        let postDeploymentActivity = this.elementList[this.tableIndex].postDeploymentActivity;
        let manualChangesSteps = this.elementList[this.tableIndex].manualChangesSteps;
        let changeSetName = this.elementList[this.tableIndex].changeSetName;
        let releasedBy = this.elementList[this.tableIndex].releasedBy;
        let lookupSelValue = this.elementList[this.tableIndex].lookupSelectedValue;


        var DepOrgs = (this.oldSelectedStringValue != undefined) ? this.oldSelectedStringValue.replaceAll(';', ',').split(",") : "";
        var CurrEnvrmnt = (this.oldSelectedStringValuecn != undefined) ? this.oldSelectedStringValuecn.replaceAll(';', ',').split(",") : "";

        let tRowId = "tr" + (Date.now());
        this.tableIndex++;
        let element = {
            "id": tRowId,
            "tableIndex": this.tableIndex,
            "parentId": this.recordId,
            "workItem": this.workItemRecord,
            "componentType": componentType,
            "componentName": componentName,
            "relatedObjectName": relatedObjectName,
            "includeInChangeSet": includeInChangeSet,
            "postDeploymentActivity": postDeploymentActivity,
            "manualChangesSteps": manualChangesSteps,
            "changeSetName": changeSetName,
            "selectedValue_DepOrgs": DepOrgs,
            "selectedValue_CurrEnvrmnt": CurrEnvrmnt,
            "releasedBy": releasedBy,
            "lookupSelectedValue": this.username,
            "showAddButton": false
        };

        this.elementList.push(element);
        this.elementList[this.tableIndex].showAddButton = true;
        this.disabledRemoveButton = (tableElement.tBodies[0].rows.length >= 1) ? false : true;
        this.applyScrollBar();
    }

    applyScrollBar() {
        let scrollDivElement = this.template.querySelector('.scrollDiv');
        let elemtLengt = this.elementList.length;
        let heightvalue = parseInt(elemtLengt) * 4 + 2;
        //scrollDivElement.style.cssText = "height: "+ heightvalue + "rem";
        if (heightvalue <= 40) {
            scrollDivElement.setAttribute("style", "height:" + heightvalue + "rem;");
        } else {
            scrollDivElement.setAttribute("style", "height: 40rem; overflow-y: scroll;");
        }
    }

    //Remove Row Dynamically
    removeRow(event) {
        let currentElement = event.currentTarget.dataset.id;
        let tableRow = this.template.querySelectorAll('.tbodyclass > .slds-hint-parent');
        let index = 0;
        tableRow.forEach(element => {
            if (currentElement == element.dataset.rowid) {
                this.elementList.splice(index, 1);
            }
            index++;
        });
        this.tableIndex--;
        let tableElement = this.template.querySelector('.slds-table');
        this.disabledRemoveButton = (tableElement.tBodies[0].rows.length <= 2) ? true : false;
        if (this.tableIndex == 0 || tableElement.tBodies[0].rows.length - 2 == this.tableIndex) {
            this.elementList[this.tableIndex].showAddButton = true;
        }
        this.applyScrollBar();
    }

    //udpate json when the values is changed
    valueChangeHandle(event) {
        let tableRow = this.template.querySelectorAll('.tbodyclass > .slds-hint-parent');
        let index = 0;
        tableRow.forEach(element => {
            if (element.dataset.rowid == event.currentTarget.dataset.workitemid) {
                //this.elementList[index].workItem = event.currentTarget.dataset.workitemid;
                this.elementList[index].workItem = this.workItemRecord;
            } else if (element.dataset.rowid == event.currentTarget.dataset.componenttypeid) {
                this.elementList[index].componentType = event.currentTarget.value;
            } else if (element.dataset.rowid == event.currentTarget.dataset.compoenetnameid) {
                this.elementList[index].componentName = event.currentTarget.value;
            } else if (element.dataset.rowid == event.currentTarget.dataset.objectnameid) {
                this.elementList[index].relatedObjectName = event.currentTarget.value;
            } else if (element.dataset.rowid == event.currentTarget.dataset.includechangeset) {
                this.elementList[index].includeInChangeSet = event.currentTarget.checked;
            } else if (element.dataset.rowid == event.currentTarget.dataset.postdevactivityid) {
                this.elementList[index].postDeploymentActivity = event.currentTarget.value;
            } else if (element.dataset.rowid == event.currentTarget.dataset.manualchangesid) {
                this.elementList[index].manualChangesSteps = event.currentTarget.value;
            } else if (element.dataset.rowid == event.currentTarget.dataset.changesetnameid) {
                this.elementList[index].changeSetName = event.currentTarget.value;
            } else if (element.dataset.rowid == event.currentTarget.dataset.releasedbyid) {
                //this.elementList[index].releasedBy = event.currentTarget.value;
                this.elementList[index].releasedBy = this.userid;
            }

            index++;
        });
    }
    //method to handle the add and edit mode of work item component using flag
    handleToggleChange(event) {
        //check true is for edit mode 
        if (event.target.checked) {
            this.isEditMode = true;
            this.showSpinner = true;
            this.getWorkItemComList();
        } else {
            this.createRow();
            this.isComponentEditMode = false;
            this.isEditMode = false;
        }
    }

    //method to get the records when the user swith to edit mode
    getWorkItemComList() {
        getWorkItemComList({
            workItemId: this.recordId
        }).then(result => {
            this.workItemComponentElements = [];
            this.workItemComponents = result;
            if (this.workItemComponents.length > 0) {
                this.isWorkItemComponentRecFound = true;
                for (var i = 0; i < result.length; i++) {
                    let tRowId = "tr" + (Date.now());
                    let selectedValue_DepOrgs = result[i].Deployment_Org__c != null ? result[i].Deployment_Org__c.replaceAll(';', ',').split(",").toString() : null;
                    let selectedValue_CurrEnvrmnt = result[i].Current_Environment__c != null ? result[i].Current_Environment__c.replaceAll(';', ',').split(",").toString() : null;
                    let element = {
                        "id": tRowId,
                        "tableIndex": i,
                        "workItemComId": result[i].Id,
                        "componentType": result[i].Component_Type__c,
                        "componentName": result[i].Component_Name__c,
                        "relatedObjectName": result[i].Related_Object_Name__c,
                        "includeInChangeSet": result[i].Include_In_Change_Set__c,
                        "postDeploymentActivity": result[i].Post_Deployment_Activity__c,
                        "manualChangesSteps": result[i].Manual_Changes_Steps__c,
                        "changeSetName": result[i].Change_Set_name__c,
                        "selectedValue_DepOrgs": selectedValue_DepOrgs != null ? selectedValue_DepOrgs : null,
                        "selectedValue_CurrEnvrmnt": selectedValue_CurrEnvrmnt != null ? selectedValue_CurrEnvrmnt : null
                    };
                    this.workItemComponentElements.push(element);
                }
                this.isComponentEditMode = true;
            } else {
                this.isComponentEditMode = true;
                this.isWorkItemComponentRecFound = false;
            }
            this.showSpinner = false;
        }).catch(err => {
            this.showSpinner = false;
        });
    }

    updateWorkItemComHandler(event) {
        this.visibleElements = [...event.detail.records]
    }

    //method to delete the work item component records
    removeWorkItemComponentRecord(event) {
        let currentWorkItemComId = event.currentTarget.dataset.id;
        if (currentWorkItemComId) {
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
        if (this.workItemComDeleteId) {
            this.showSpinner = true;
            deleteWorkItemComponentRecord({
                    workItemComponentId: this.workItemComDeleteId
                })
                .then(result => {
                    this.showNotification('Success', result, 'success');
                    this.showSpinner = false;
                    for (var i = 0; i < this.workItemComponentElements.length; i++) {
                        if (this.workItemComponentElements[i].workItemComId == this.workItemComDeleteId) {
                            this.workItemComponentElements.splice(i, 1);
                            break;
                        }
                    }
                    let paginationCom = this.template.querySelector('c-pagination');
                    if (paginationCom) {
                        paginationCom.reArrangeWorkItemComRecords();
                    }
                    if (this.workItemComponentElements.length > 0) {
                        this.isWorkItemComponentRecFound = true;
                    } else {
                        this.isWorkItemComponentRecFound = false;
                    }
                    eval("$A.get('e.force:refreshView').fire();");
                }).catch(err => {
                    if (err.body && err.body.legth > 0) {
                        this.showNotification('Error', err.body.message, 'error');
                    }
                    this.showSpinner = false;
                });
        }
    }

    //value change handle for update table 
    editModeValueChangeHandle(event) {

        for (var i = 0; i < this.workItemComponentElements.length; i++) {
            if (this.workItemComponentElements[i].workItemComId == event.currentTarget.dataset.componenttypeid) {
                this.workItemComponentElements[i].componentType = event.currentTarget.value;
                break
            } else if (this.workItemComponentElements[i].workItemComId == event.currentTarget.dataset.compoenetnameid) {
                this.workItemComponentElements[i].componentName = event.currentTarget.value;
                break;
            } else if (this.workItemComponentElements[i].workItemComId == event.currentTarget.dataset.objectnameid) {
                this.workItemComponentElements[i].relatedObjectName = event.currentTarget.value;
                break;
            } else if (this.workItemComponentElements[i].workItemComId == event.currentTarget.dataset.includechangeset) {
                this.workItemComponentElements[i].includeInChangeSet = event.currentTarget.checked;
                break;
            } else if (this.workItemComponentElements[i].workItemComId == event.currentTarget.dataset.postdevactivityid) {
                this.workItemComponentElements[i].postDeploymentActivity = event.currentTarget.value;
                break;
            } else if (this.workItemComponentElements[i].workItemComId == event.currentTarget.dataset.manualchangesid) {
                this.workItemComponentElements[i].manualChangesSteps = event.currentTarget.value;
                break;
            }
        }
    }

    //save records
    saveRecord() {
        //check the all mandatory fields are filled or not
        const allValid = [...this.template.querySelectorAll('.mandatoryField')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            this.showSpinner = true;
            //alert('All form entries look valid. Ready to submit!');
            this.selectedValue_CurrEnvrmnt = [];
            this.selectedValue_DepOrgs = [];

            let workItemInsertArray = [];
            this.elementList.forEach(element => {
                if (element.selectedValue_DepOrgs.length == 0) {
                    element.selectedValue_DepOrgs = '';
                }
                if (element.selectedValue_CurrEnvrmnt.length == 0) {
                    element.selectedValue_CurrEnvrmnt = '';
                }
                if (element.componentType && element.componentName) {
                    let selectedValue_DepOrgs = element.selectedValue_DepOrgs.toString().replaceAll(',', ';');
                    let selectedValue_CurrEnvrmnt = element.selectedValue_CurrEnvrmnt.toString().replaceAll(',', ';');
                    let obj = {
                        "parentId": element.parentId,
                        "componentType": element.componentType,
                        "componentName": element.componentName,
                        "relatedObjectName": element.relatedObjectName,
                        "includeInChangeSet": element.includeInChangeSet,
                        "postDeploymentActivity": element.postDeploymentActivity,
                        "manualChangesSteps": element.manualChangesSteps,
                        "changeSetName": element.changeSetName,
                        "releasedBy": element.releasedBy,
                        "selectedValue_DepOrgs": selectedValue_DepOrgs,
                        "selectedValue_CurrEnvrmnt": selectedValue_CurrEnvrmnt
                    };
                    workItemInsertArray.push(obj);
                }
            });
            if (workItemInsertArray != null && workItemInsertArray.length > 0) {
                let jsonStringElement = JSON.stringify(workItemInsertArray);
                //insert work item records
                saveworkItemRecords({
                        workItemRecords: jsonStringElement
                    })
                    .then(result => {
                        let scrollDivElement = this.template.querySelector('.scrollDiv');
                        scrollDivElement.setAttribute("style", "height: 6rem;");
                        this.showNotification('Success', result, 'success');
                        this.showSpinner = false;
                        //window.location.reload();
                        eval("$A.get('e.force:refreshView').fire();");
                        this.template.querySelector("c-multi-select-pick-list").clearAll();
                        this.template.querySelector("c-multi-select-pick-list").clearAllcn();
                        
                        this.createRow();

                    }).catch(err => {
                        if (err.body && err.body.pageErrors.length > 0) {
                            this.showNotification('Error', err.body.pageErrors[0].message, 'error');
                        }

                        this.showSpinner = false;
                    });
            } else {
                this.showSpinner = false;
            }
        } else {
            //alert('Please update the invalid form entries and try again.');
        }
    }

    //mehtod to update the multiple work item components
    updateWorkItemComponentsRecords() {
        //check the all mandatory fields are filled or not
        const allValid = [...this.template.querySelectorAll('.editModeMandatoryField')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            if (this.workItemComponentElements.length > 0) {
                this.showSpinner = true;
                let jsonStringElement = JSON.stringify(this.workItemComponentElements);
                updateWorkItemComponents({
                        workItemCompRecords: jsonStringElement
                    })
                    .then(result => {
                        this.showNotification('Success', result, 'success');
                        this.showSpinner = false;
                        eval("$A.get('e.force:refreshView').fire();");
                    }).catch(err => {
                        if (err.body && err.body.length > 0) {
                            this.showNotification('Error', err.body.message, 'error');
                        }
                        this.showSpinner = false;
                    });
            }
        } else {

        }
    }

    //Display Toast Notifications
    showNotification(notificationTitle, notificationMessage, notificationVariant) {
        const evt = new ShowToastEvent({
            title: notificationTitle,
            message: notificationMessage,
            variant: notificationVariant,
        });
        this.dispatchEvent(evt);
    }
}