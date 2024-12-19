import { LightningElement,wire,track,api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOppTeamList  from '@salesforce/apex/TeamMemberViewController.getOppTeamList';
import initRecords from '@salesforce/apex/TeamMemberViewController.initRecords';
import getTeamMemberOppTeamList from '@salesforce/apex/TeamMemberViewController.getTeamMemberOppTeamList';


export default class AccountTeamMemberView extends LightningElement {
    @track atmListData;
    @track columns;
    @api refreshTable;
    @track totalRecountCount = 0;
    @track totalPage = 0;
    @track startingRecord = 1;
    @track endingRecord = 0;
    @track page = 1;
    @track pageSize = 100;
    @api items;

    //Teams
     @track teamsAtmListData;
    @api teamsRefreshTable;
    @track teamsTotalRecountCount = 0;
    @track teamsTotalPage = 0;
    @track teamsStartingRecord = 1;
    @track teamsEndingRecord = 0;
    @track teamsPage = 1;
    @track teamsPageSize = 100;
    @api teamsItems;

    sortDirection = 'asc';
    sortBy = 'Name';
    objectName = 'Account';

    @wire(initRecords, { ObjectName: 'Account' })
    wiredSobjects(result) {
        this.wiredsObjectData = result;
        if (result.data) {
            this.columns = result.data.ldwList;
        }
    }

    @wire(getOppTeamList,{ ObjectName: '$objectName',sortByFieldName:'$sortBy',sortOrder:'$sortDirection'}) 
    contacts(result){
        if (result.data) {
            this.refreshTable = result.data;
            let baseUrl = 'https://'+location.host+'/';
            this.items = result.data.map(row => ({ ...row,"RecordTypeName":row.RecordType.Name,"Top_Customer": true,"NameURL":baseUrl+row.Id}))

            this.totalRecountCount = result.data.length;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.atmListData = this.items.slice(0,this.pageSize); 
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
        this.atmListData  = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
        
    }

    //Tems
    @wire(getTeamMemberOppTeamList,{ ObjectName: 'TeamsAccount',sortByFieldName:'$sortBy',sortOrder:'$sortDirection'}) 
    teamsCustomer(result){
        if (result.data) {
            this.teamsRefreshTable = result.data;
            let baseUrl = 'https://'+location.host+'/';
            this.teamsItems = result.data.map(row => ({ ...row,"RecordTypeName":row.RecordType.Name,"Top_Customer": true,"NameURL":baseUrl+row.Id}))

            this.teamsTotalRecountCount = result.data.length;
            this.teamsTotalPage = Math.ceil(this.teamsTotalRecountCount / this.teamsPageSize);
            this.teamsAtmListData = this.teamsItems.slice(0,this.teamsPageSize); 
            this.teamsEndingRecord = this.teamsPageSize;
            if(this.teamsTotalPage == 1){
                this.temsDisableNext = true;
                this.temsDisablePrevious = true;
            }
            if(this.page == 1){
                this.temsDisablePrevious = true;
            }
        } 
    }

    teamsPreviousHandler(){
        if (this.teamsPage > 1) {
            this.teamsPage = this.teamsPage - 1;
            this.teamsDisplayRecordPerPage(this.teamsPage);
        }
        if(this.teamsPage == 1){
            this.temsDisablePrevious = true;    
        } 
        if(this.teamsTotalPage > 1){
            this.temsDisableNext = false;
        }
    }
    teamsNextHandler(){
        if((this.teamsPage<this.teamsTotalPage) && this.teamsPage !== this.teamsTotalPage){
            this.teamsPage = this.teamsPage + 1;
            this.teamsDisplayRecordPerPage(this.teamsPage);            
        }            
        if(this.teamsPage == this.teamsTotalPage){
            this.temsDisableNext = true;
        } 
        if(this.teamsPage != 1){
            this.temsDisablePrevious = false;
        }
    }

    teamsDisplayRecordPerPage(page){
        this.teamsStartingRecord = ((page -1) * this.teamsPageSize) ;
        this.teamsEndingRecord = (this.teamsPageSize * page);
        this.teamsEndingRecord = (this.teamsEndingRecord > this.teamsTotalRecountCount) 
                            ? this.teamsTotalRecountCount : this.teamsEndingRecord; 
        this.teamsAtmListData  = this.teamsItems.slice(this.teamsStartingRecord, this.teamsEndingRecord);
        this.teamsStartingRecord = this.teamsStartingRecord + 1;
    }
}