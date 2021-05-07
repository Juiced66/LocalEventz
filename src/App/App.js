import '../index.html';
import '../style.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import appConfig from '../../app.config';
import {LocalEvent} from './LocalEvent'

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

class App {
    refreshBtn
    submitBtn
    centerBtn
    centerMapOnBtn
    editBtn
    editSubmitBtn

    localEventz = []
    eventToEdit
    editMode = false

    map
    mapWindow

    start() { 
        this.initMap()
        this.loadLocalEvents() 
        this.initHtml()           
    }

    
    initHtml() {
       
        this.refreshBtn = document.querySelector( '#refreshBtn' );
        
        this.submitBtn = document.querySelector( '#submitBtn' );

        this.centerBtn = document.querySelector( '#centerBtn' );

        this.centerMapOnBtn = document.querySelector( '#centerMapOnBtn' );

        this.editBtn = document.querySelector( '#editBtn' );

        this.editSubmitBtn = document.querySelector( '#editSubmitBtn' );



        

        this.submitBtn.addEventListener( 'click', this.onBtnSubmitClick.bind(this) )
        this.refreshBtn.addEventListener( 'click', this.onBtnRefreshClick.bind(this) )
        this.centerBtn.addEventListener( 'click', this.onDefaultViewBbtnClick.bind(this) )
        this.centerMapOnBtn.addEventListener( 'click', this.onCenterBbtnClick.bind(this) )
        this.centerMapOnBtn.addEventListener( 'click', this.onCenterBbtnClick.bind(this) )
        this.editBtn.addEventListener( 'click', this.onEditBtnClick.bind(this) )
        this.editSubmitBtn.addEventListener( 'click', this.onEditSubmitBtnClick.bind(this) )
        
        this.map.on('click', function(e) {
            let coords = JSON.parse( JSON.stringify(e.lngLat.wrap()))
            document.querySelector( '#LocalEventzLat' ).value = coords.lat
            document.querySelector( '#LocalEventzLng' ).value = coords.lng
        })
        this.mapWindow = document.querySelector( '#mapWindow' );
    }

