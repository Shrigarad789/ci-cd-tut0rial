import { LightningElement,api } from 'lwc';

export default class Pagination extends LightningElement {
    @api records;
    totalRecords;
    recordSize = 10;
    visibleRecords ;
    @api currentPage = 1;
    totalPage;
    @api reArrangePageSize = 1;
    //getter recrods
    get records(){
        return this.visibleRecords;
    }
    //setter records
    set records(data){
        if(data){
            this.totalRecords = data;
            this.totalPage = Math.ceil(data.length/this.recordSize);
            this.updateRecords();
        }
    }
    //go to next from the current page 
    gotoNext(){
       if(this.currentPage < this.totalPage){
            this.currentPage = this.currentPage + 1;
            this.updateRecords();
       } 
    }
    //go to previous page from the current page
    gotoPrevious(){
        if(this.currentPage > 1){
            this.currentPage = this.currentPage - 1;
            this.updateRecords();
        }
    }
    //go to first page fo the list
    gotoFirst(){
        this.currentPage = 1;
        this.updateRecords();
    }
    //go to last page of the list
    gotoLast(){
        this.currentPage =  this.totalPage;
        this.updateRecords();
    }
    //got to page number 
    gotoPageNumber(event){
        // Press Enter Key Then Execute If Condition
        if(event.which == 13 && event.currentTarget.value){
            if(event.currentTarget.value > 0 && event.currentTarget.value <= this.totalPage){
                this.currentPage = parseInt(event.currentTarget.value);
                this.updateRecords();
            }
        }
    }
    @api reArrangeWorkItemComRecords(){
        this.totalPage = Math.ceil(this.totalRecords.length/this.recordSize);
        if(this.currentPage > 1 && this.currentPage > this.totalPage){
            this.currentPage = this.currentPage - 1;
            this.updateRecords();
        }else{
            this.updateRecords();
        }
    }
    //pass the visible records to the parent component
    updateRecords(){
        const start = (this.currentPage-1)*this.recordSize;
        const end = this.recordSize * this.currentPage;
        this.visibleRecords = this.totalRecords.slice(start,end);
        this.dispatchEvent( new CustomEvent('update',{
            detail:{
                records : this.visibleRecords
            }
        }))
    }
    get firstButton(){
        return (this.currentPage == 1);
    }
    get previousButton(){
        return (this.currentPage == 1);
    }
    get nextButton(){
        return (this.currentPage == this.totalPage);
    }
    get lastButton(){
        return (this.currentPage == this.totalPage);
    }
}