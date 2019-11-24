//creating a object for Parcel, with constructor
const Parcel = class {
    constructor(trackingNumber, status, destination, weight, express) {
        this.trackingNumber = trackingNumber;
        this.status = status;
        this.destination = destination;
        this.weight = parseFloat(weight);
        this.express = express;
    }
}

//creating an array to store the parcel objects
var parcels = [];

//declare constants
const NEW_PARCEL_STATUS = "Processing";
const SHIPPING_FLAT_RATE = 5;
const SHIPPING_EXPRESS_ADD = 10;
const SHIPPING_PER_WEIGHT = 0.05;
const TAX = 0.13;

//populate parcel arrays with initial parcels
var parcelStatus = ["Processing","Shipped","In Transit","Delivered"];
var parcelDestination = ["Ontario","Alberta","Manitoba","Quebec"];
var parcelWeight = [12,34,56,78];
var parcelExpress = [true,true,false,false];

console.log("status length=",parcelStatus.length);
for ( let i=0 ; i<parcelStatus.length; i++ ){
    parcels.push( new Parcel (generateUniqueTrackingNumber(),parcelStatus[i],parcelDestination[i],parcelWeight[i],parcelExpress[i]));    
}
console.log("parcels=",parcels);

/*
    createParcel()
    Purpose: Create a new parcel
    Parameters: get from page form
    Returns: none
*/

    function createParcel(){
        //assign create parcel form elements to variables
        var parcelDestinationSelection = document.getElementById("createParcel_Destination");
        var parcelWeightInput = document.getElementById("createParcel_Weight");
        var parcelExpressCheckbox = document.getElementById("createParcel_expressShipping");
        var createParcelButton = document.getElementById("createParcelButton");

        var destination = parcelDestinationSelection.value;
        console.log("destination=",destination);
        //validate weight input as a number, even if is a number input type
        //the validation is made by a function
        var weight = validNumberAboveZero(parcelWeightInput.value) ? parcelWeightInput.value : null;
        //if number is not valid, respond to user with field and button changes
        if(!weight){
            parcelWeightInput.value="0";
            parcelWeightInput.className = "errorMessageInput";
            parcelWeightInput.disabled = true;
            createParcelButton.value = "Weight is invalid";
            createParcelButton.className = "errorMessageButton";
            createParcelButton.disabled = true;
            console.log("weight had not a valid input");
            setTimeout(()=>{
                parcelWeightInput.value="0";
                parcelWeightInput.className = "normalInput";
                parcelWeightInput.disabled = false;
                createParcelButton.value = "Create Parcel";
                createParcelButton.className = "createParcelButton";
                createParcelButton.disabled = false;
            },2000);
            return false;
        }
        weight = parseFloat(+weight);
        console.log("weight=",weight);

        //if weight is valid, proceed

        //collect if parcel is express or not
        //if checked, the expression below returns true
        //if not, return flase
        var express = parcelExpressCheckbox.checked;
        console.log("express = ", express);

        //create another unique tracking number
        var newTrackingNumber = generateUniqueTrackingNumber();//this function users the generate
        console.log("new tracking number = ", newTrackingNumber);

        //create new instance of Parcel and push to parcels array
        parcels.push( new Parcel( newTrackingNumber, NEW_PARCEL_STATUS, destination, weight, express ));
        console.log(parcels);

        //clear create parcel forms and display updated list of parcels
        clearCreateParcels();
        displayParcels();

    } // end of function createParcel()

