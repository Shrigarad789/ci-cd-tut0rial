import { LightningElement,wire,track ,api} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOppTeamList  from '@salesforce/apex/TeamMemberViewController.getOppTeamList';
import initRecords from '@salesforce/apex/TeamMemberViewController.initRecords';
import getTeamMemberOppTeamList from '@salesforce/apex/TeamMemberViewController.getTeamMemberOppTeamList';

const DELAY = 300;

export default class OpprtunityTeamMemberView extends LightningElement {
    @track oppTeamList;
    @track oppMemberTeamList;
    @track columns;
    @api refreshTable;
    @track columns ;

    //My Opportunity Count
    @track startingRecord = 1;
    @track endingRecord = 0;
    @track totalRecountCount = 0;
    @track page = 1;
    @track totalPage = 0;
    @api items;
    @track pageSize = 100;

    //My  Opportunity Count
    @track temsStartingRecord = 1;
    @track temsEndingRecord = 0;
    @track temsTotalRecountCount = 0;
    @track temsPage = 1;
    @track temsTotalPage = 0;
    @api temsItems;
    @track temsPageSize = 100;
    
    
    
    sortDirection = 'asc';
    sortBy = 'Name';
    objectName = 'Opportunity';

    @wire(initRecords, {ObjectName :'Opportunity'})
    wiredSobjects(result) {
        this.wiredsObjectData = result;
        if (result.data) {
            this.columns = result.data.ldwList;
        }
    }

    @track COLS = [
        { label: 'First Name', fieldName: 'FirstName', editable: true },
        { label: 'Last Name', fieldName: 'LastName', editable: true },
        { label: 'Title', fieldName: 'Title' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'Email', fieldName: 'Email', type: 'email' }
    ];

    @wire(getOppTeamList,{ ObjectName: 'Opportunity',sortByFieldName:'$sortBy',sortOrder:'$sortDirection'}) 
    contacts(result){
        if (result.data) {

            this.refreshTable = result.data;
            let baseUrl = 'https://'+location.host+'/';
            this.items = result.data.map(row => ({ ...row,"RecordTypeName":row.RecordType.Name,"Top_Opportunity": true,"NameURL":baseUrl+row.Id}))

            //this.oppTeamList = this.items;
            this.totalRecountCount = result.data.length;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.oppTeamList = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            if(this.totalPage == 1){
                this.disableNext = true;
                this.disablePrevious = true;
            }
            if(this.page == 1){
                this.disablePrevious = true;
            }
        } 
    }

     @wire(getTeamMemberOppTeamList,{ ObjectName: 'TeamsOpportunity',sortByFieldName:'$sortBy',sortOrder:'$sortDirection'}) 
    teamsOppo(result){
        if (result.data) {

            this.refreshTable = result.data;
            let baseUrl = 'https://'+location.host+'/';
            this.temsItems = result.data.map(row => ({ ...row,"RecordTypeName":row.RecordType.Name,"Top_Opportunity": true,"NameURL":baseUrl+row.Id}))

            //this.oppTeamList = this.items;
            this.temsTotalRecountCount = result.data.length;
            this.temsTotalPage = Math.ceil(this.temsTotalRecountCount / this.temsPageSize);
            this.oppMemberTeamList = this.temsItems.slice(0,this.temsPageSize); 
            this.temsEndingRecord = this.temsPageSize;
            if(this.temsTotalPage == 1){
                this.disableNext = true;
                this.disablePrevious = true;
            }
            if(this.temsPage == 1){
                this.disablePrevious = true;
            }
        }
    }

    handleRowActions(event) {
        let actionName = event.detail.action.name;
        let row = event.detail.row;
        switch (actionName) {
            case 'view':
                this.viewCurrentRecord(row);
                break;
        }
    }

    viewCurrentRecord(currentRow){
        //window.location.href = window.location.origin+'/'+currentRow.Id;
        window.open(window.location.origin+'/'+currentRow.Id,'_blank');
    }

    onHandleSort(event){
        let fieldName = event.detail.fieldName;
        let sortDirection = event.detail.sortDirection;
        this.sortBy = fieldName;
        this.sortDirection = sortDirection;       
    }

    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1;
            this.displayRecordPerPage(this.page);
        }
        if(this.page == 1){
            this.disablePrevious = true;    
        } 
        if(this.totalPage > 1){
            this.disableNext = false;
        }
    }

    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1;
            this.displayRecordPerPage(this.page);            
        }            
        if(this.page == this.totalPage){
            this.disableNext = true;
        } 
        if(this.page != 1){
            this.disablePrevious = false;
        }
    }

    displayRecordPerPage(page){
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);
        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 
        this.oppTeamList  = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    
    }

    previousHandlerForMembersView(){
        if (this.temsPage > 1) {
            this.temsPage = this.temsPage - 1;
            this.temsDisplayRecordPerPage(this.temsPage);
        }
        if(this.temsPage == 1){
            this.temsDisablePrevious = true;    
        } 
        if(this.temsTotalPage > 1){
            this.temsDisableNext = false;
        }
    }

    nextHandlerForMembersView(){

        if((this.temsPage<this.temsTotalPage) && this.temsPage !== this.temsTotalPage){
            this.temsPage = this.temsPage + 1;
            this.temsDisplayRecordPerPage(this.temsPage);            
        }            
        if(this.temsPage == this.temsTotalPage){
            this.temsDisableNext = true;
        } 
        if(this.temsPage != 1){
            this.temsDisablePrevious = false;
        }
    }

    temsDisplayRecordPerPage(page){

        this.temsStartingRecord = ((page -1) * this.temsPageSize) ;
        this.temsEndingRecord = (this.temsPageSize * page);
        this.temsEndingRecord = (this.temsEndingRecord > this.temsTotalRecountCount) 
                            ? this.temsTotalRecountCount : this.temsEndingRecord; 
        this.oppMemberTeamList  = this.temsItems.slice(this.temsStartingRecord, this.temsEndingRecord);
        this.temsStartingRecord = this.temsStartingRecord + 1;
    }

    
}