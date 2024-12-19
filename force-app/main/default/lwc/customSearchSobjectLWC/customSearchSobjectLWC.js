import { LightningElement,wire } from 'lwc';
import fetchData from '@salesforce/apex/customSearchSobjectLWC.fetchData';
const columns = [

    { label: 'Name', fieldName: 'Name', type: 'text' }

    

];

export default class CustomSearchSobjectLWC extends LightningElement {
    searchTerm = '';        // Holds the user's search input

    data = [];              // Holds the fetched data from the Apex controller

    filteredData = [];      // Holds the data after applying the search filter

    delayTimeout;           // Used for debouncing the search input

    // Wire the fetchData method to retrieve data from the Apex controller

    @wire(fetchData)

    wiredData({ error, data }) {

        if (data) {

            this.data = data;

            this.filterData();  // Filter data when fetched

        } else if (error) {

            console.error('Error loading data: ', error);

        }

    }

    // Getter method for columns

    get columns() {

        return columns;

    }

    // Event handler for search input change

    handleSearchChange(event) {

        this.searchTerm = event.target.value;

        this.debounceFilter();   // Debounce to delay filtering for better performance

    }

    // Debouncing function to delay filter invocation

    debounceFilter() {

        clearTimeout(this.delayTimeout);

        this.delayTimeout = setTimeout(() => {

            this.filterData();

        }, 300);

    }

    // Filtering function based on the search term

    filterData() {

        this.filteredData = this.data.filter(record =>

            // Case-insensitive search for Name and Email fields

            Object.values(record).some(value =>

                value.toLowerCase().includes(this.searchTerm.toLowerCase())

            )

        );

    }
}