/*
    processParcel()
    Purpose: process a parcel, change its status and give information about price
    Parameters: get from page form
    Returns: none
*/
    function processParcel(){
        
        //gets the value from textbox
        var trackingNumberElement = document.getElementById("tbTrackingNumber");
        var trackingNumber = trackingNumberElement.value;
        //gets status from dropdown
        var trackingStatusSelection = document.getElementById("processParcel_Status");
        var trackingStatus = trackingStatusSelection.value;

        //verify validity of trackingNumber
        if(!textInputValidated(trackingNumber)){
            //error message to user
            throwProcessParcelErrorToUser("Tracking Number Invalid!");
            return false;
        }

        //search the parcel that matches the code inputed by user
        //if found, returns the real object of the parcel inside the array
        var parcelFound = parcels.find((parcel)=>parcel.trackingNumber.toLowerCase()===trackingNumber.toLowerCase());
        console.log("parcel found=",parcelFound);
        //if no parcel is found, display an error to user
        if(parcelFound===undefined){
            throwProcessParcelErrorToUser("Tracking Number Not Found!");
            return false;
        }

        //assign new status to the parcel found
        //this instance is the same object that is at the array parcels
        //so any change here is at the object itself
        parcelFound.status = trackingStatus;

        console.log("parcels after the status change:", parcels);

        //update the parcels list
        displayParcels();

        //calculate the shipping cost for the parcel
        var totalShippingCost = 0;
        totalShippingCost += SHIPPING_FLAT_RATE;
        if(parcelFound.express){
            totalShippingCost += SHIPPING_EXPRESS_ADD;
        }
        totalShippingCost += SHIPPING_PER_WEIGHT * +parcelFound.weight;

        //apply tax
        totalShippingCost *= 1 + +TAX;//the '+' garantees TAX will be considered as numeric

        //alert parcel processing for the user
        var alertMessage = `Shipping for parcel: ${parcelFound.trackingNumber}\n$${totalShippingCost.toFixed(2)}`;
        document.getElementById("processParcelMessage").innerHTML=alertMessage.replace("\n"," is ");
        document.getElementById("processParcelMessage").style.color = "green";
        document.getElementById("processParcelMessage").style.display = "inline";
        
        alert(alertMessage);

        //after 2 seconds, erase the message to user in the form
        setTimeout(()=>{
            document.getElementById("processParcelMessage").innerHTML="";
        },2000)

        //clear process parcels form
        clearProcessParcels();

    } // end of function processParcel()
/*
    validNumberAboveZero()
    Purpose: verify if the number is valid, is a number, and is greater then zero
    Parameters: number in input
    Returns: true if number is valid, false if invalid
*/
    function validNumberAboveZero(inputNumber){
        inputNumber = inputNumber.replace(/\s+/,"");
        inputNumber = inputNumber.replace(/\,+/,".");
        if(isNaN(parseFloat(+inputNumber))){
            return false;
        }
        if(parseFloat(+inputNumber)<=0){
            return false;
        }
        return true;
    }

/*
    generateTrackingNumber()
    Purpose: Helper function - generates a random tracking number
    Parameters: none
    Returns: string
*/
    function generateTrackingNumber()
    {
        const TN_LENGTH = 10;
        const TN_PREFIX = "IWD";
        var tokens = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0'];
        var trackingNumber = new String(TN_PREFIX);
        for(var x = 0; x < TN_LENGTH; x++) {
            trackingNumber = trackingNumber.concat( tokens[ Math.floor( Math.random() * tokens.length ) ] );
        }
        console.log("Generated: " + trackingNumber);
        return trackingNumber;
    } // end generateTrackingNumber

/*
    generateUniqueTrackingNumber()
    Purpose: Helper function - uses generateTrackingNumber to generate a unique tracking number in parcels array
    Parameters: none
    Returns: string
*/
    function generateUniqueTrackingNumber(){
        //generate random tracking numbers
        //until it is one that does not exist
        //in the parcels array yet
        var newTrackingNumber;
        do{
            newTrackingNumber = generateTrackingNumber();
        } while( parcels.find( ({ trackingNumber })=>trackingNumber===newTrackingNumber) );
        return newTrackingNumber;
    } //end of generateUniqueTrackingNumber

