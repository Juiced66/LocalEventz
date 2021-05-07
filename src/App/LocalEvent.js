import app from './App';
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
export class LocalEvent{
    LocalEventzTitle
    LocalEventzDescription 
    LocalEventzType  
    LocalEventzLat = 0
    LocalEventzLng = 0
    MeetingTime
    EndOfEvent
    pin = {}

    domLocalEventzTitle
    domLocalEventzDescription
    domLocalEventzType
    domLocalEventzLat
    domLocalEventzLng
    domMeetingTime
    domEndOfEvent

    domMapLocalEventzTitle
    domMapLocalEventzDescription
    domMapLocalEventzType
    domMapLocalEventzLat
    domMapLocalEventzLng
    domMapMeetingTime
    domMapEndOfEvent
    

    

    constructor(){
        this.domLocalEventzTitle = document.querySelector(`#LocalEventzTitle`)
        this.domMapLocalEventzTitle = document.querySelector('#mapLocalEventzTitle')
        this.domMapLocalEventzTitle.addEventListener( 'focus', this.onErrorRemove.bind(this));
        this.LocalEventzTitle = document.querySelector(`#LocalEventzTitle`).value;
        this.domLocalEventzTitle.addEventListener( 'focus', this.onErrorRemove.bind(this));

        
        this.domLocalEventzDescription = document.querySelector( '#LocalEventzDescription' )
        this.domMapLocalEventzDescription = document.querySelector( '#mapLocalEventzDescription' )
        this.domMapLocalEventzDescription.addEventListener( 'focus', this.onErrorRemove.bind(this));
        this.LocalEventzDescription = document.querySelector( `#LocalEventzDescription` ).value;
        this.domLocalEventzDescription.addEventListener( 'focus', this.onErrorRemove.bind(this));
       
        this.domLocalEventzType = document.querySelector( '#LocalEventzType' )
        this.domMapLocalEventzType = document.querySelector( '#mapLocalEventzType' )
        this.domMapLocalEventzType.addEventListener( 'focus', this.onErrorRemove.bind(this));
        this.LocalEventzType = document.querySelector( `#LocalEventzType`).value;
        this.domLocalEventzType.addEventListener( 'focus', this.onErrorRemove.bind(this));

        this.domLocalEventzLat = document.querySelector( '#LocalEventzLat' )    
        this.domMapLocalEventzLat = document.querySelector( '#mapLocalEventzLat' )  
        this.domMapLocalEventzLat.addEventListener( 'focus', this.onErrorRemove.bind(this));  
        this.LocalEventzLat = document.querySelector( `#LocalEventzLat` ).value;
        this.domLocalEventzLat.addEventListener( 'focus', this.onErrorRemove.bind(this));

        this.domLocalEventzLng = document.querySelector( '#LocalEventzLng' ) 
        this.domMapLocalEventzLng = document.querySelector( '#mapLocalEventzLng' )
        this.domMapLocalEventzLng.addEventListener( 'focus', this.onErrorRemove.bind(this)); 
        this.LocalEventzLng = document.querySelector( `#LocalEventzLng` ).value;
        this.domLocalEventzLng.addEventListener( 'focus', this.onErrorRemove.bind(this));

        this.domMeetingTime = document.querySelector( '#MeetingTime' ) 
        this.domMapMeetingTime = document.querySelector( '#mapMeetingTime' )
        this.domMapMeetingTime.addEventListener( 'focus', this.onErrorRemove.bind(this));
        this.MeetingTime = document.querySelector( `#MeetingTime` ).value;
        this.domMeetingTime.addEventListener( 'focus', this.onErrorRemove.bind(this));

        this.domEndOfEvent = document.querySelector('#EndOfEvent') 
        this.domMapEndOfEvent = document.querySelector('#mapEndOfEvent')
        this.domMapEndOfEvent.addEventListener( 'focus', this.onErrorRemove.bind(this)); 
        this.EndOfEvent = document.querySelector( `#EndOfEvent` ).value;
        this.domEndOfEvent.addEventListener( 'focus', this.onErrorRemove.bind(this));
                  
    }

