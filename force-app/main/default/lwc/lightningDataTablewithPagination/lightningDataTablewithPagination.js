import { LightningElement, track, wire } from 'lwc';
import getorder from '@salesforce/apex/OrderDatatable.getEmployeeList';

export default class LightningDataTablewithPagination extends LightningElement {
    @track tiles = []; // Array of all tiles
    @track displayedTiles = []; // Array of tiles to display
    @track currentPage = 1;
    @track pageSize = 8;
    totalRecords = 0;

    connectedCallback() {
        getorder()
            .then(result => {
                this.totalRecords = result.length;
                this.tiles = result.map(item => ({ id: item.Id, label: item.Name,labelsec: item.Order_Number__c })); // Assuming 'Id' and 'Name' fields exist in the result
                this.displayTiles();
            })
            .catch(error => {
                console.error("Error Message", error.body.message);
            });
    }

    displayTiles() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
        this.displayedTiles = this.tiles.slice(startIndex, endIndex);
    }

    get disablePrevious() {
        return this.currentPage === 1;
    }

    get disableNext() {
        return this.currentPage === Math.ceil(this.totalRecords / this.pageSize);
    }

    handlePrevious() {
        if (!this.disablePrevious) {
            this.currentPage--;
            this.displayTiles();
        }
    }

    handleNext() {
        if (!this.disableNext) {
            this.currentPage++;
            this.displayTiles();
        }
    }
}