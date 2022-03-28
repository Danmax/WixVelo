import wixData from 'wix-data';

let today = new Date
let lastFilterKeyword
let lastFilterlocation
let lastFilterType
let lastFilterDate
let onTime

$w.onReady(function () {
    loadLocations()
    loadTypes()
    loadDates()
    getCurrentCount()
});

function filter(keyword, date, type, location) {
    if (lastFilterKeyword !== keyword || lastFilterDate !== date || lastFilterType !== type || lastFilterlocation !== location) {
        let newFilter = wixData.filter()
        if (keyword) {
            newFilter = newFilter.contains('fullName', keyword)
        }
        if (date) {
            newFilter = newFilter.contains('rDate', date)
        }
        if (type) {
            newFilter = newFilter.contains('assistanceType', type)
        }
        if (location) {
            newFilter = newFilter.contains('location', location)
        }

        $w('#requestAssistance').setFilter(newFilter)
        lastFilterKeyword = keyword
        lastFilterlocation = location
        lastFilterDate = date
        lastFilterType = type
    }
}
async function getCurrentCount() {   
    let count = await $w("#requestAssistance").getTotalCount();
    console.log(count)
    $w('#totalCount').text = count.toString()
}

function loadLocations() {
    wixData.query('RequestAssistance').limit(1000).ascending('location').distinct('location').then((results) => {
        let distinctList = results.items.map(e => { return { label: e, value: e } })
        distinctList.unshift({ 'value': '', 'label': 'All Locations' })
        $w('#optionLocation').options = distinctList
    })
}

function loadTypes() {
    $w('#loading').show()
    wixData.query('RequestAssistance').limit(1000).ascending('assistanceType').distinct('assistanceType').then((results) => {
        let distinctList = results.items.map(e => { return { label: e, value: e } })
        distinctList.unshift({ 'value': 'size' , 'label': 'Baby Diapers' })
        distinctList.unshift({ 'value': 'Adult', 'label': 'Adult Diapers' })   
        distinctList.unshift({ 'value': '', 'label': 'All Types' })
        $w('#optionType').options = distinctList
        $w('#loading').hide()
    })
}

function loadDates() {
    wixData.query('RequestAssistance').limit(1000).descending('rDate').distinct('rDate').then((results) => {
        let distinctList = results.items.map(e => {
            return { label: e, value: e }
        })
        distinctList.unshift({ 'value': '', 'label': 'All Dates' })
        $w('#optionDate').options = distinctList
    })
}

export function btnResetFilter_click(event) {
    $w("#requestAssistance").setFilter(wixData.filter());
    $w('#search').value = undefined
    $w('#optionDate').value = undefined
    $w('#optionType').value = undefined
    $w('#optionLocation').value = undefined
    $w('#loading').hide()
}

export function search_keyPress(event) {
    if (onTime) {
        clearTimeout(onTime)
        onTime = undefined
    }
    onTime = setTimeout(() => {
        filter($w('#search').value, lastFilterDate, lastFilterType, lastFilterlocation, )
    }, 700)
}

export function optionLocation_change(event) {
    filter(lastFilterKeyword, lastFilterDate, lastFilterType, $w('#optionLocation').value)
    setTitle()    
}

export function optionType_change(event) {
    filter(lastFilterKeyword, lastFilterDate, $w('#optionType').value, lastFilterlocation, )
    setTitle()   
}

export function optionDate_change(event) {
    filter(lastFilterKeyword, $w('#optionDate').value, lastFilterType, lastFilterlocation)
    setTitle()    
}

function setTitle() { 
    let dateOption = $w('#optionDate').value
    let typeOption = $w('#optionType').value
    let locationOption = $w('#optionLocation').value
    if (dateOption) {
        $w('#txtDate').text = `Report Date ${dateOption}`
    }
    if (typeOption) {
        $w('#txtReportTitle').text = `Report for ${typeOption} at ${locationOption}`
    }
    setTimeout(getCurrentCount, 1000)
   
}