    initMap()
    {
        mapboxgl.accessToken = 'pk.eyJ1IjoianVpY2VkIiwiYSI6ImNrbmZvZzE2YzJoa3kydm1xbm5sZmlqaTAifQ.QeK6fS0YctX5sVo43xY5DQ';
        this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [2.8002915862068676, 42.621078514065516],
        zoom: 9.5
        });
        this.map.addControl(new mapboxgl.NavigationControl());

    }


    saveLocalEventz(){
        localStorage.setItem( appConfig.localStorage, JSON.stringify( this.localEventz ) )
    }

    loadLocalEvents() {
        const storageContent = localStorage.getItem( appConfig.localStorage );
        if( storageContent === null ) {
            return;
        }
       
        let storedJson;
        
        try {
            storedJson = JSON.parse( storageContent );
        }
        catch( error ) {
            localStorage.removeItem( appConfig.localStorageName );
            return;
        }
        
        for( let i = 0;i< storedJson.length; i++ ) {
            const localEvent = new LocalEvent('');
            localEvent.LocalEventzTitle = storedJson[i].LocalEventzTitle
            localEvent.LocalEventzDescription = storedJson[i].LocalEventzDescription 
            localEvent.LocalEventzType = storedJson[i].LocalEventzType
            localEvent.LocalEventzLat = storedJson[i].LocalEventzLat
            localEvent.LocalEventzLng = storedJson[i].LocalEventzLng
            localEvent.MeetingTime = storedJson[i].MeetingTime
            localEvent.EndOfEvent = storedJson[i].EndOfEvent

            this.localEventz.push( localEvent );
        }
        this.renderLocalEvents()
    }
    onEditBtnClick(){
        this.editMode = !(this.editMode)

        if(this.editMode){ 
            this.editBtn.value = "Annuler l'édition"
            this.mapWindow.classList.remove('hidden')
            this.editBtn.style.background = 'red'
        }
        else{
            this.editBtn.value = "Edition d'événements"
            this.mapWindow.classList.add('hidden')
            this.editBtn.style.background = '#1c89ff'
        }
        
        
    }

    onPinClick(localEvent){
            if(this.editMode === true){
                this.onPinClickEdit(localEvent)
                this.flyToLocalEvent(localEvent)             
            }
            else{
                this.flyToLocalEvent(localEvent)
            }           
    }
    
        onPinClickEdit(localEvent){
            document.querySelector('#mapLocalEventzTitle').value = localEvent.LocalEventzTitle
            document.querySelector('#mapLocalEventzDescription').value = localEvent.LocalEventzDescription
            document.querySelector('#mapLocalEventzType').value = localEvent.LocalEventzType
            document.querySelector('#mapLocalEventzLat').value = localEvent.LocalEventzLat
            document.querySelector('#mapLocalEventzLng').value = localEvent.LocalEventzLng
            document.querySelector('#mapMeetingTime').value = localEvent.MeetingTime
            document.querySelector('#mapEndOfEvent').value = localEvent.EndOfEvent
            this.eventToEdit = localEvent           
        }
        onEditSubmitBtnClick(){
            let isOk = this.verifyNewData('map')
            console.log(this.eventToEdit)
            if(isOk){
                this.eventToEdit.LocalEventzTitle = document.querySelector('#mapLocalEventzTitle').value
                this.eventToEdit.LocalEventzDescription = document.querySelector('#mapLocalEventzDescription').value
                this.eventToEdit.LocalEventzType = document.querySelector('#mapLocalEventzType').value
                this.eventToEdit.LocalEventzLat = document.querySelector('#mapLocalEventzLat').value
                this.eventToEdit.LocalEventzLng = document.querySelector('#mapLocalEventzLng').value
                this.eventToEdit.MeetingTime = document.querySelector('#mapMeetingTime').value
                this.eventToEdit.EndOfEvent = document.querySelector('#mapEndOfEvent').value
                this.saveLocalEventz()
                document.querySelector('#mapLocalEventzTitle').value = ''
                document.querySelector('#mapLocalEventzDescription').value =''
                document.querySelector('#mapLocalEventzType').value = ''
                document.querySelector('#mapLocalEventzLat').value = ''
                document.querySelector('#mapLocalEventzLng').value = ''
                document.querySelector('#mapMeetingTime').value = ''
                document.querySelector('#mapEndOfEvent').value = ''
                this.onEditBtnClick()
                this.clearLocalEvents()
                this.renderLocalEvents()
            }

            
        }
    
    onDefaultViewBbtnClick(){
        this.map.flyTo({
            center: [2.8002915862068676, 42.621078514065516],
            zoom: 9.5
            })
    }
    onCenterBbtnClick(){
        if (document.querySelector( '#LocalEventzLng' ).value !== '' && document.querySelector( '#LocalEventzLat' ).value !== ''){
            this.map.flyTo({
                center: [document.querySelector( '#LocalEventzLng' ).value, document.querySelector( '#LocalEventzLat' ).value],
                zoom : 9.5      
            })
        }
}

    onBtnRefreshClick(){
       this.clearLocalEvents()
       this.renderLocalEvents() 
    }

    onBtnSubmitClick(){   
        let isOk = this.verifyNewData('')
        if(isOk){
            let newEvent = new LocalEvent()
            newEvent.addPin(newEvent.chosePinColor())
            this.localEventz.push(newEvent)
            this.clearLocalEvents()
            this.renderLocalEvents()
            this.saveLocalEventz() 
            this.resetHtml()       
        }
    }
    resetHtml(){
        document.querySelector('#LocalEventzTitle').value = ''
        document.querySelector('#LocalEventzDescription').value =''
        document.querySelector('#LocalEventzType').value = ''
        document.querySelector('#LocalEventzLat').value = ''
        document.querySelector('#LocalEventzLng').value = ''
        document.querySelector('#MeetingTime').value = ''
        document.querySelector('#EndOfEvent').value = ''
    }


    renderLocalEvents() {
        for (let localEvent of this.localEventz){
            localEvent.addPin(localEvent.chosePinColor())
            localEvent.pin.getElement().title = `🔥 ${localEvent.LocalEventzTitle} 📅 ${localEvent.handleDates(localEvent.MeetingTime)} 🔚 ${localEvent.handleDates(localEvent.EndOfEvent)}`;
            localEvent.pin.addTo(this.map)
            localEvent.pin.getElement().addEventListener('click', this.onPinClick.bind(this,localEvent))             
        }

    }

    verifyNewData(prefix){
        
            let hasError = false
            let newTitle = document.querySelector(`#${prefix}LocalEventzTitle`).value.trim()
            if(newTitle === '') {
                hasError = true
                document.querySelector(`#${prefix}LocalEventzTitle`).classList.add( 'error' );
            }

            let newDesc = document.querySelector(`#${prefix}LocalEventzDescription`).value.trim()
            if (newDesc === '' ){
                hasError = true
                document.querySelector(`#${prefix}LocalEventzDescription`).classList.add( 'error' );
            }
            let newType = document.querySelector( `#${prefix}LocalEventzType` ).value
            if (newType === 'concert'|| newType ==='birthday'||newType ==='trip'|| newType ==='culture'||newType ==='projectX'|| newType ==='other' ){
            }else {
                hasError = true
                document.querySelector( `#${prefix}LocalEventzType` ).classList.add( 'error' );
            }
            let newLat = document.querySelector( `#${prefix}LocalEventzLat` ).value
            if (newLat === '' ){
                hasError = true
                document.querySelector( `#${prefix}LocalEventzLat` ).classList.add( 'error' );
            }
            let newLng = document.querySelector( `#${prefix}LocalEventzLng` ).value
            if (newLng === '' ){
                hasError = true
                document.querySelector( `#${prefix}LocalEventzLng` ).classList.add( 'error' );
            }
            let newMeetingTime = document.querySelector( `#${prefix}MeetingTime` ).value
            if (newMeetingTime.split('').length !== 16 ){
                hasError = true
                document.querySelector( `#${prefix}MeetingTime` ).classList.add( 'error' );
            }
            let newEndOfEvent = document.querySelector(`#${prefix}EndOfEvent`).value
            if(Date.parse(newEndOfEvent ) - (Date.parse(newMeetingTime)) < 0){
                hasError = true
                document.querySelector(`#${prefix}EndOfEvent`) .classList.add( 'error' );
            }
            if (newEndOfEvent === '' || newEndOfEvent.split('').length !== 16  ){
                hasError = true
                document.querySelector(`#${prefix}EndOfEvent`) .classList.add( 'error' );
            }
            return !hasError
        
    }
    
    

     clearLocalEvents(){  

        for (let i=0; i<this.localEventz.length ; i++){
            
            this.localEventz[i].pin.remove(this.map)
        }
            
    }
    flyToLocalEvent(localEvent){
        this.map.flyTo({
            center: [localEvent.LocalEventzLng, localEvent.LocalEventzLat],
            zoom : 11.5           
        }) 
    }


}

const instance = new App();

export default instance;