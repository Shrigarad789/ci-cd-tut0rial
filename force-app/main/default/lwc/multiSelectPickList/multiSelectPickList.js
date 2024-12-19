import {
    LightningElement,
    track,
    api,
    wire
} from 'lwc';

import {
    getObjectInfo
} from 'lightning/uiObjectInfoApi';
import {
    getPicklistValues
} from 'lightning/uiObjectInfoApi';
import WORK_ITEM_COMPONENT_OBJECT from '@salesforce/schema/Work_Item_Component__c';
import DEPLOYMENT_ORGS from '@salesforce/schema/Work_Item_Component__c.Deployment_Org__c';
import CURRENT_ENVRMNT from '@salesforce/schema/Work_Item_Component__c.Current_Environment__c';


export default class MultiSelectPickList extends LightningElement {

    @api rowid;
    @api rowidcn;
    @api options;
    @api optionscn;
    @api selectedValue;
    @api selectedValues = [];
    @api selectedValuescn = [];
    @api label;
    @api disabled = false;
    @api multiSelect = false;
    @track value;
    @track valuecn;
    @track oldrowid;
    @track oldrowidcn;
    @track values = [];
    @track valuesAddRow = [];
    @track valuescn = [];
    @track optionData = [];
    @track optionDatacn;
    @track searchString = '';
    @track searchStringcn = '';
    @track noResultMessage;
    @track noResultMessagecn;
    @track showDropdown = false;
    @track showDropdowncn = false;
    @track isSelectedData = false;  
    @api isEditMode = false;
    @api workitemcomid;
    @api workitemcomidcn;
    @api selectdataforaddrowdevorg;
    @api selectdataforaddrowcrrntenvrmnt;
    @track clearValueCount = 0;
    @track clearValueCountcn = 0;

    connectedCallback() {
        this.showDropdown = false;
        this.showDropdowncn = false;
    }

