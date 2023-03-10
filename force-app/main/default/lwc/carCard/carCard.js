import { LightningElement, wire } from 'lwc';

import {NavigationMixin} from 'lightning/navigation'

import CAR_OBJECT from '@salesforce/schema/Car__c'
import NAME_FIELD from '@salesforce/schema/Car__c.Name'
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c'
import FUEL_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c'
import SEATS_FIELD from '@salesforce/schema/Car__c.Number_of_Seats__c'
import CONTROL_FIELD from '@salesforce/schema/Car__c'

import { getFieldValue } from 'lightning/uiRecordApi'

import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService'
//import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c'


export default class CarCard extends NavigationMixin(LightningElement) {

    @wire(MessageContext)
    messageContext

    categoryField = CATEGORY_FIELD
    makeField = MAKE_FIELD
    msrpField = MSRP_FIELD
    fuelField = FUEL_FIELD
    seatsField = SEATS_FIELD
    controlField = CONTROL_FIELD

    recordId

    carName
    CarPictureUrl
    
    carSelectionSubiscription

    handleRecordLoaded(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.carName = getFieldValue(recordData, NAME_FIELD)
        this.CarPictureUrl = getFieldValue(recordData, PICTURE_URL_FIELD)
    }

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.carSelectionSubiscription = subscribe(this.messageContext, CAR_SELECTED_MESSAGE,
            (message) => this.handleCarSelected(message))
    }

    handleCarSelected(message){
        this.recordId = message.carId
    }

    disconnectedCallback(){
        unsubscribe(this.carSelectionSubiscription)
        this.carSelectionSubiscription = null
    }

    handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type: 'standard_recordPage',
            attrobites:{
                recordId: this.recordId,
                objectApiName: CAR_OBJECT.objectApiName,
                actionName: 'view'
            }
        })
    }
}