/*
    clearCreateParcels()
    Purpose: Helper function - clear create parcels form
    Parameters: none
    Returns: none
*/
    function clearCreateParcels(){
        var parcelDestinationSelection = document.getElementById("createParcel_Destination");
        var parcelWeightInput = document.getElementById("createParcel_Weight");
        var parcelExpressCheckbox = document.getElementById("createParcel_expressShipping");

        parcelDestinationSelection.selectedIndex = 0;
        parcelWeightInput.value = 0;
        parcelExpressCheckbox.checked = false;
    }

/*
    clearProcessParcels()
    Purpose: Helper function - clear process parcels form
    Parameters: none
    Returns: none
*/
    function clearProcessParcels(){
        let trackingNumberElement = document.getElementById("tbTrackingNumber");
        let trackingStatusSelection = document.getElementById("processParcel_Status");

        trackingNumberElement.value = "";
        trackingStatusSelection.selectedIndex = 0;

    }

/*
    displayParcels()
    Purpose: Helper function - update parcels list with attributes at the page designated area
    Parameters: none
    Returns: none
*/
    function displayParcels(){
        //declare and clear the output are for parcels
        var displayParcelOutput = document.getElementById("displayParcelOutput");
        document.getElementById("formerParcelsHeader").innerHTML = "";
        displayParcelOutput.innerHTML = ""; 
        //build the header for the table
        displayParcelOutput.appendChild(buildParcelsListHeaderMarkup());

        //verify the value of the filter
        var displayParcelsFilter = document.getElementById("displayParcelsFilter");
        var statusFilter = displayParcelsFilter.value;
        
        console.log("statusFilter = ", statusFilter);
        console.log("parcels before filtering:",parcels);
        
        //generate a filtered version of the parcels array if different from All
        //if controlBox is "all" just clone the parcels array
        var parcelsFiltered = statusFilter=="All" ? parcels.slice(0) : parcels.filter((parcel)=>parcel.status===statusFilter);
        console.log("parcelsFiltered:",parcelsFiltered);

        //build parcels rows and append to parcels container (the table)
        var parcelsContainer = document.getElementById("parcelsContainer");
        parcelsFiltered.forEach((parcel)=>{
            let row = buildParcelsListRowMarkup(parcel);
            parcelsContainer.append(row);
        });
    }

/*
    buildParcelsListHeaderMarkup()
    Purpose: Helper function - builds the header of the parcels table
    Parameters: none
    Returns: html element of the parcels container and table header
*/
    function buildParcelsListHeaderMarkup(){
        var tableContainer = document.createElement("div");
        tableContainer.id = "parcelsContainer";
        
        var header = document.createElement("div");
        header.className = "parcelsRow parcelsHeader";
        
        var trackingNumberColumn = document.createElement("div");
        trackingNumberColumn.className= "parcelsTrackingNumber parcelsColumn";
        trackingNumberColumn.innerHTML = "TRACKING NUMBER";
        
        var statusColumn = document.createElement("div");
        statusColumn.className = "parcelsStatus parcelsColumn";
        statusColumn.innerHTML = "STATUS";
        
        var destinationColumn = document.createElement("div");
        destinationColumn.className = "parcelDestination parcelsColumn";
        destinationColumn.innerHTML = "DESTINATION";
        
        var weightColumn = document.createElement("div");
        weightColumn.className = "parcelWeight parcelsColumn";
        weightColumn.innerHTML = "WEIGHT(g)";
        
        var expressColumn = document.createElement("div");
        expressColumn.className = "parcelExpress parcelsColumn";
        expressColumn.innerHTML = "EXPRESS";
        
        header.appendChild(trackingNumberColumn);
        header.appendChild(statusColumn);
        header.appendChild(destinationColumn);
        header.appendChild(weightColumn);
        header.appendChild(expressColumn);
        
        tableContainer.appendChild(header);
        
        return tableContainer;
    }