    @wire(getObjectInfo, {
        objectApiName: WORK_ITEM_COMPONENT_OBJECT
    })
    objectInfo;
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
            this.optionData = data.values;
            this.options = data.values;
            this.showOptions();
            this.showDropdown = false;
            this.devOrgData();
          //  console.log('  this.searchString = null>>>>  ',   this.searchString);
            this.addNewRowDevOrgData();
        } else if (error) {
            console.log(error);
        }
    }

    devOrgData() {
        if (this.selectdataforaddrowdevorg != undefined  && this.isEditMode) {
            this.commonSelectedValuesFunctionForDevOrg(this.selectdataforaddrowdevorg);
        }
    }

    @wire(getObjectInfo, {
        objectApiName: WORK_ITEM_COMPONENT_OBJECT
    })
    objectInfo;
    //fetch picklist options
    @wire(getPicklistValues, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        fieldApiName: CURRENT_ENVRMNT
    })
    wirePickListcn({
        error,
        data
    }) {
        if (data) {
            this.optionDatacn = data.values;
            this.optionscn = data.values;
            this.showOptionscn();
            this.showDropdowncn = false;
            this.currentEnvrmntData();
            this.addNewRowcurrentEnvrmntData();
        } else if (error) {
            console.log(error);
        }
    }

    currentEnvrmntData() {
        if (this.selectdataforaddrowcrrntenvrmnt != undefined  && this.isEditMode) {
            this.commonSelectedValuesFunctionForEnvrmntValue(this.selectdataforaddrowcrrntenvrmnt);
        }
    }

    selectItem(event) {
        if (this.clearValueCount == 0) {
            this.clearAll();
        }
        if (this.rowid != this.oldrowid) {
            this.values = [];
        }
        this.oldrowid = this.rowid;
        let selectedVal = event.currentTarget.dataset.id;
        if (selectedVal) {
            let count = 0;
            let options = JSON.parse(JSON.stringify(this.optionData));
            for (let i = 0; i < options.length; i++) {
                options[i].isEditMode = this.isEditMode;
                if (options[i].value === selectedVal) {
                    if (!this.values.includes(options[i].value)) {
                        this.values.push(options[i].value);
                    }
                    options[i].selected = options[i].selected ? false : true;

                    if (!options[i].selected) {
                        this.values.splice(this.values.indexOf(options[i].value), 1);
                    }
                }
                if (options[i].selected) {
                    count++;
                }
            }
         //   this.searchString = count + ' Option(s) Selected';
            this.optionData = options;
            this.clearValueCount++;
            let ev = new CustomEvent('selectoption', {
                detail: {
                    value: this.values,
                    rowid: this.rowid,
                    workitemcomid: this.workitemcomid
                }
            });
            this.dispatchEvent(ev);
            event.preventDefault();
        }
    }

    selectItemcn(event) {
        if (this.clearValueCountcn == 0) {
            this.clearAllcn();
        }
        if (this.rowidcn != this.oldrowidcn) {
            this.valuescn = [];
        }
        this.oldrowidcn = this.rowidcn;
        var selectedValcn = event.currentTarget.dataset.id;
        if (selectedValcn) {
            var countcn = 0;
            var optionscn = JSON.parse(JSON.stringify(this.optionDatacn));
            for (var i = 0; i < optionscn.length; i++) {
                if (optionscn[i].value === selectedValcn) {
                    if (!this.valuescn.includes(optionscn[i].value)) {
                        this.valuescn.push(optionscn[i].value);
                    }
                    optionscn[i].selected = optionscn[i].selected ? false : true;
                    if (!optionscn[i].selected) {
                        this.valuescn.splice(this.valuescn.indexOf(optionscn[i].value), 1);
                    }
                }
                if (optionscn[i].selected) {
                    countcn++;
                }
            }
            this.optionDatacn = optionscn;
         //   this.searchStringcn = countcn + ' Option(s) Selected';
            this.clearValueCountcn++;
            let evcn = new CustomEvent('selectoptioncn', {
                detail: {
                    valuescn: this.valuescn,
                    rowidcn: this.rowidcn,
                    workitemcomidcn: this.workitemcomidcn
                }
            });
            this.dispatchEvent(evcn);
            event.preventDefault();
        }
    }

    showOptions() {
        if (this.disabled == false && this.options) {
            this.noResultMessage = '';
            var options = JSON.parse(JSON.stringify(this.optionData));
            for (var i = 0; i < options.length; i++) {
                options[i].isVisible = true;
            }
            if (options.length > 0) {
                this.showDropdown = true;
            }
            this.optionData = options;
        }
    }

    showOptionscn() {
        if (this.disabled == false && this.optionscn) {
            this.noResultMessagecn = '';
            var optionscn = JSON.parse(JSON.stringify(this.optionDatacn));
            for (var i = 0; i < optionscn.length; i++) {
                optionscn[i].isVisible = true;
            }
            if (optionscn.length > 0) {
                this.showDropdowncn = true;
            }
            this.optionDatacn = optionscn;
        }
    }

    @api clearAll() {
        var optionData = this.optionData;
        for (var i = 0; i < optionData.length; i++) {
            optionData[i].selected = false;
        }
        this.selectedValues = [];
        this.optionData = optionData;
    }

    @api clearAllcn() {
        var optionDatacn = this.optionDatacn;
        for (var i = 0; i < optionDatacn.length; i++) {
            optionDatacn[i].selected = false;
        }
        this.selectedValuescn = [];
        this.optionDatacn = optionDatacn;
    }

    handleBlur() {
        var previousLabel;
        for (var i = 0; i < this.optionData.length; i++) {
            if (this.optionData[i].value === this.value) {
                previousLabel = this.optionData[i].label;
            }
        }
        this.showDropdown = false;
    }

    handleBlurcn() {
        var previousLabelcn;
        for (var i = 0; i < this.optionDatacn.length; i++) {
            if (this.optionDatacn[i].value === this.value) {
                previousLabelcn = this.optionDatacn[i].label;
            }
        }
        this.showDropdowncn = false;
    }

    handleMouseOut() {
    }

    handleMouseOutcn() {
    }

    addNewRowcurrentEnvrmntData() {
        if (this.selectedValuescn.length>0 && !this.isEditMode) {
            this.commonSelectedValuesFunctionForEnvrmntValue(this.selectedValuescn);
        }
    }

    addNewRowDevOrgData() {
        if (this.selectedValues.length>0 && !this.isEditMode) {
               this.commonSelectedValuesFunctionForDevOrg(this.selectedValues);
           }
    }

    commonSelectedValuesFunctionForDevOrg(DevOrg){
        let selectedVal = DevOrg.toString().split(',');
               let options = JSON.parse(JSON.stringify(this.optionData));
               for (let j = 0; j < selectedVal.length; j++) {
                   for (let i = 0; i < options.length; i++) {
                       options[i].isEditMode = this.isEditMode;
                       if (options[i].value === selectedVal[j]) {
                           if (!this.values.includes(options[i].value)) {
                               this.values.push(options[i].value);
                           }
                           options[i].selected = options[i].selected ? false : true;
                           if (!options[i].selected) {
                               this.values.splice(this.values.indexOf(options[i].value), 1);
                           }
                       }
                   }
                 //  this.searchString = selectedVal.length + ' Option(s) Selected';
                   this.optionData = options;
                   let ev = new CustomEvent('selectoption', {
                       detail: {
                           value: this.values,
                           rowid: this.rowid,
                           workitemcomid: this.workitemcomid
                       }
                   });
                   this.dispatchEvent(ev);
               }
    }

    commonSelectedValuesFunctionForEnvrmntValue(CurrntEnvrmnt){
        let selectedVal = CurrntEnvrmnt.toString().split(',');
            let options = JSON.parse(JSON.stringify(this.optionDatacn));
            for (let j = 0; j < selectedVal.length; j++) {
                for (let i = 0; i < options.length; i++) {
                    options[i].isEditMode = this.isEditMode;
                    if (options[i].value === selectedVal[j]) {
                        if (!this.valuescn.includes(options[i].value)) {
                            this.valuescn.push(options[i].value);
                        }
                        options[i].selected = options[i].selected ? false : true;
                        if (!options[i].selected) {
                            this.valuescn.splice(this.valuescn.indexOf(options[i].value), 1);
                        }
                    }
                }
               // this.searchStringcn = selectedVal.length + ' Option(s) Selected';
                this.optionDatacn = options;
                let ev = new CustomEvent('selectoptioncn', {
                    detail: {
                        valuescn: this.valuescn,
                        rowidcn: this.rowidcn,
                        workitemcomidcn: this.workitemcomidcn
                    }
                });
                this.dispatchEvent(ev);
                //    event.preventDefault();
            }
    }
}