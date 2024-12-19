import { LightningElement, wire, api, track } from 'lwc';
import fetchContacts from '@salesforce/apex/contactPaginationLwcCtrl.fetchContacts';
import serachAccs from '@salesforce/apex/contactPaginationLwcCtrl.retriveAccs';
import { NavigationMixin } from "lightning/navigation";
const columns = [
    {
        label: 'Order Number',
        fieldName: 'Order_Number__c'

    },
    {
        label: 'Name',
        fieldName: 'Name'

    }, {
        label: 'Email',
                fieldName: 'Email',
    }, {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
    }, {
        label: 'Title',
        fieldName: 'Title',
        type: 'text'
    },
    {
        
        type: "button",
        typeAttributes: {
            label: "View",
            name: "gotoOpportunity",
            variant: "success"
        }
    }
];

export default class ContactDatatableWithPreviousNextButton extends NavigationMixin(LightningElement) {
    pageSizeOptions = [ 10, 20, 30, 40, 50]; //Page size options
    records = []; //All records available in the data table
    columns = []; //columns information available in the data table
    totalRecords = 0; //Total no.of records
    pageSize; //No.of records to be displayed per page
    totalPages; //Total no.of pages
    pageNumber = 1; //Page number    
    recordsToDisplay = []; //Records to be displayed on the page
    
    get bDisableFirst() {
        return this.pageNumber == 1;
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }
    // connectedCallback method called when the element is inserted into a document
    connectedCallback() {
        // set datatable columns info
        this.columns = [
            {
                label: 'Order Number',
                fieldName: 'Order_Number__c'
        
            },{
                label: 'Name',
                fieldName: 'Name'
            },
            {
                label: 'Email',
                fieldName: 'Email'
            },
            {
                label: 'Phone',
                fieldName: 'Phone'
            },
            {
                label: 'Title',
                fieldName: 'Title'
            },
            {
        
                type: "button",
                typeAttributes: {
                    label: "View",
                    name: "gotoOpportunity",
                    variant: "success"
                }
            }
        ];
        // fetch contact records from apex method 
        fetchContacts()
            .then((result) => {
                if (result != null) {
                    console.log('RESULT--> ' + JSON.stringify(result));
                    this.records = result;
                    this.totalRecords = result.length; // update total records count                 
                    this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
                    this.paginationHelper(); // call helper menthod to update pagination logic 
                }
            })
            .catch((error) => {
                console.log('error while fetch contacts--> ' + JSON.stringify(error));
            });
    }
    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
    // JS function to handel pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }
    }
    // searchData;
    columns = columns;
    errorMsg = '';
    strSearchAccName = '';
    

    handleAccountName(event) {
        this.errorMsg = '';
        this.strSearchAccName = event.currentTarget.value;
    }

    handleSearch() {
        if(!this.strSearchAccName) {
            this.errorMsg = 'Please enter account name to search.';
            this.recordsToDisplay = undefined;
            return;
        }

        serachAccs({strAccName : this.strSearchAccName})
        .then(result => {
            this.recordsToDisplay = result;
        })
        .catch(error => {
            this.recordsToDisplay = undefined;
            if(error) {
                if (Array.isArray(error.body)) {
                    this.errorMsg = error.body.map(e => e.message).join(', ');
                } else if (typeof error.body.message === 'string') {
                    this.errorMsg = error.body.message;
                }
            }
        }) 
    }
    handleRowAction(event) {
        if (event.detail.action.name === "gotoOpportunity") {
            this[NavigationMixin.GenerateUrl]({
                type: "standard__recordPage",
                attributes: {
                    recordId: event.detail.row.Id,
                    actionName: "view"
                }
            }).then((url) => {
                window.open(url, "_blank");
            });
        }
    }
}