import { MessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars'

export default class CarTIleList extends LightningElement {
    cars=[]
    error
    filters = {}
    carFilterSubscription

    @wire(getCars, {filters:'$filters'})
    carsHandler({data, error}){
        if(data)
            this.cars = data
        if(error){
            this.error = error
            console.error(error)
        }   
    }
    
    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.carFilterSubscription = subscribe(this.messageContext, CARS_FILTERED_MESSAGE, (message) => this.handleFilterChanges(message))
    }

    handleFilterChanges(message){
        this.filters = {...message.filters}
    }

    handleCarSelected(event){
        publish(this.messageContext, CAR_SELECTED_MESSAGE, {
            cardId:event.detail
        })
    }

    disconnectedCallback(){
        unsubscribe(this.carFilterSubscription)
        this.carFilterSubscription = null
    }
}