/*
    buildParcelsListRowMarkup()
    Purpose: Helper function - builds a row with the parcel information
    Parameters: parcel object
    Returns: html element of a row with the parcel inputed
*/
    function buildParcelsListRowMarkup(parcel){
        var row = document.createElement("div");
        row.className = "parcelsRow";

        var trackingNumberColumn = document.createElement("div");
        trackingNumberColumn.className= "parcelsTrackingNumber parcelsColumn";
        trackingNumberColumn.innerHTML = parcel.trackingNumber;

        var statusColumn = document.createElement("div");
        statusColumn.className = "parcelsStatus parcelsColumn";
        //attribute a different class to the status column according to the status
        switch(parcel.status){
            
            case "Processing":
                statusColumn.className += " statusProcessing";
            break;
            
            case "Shipped":
                statusColumn.className += " statusShipped";
            break;

            case "In Transit":
                statusColumn.className += " statusInTransit";
            break;

            case "Delivered":
                statusColumn.className += " statusDelivered";
            break;
        }
        statusColumn.innerHTML = parcel.status;

        var destinationColumn = document.createElement("div");
        destinationColumn.className = "parcelDestination parcelsColumn";
        destinationColumn.innerHTML = parcel.destination;

        var weightColumn = document.createElement("div");
        weightColumn.className = "parcelWeight parcelsColumn";
        weightColumn.innerHTML = parcel.weight;

        var expressColumn = document.createElement("div");
        expressColumn.className = "parcelExpress parcelsColumn";
        expressColumn.innerHTML = parcel.express;

        row.appendChild(trackingNumberColumn);
        row.appendChild(statusColumn);
        row.appendChild(destinationColumn);
        row.appendChild(weightColumn);
        row.appendChild(expressColumn);

        return row;
    }

/*
    textInputValidated()
    Purpose: Helper function - validate text input for tracking number
    Parameters: text inputed 
    Returns: true if text is valid, false if is invalid
*/
    function textInputValidated(textInput){
        //strip spaces
        textInput = textInput.replace(/\s+/g,"");
        //test whether there is contents in the string
        if(textInput == "" || textInput == null || textInput == undefined){
            return false;
        }
        //test if there is non-characters in the string
        if(textInput.match(/\W+/gi)){
            return false;
        }
        return true;
    }

/*
    throwProcessParcelErrorToUser()
    Purpose: Helper function - throw process parcel error to user
    Parameters: message to go to user 
    Returns: none
*/
    function throwProcessParcelErrorToUser(message){

        let processParcelButton = document.getElementById("processParcelButton");
        let trackingNumberElement = document.getElementById("tbTrackingNumber");
        let trackingStatusSelection = document.getElementById("processParcel_Status");                       
            processParcelButton.style.backgroundColor = "red";
            processParcelButton.style.color = "white";
            processParcelButton.value = message;
            processParcelButton.disabled = true;
            trackingNumberElement.style.backgroundColor = "red";
            trackingNumberElement.style.color = "white";
            trackingNumberElement.disabled = true;
            trackingStatusSelection.style.backgroundColor = "red";
            trackingStatusSelection.style.color = "white";
            trackingStatusSelection.disabled = true;
            console.log("tracking number had not a valid value");
            //after 2 seconds the message disapears
            setTimeout(()=>{
                processParcelButton.style.backgroundColor = "white";
                processParcelButton.style.color = "black";
                processParcelButton.value = "Process Parcel";
                processParcelButton.disabled = false;
                trackingNumberElement.style.backgroundColor = "white";
                trackingNumberElement.style.color = "black";
                trackingNumberElement.value = "";
                trackingNumberElement.disabled = false;
                trackingStatusSelection.style.backgroundColor = "white";
                trackingStatusSelection.style.color = "black";
                trackingStatusSelection.selectedIndex = 0;
                trackingStatusSelection.disabled = false;
            },2000);

    }//throwProcessParcelErrorToUser