    addPin(array){
    
        this.pin = new mapboxgl.Marker({color : array[0]});
        if(array[1] !== ''){

        
            this.pin.setLngLat({ lng : this.LocalEventzLng, lat: this.LocalEventzLat})
            .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="popUp">
            <div class="h6">
            ${this.typeOfLocalEvent(this.LocalEventzType)} ${this.LocalEventzTitle} ${this.typeOfLocalEvent(this.LocalEventzType)}
            </div>
            <div class="info">
                <div class="descEvent">
                    <span>Description</span>   
                
                    ${this.LocalEventzDescription}
                </div>
                <div class="fromTo">
                    <span>Dates utiles</span> 
                    Début : ${this.handleDates(this.MeetingTime)} <br>
                    Fin : ${this.handleDates(this.EndOfEvent)}
                </div>
                <div class="bonus">
                    <span>Message</span> 
                    ${array[1]}
                </div>
            </div>
            `))
        } 
        else {
            this.pin.setLngLat({ lng : this.LocalEventzLng, lat: this.LocalEventzLat})
            .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="popUp">
            <div>
            ${this.typeOfLocalEvent(this.LocalEventzType)} ${this.LocalEventzTitle} ${this.typeOfLocalEvent(this.LocalEventzType)}
            </div>
            <div class="info">
                <div class="descEvent">
                    <span>Description</span>   
                
                    ${this.LocalEventzDescription}
                </div>
                <div class="fromTo">
                    <span>Dates utiles</span> 
                    Début : ${this.handleDates(this.MeetingTime)} <br>
                    Fin : ${this.handleDates(this.EndOfEvent)}
                </div>
            </div> `))
        } 

    }
    typeOfLocalEvent(value){
        switch (value){
            case 'concert' : 
                value = '🎶'
                break
            case 'birthday' : 
                value = '🎁'
                break
            case 'trip' : 
                value = '🛫'
                break
            case 'culture' : 
                value = '🎨'
                break
            case 'projectX' : 
                value = '💥'
                break
            case 'other' : 
                value = '❓'
                break
            case '' : 
                value = ''
                break
            default : 
                return
            
         }
        
    return value
    }
    chosePinColor(){
        const green = 'green'
        const yellow = 'yellow'
        const orange = 'orange'
        const red = 'red'
        const day = 1000 * 60 * 60 * 24
        let pColor = ''
        let message = ''
        switch (true){
            case ( Date.now() > Date.parse(this.MeetingTime) )  : 
                pColor = red
                message = 'ℹ️ Dommage vous avez <br> raté  cet evenement ! ℹ️'
                if(Date.parse(this.EndOfEvent) > Date.now()){
                    let remainingTime = this.handleRemainingTimes((Date.parse(this.EndOfEvent) - Date.now()))                  
                    message =`Evénement en cours , temps restant :${remainingTime[0]} jours , ${remainingTime[1]} heures ${remainingTime[2]} minutes ${remainingTime[3]} seconds `
                    pColor = orange
                } 
                break
            case ( (Date.parse(this.MeetingTime) - Date.now()  < (day * 3))) :
                let remainingTime =this.handleRemainingTimes(((Date.parse(this.MeetingTime) - Date.now() ))) 
                message = `L'évènement commence dans ${remainingTime[0]} jours , ${remainingTime[1]} heures ${remainingTime[2]} minutes ${remainingTime[3]} seconds `
            case ( Date.parse(this.MeetingTime) - Date.now()  < (day * 2)) :
                pColor = yellow
                break           
            case (Date.parse(this.MeetingTime) - Date.now()  > (day * 3)) : 
            pColor = green
            break
           
        }
        return [pColor,message]
    }
    handleDates(date){

        date = date.split('T')
        date[0] = date[0].split('-').reverse().join('/')
        date = date.join(' ')
        return date
    }
    handleRemainingTimes(date){
        const day = 1000 * 60 * 60 * 24
        const hour=  day / 24
        const minute = hour / 60
        const second = minute / 60
        let timeRemainingDays = Math.floor(date / day)
        let timeRemainingHours = Math.floor(date % day / hour)
        let timeRemainingMinutes = Math.floor(date  % day % hour / minute)
        let timeRemainingseconds = Math.floor(date % day % hour % minute / second)

        return [timeRemainingDays,timeRemainingHours,timeRemainingMinutes,timeRemainingseconds]

    }
    onErrorRemove( evt ) {
        evt.target.classList.remove( 'error' );
    }

    toJSON(){
        return{
    LocalEventzTitle : this.LocalEventzTitle,
    LocalEventzDescription : this.LocalEventzDescription, 
    LocalEventzType : this.LocalEventzType,
    MeetingTime : this.MeetingTime,
    EndOfEvent : this.EndOfEvent,
    LocalEventzLat :this.LocalEventzLat,
    LocalEventzLng :this.LocalEventzLng,
            }
    }

}
