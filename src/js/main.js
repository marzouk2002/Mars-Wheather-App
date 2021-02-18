import '../sass/main.scss';
import { dataPromise } from './API-handle.js'

const lowerPartBtn = document.querySelector('.previous-wheather_show')
const lowerPart = document.querySelector('.previous-wheather')

const currentSol = document.querySelector('[data-current-sol]')
const currentDate = document.querySelector('[data-current-date]')
const currentTempH = document.querySelector('[data-current-temp-high]')
const currentTempL = document.querySelector('[data-current-temp-low]')
const currentWindSpeed = document.querySelector('[data-current-wind-speed]')
const currentWindDirectionA = document.querySelector('[data-wind-direction-arrow]')
const currentWindDirectionT = document.querySelector('[data-wind-direction-text]')

const previousSolTemp = document.querySelector('[data-previous-sol-temp]')
const previousSolContainer = document.querySelector('[data-previous-sols]')

const unitToggle = document.querySelector('[data-unit-toggle]')
const unitMetric = document.querySelector('#cel')
const unitImperial = document.querySelector('#fah')

function formatDate(date) {
    return date.toLocaleDateString(undefined, {
        day: 'numeric', month: 'long'
    })
}

function formateTemp(temp) {
    if (!unitMetric.checked) {
        temp = (temp * 1.8) + 32
    }
    return Math.round(temp)
}

function formateSpeed(speed) {
    if (!unitMetric.checked) {
        speed = speed * 1.6
    }
    return Math.round(speed)
}

function upDateUnits() {
    let tempUnits = document.querySelectorAll('[data-unit-temp]')
    let speedUnits = document.querySelectorAll('[data-unit-speed]')
    tempUnits.forEach(unit => unit.innerText = unitMetric.checked ? 'C' : 'F')
    speedUnits.forEach(unit => unit.innerText = unitMetric.checked ? 'kph' : 'mph')
}

function setData(res, latestIndex) {
    let latestData = res[latestIndex]
    currentSol.innerHTML = latestData.sol
    currentDate.innerHTML = formatDate(latestData.date)
    currentTempH.innerHTML = formateTemp(latestData.maxTemp)
    currentTempL.innerHTML = formateTemp(latestData.minTemp)
    currentWindSpeed.innerHTML = formateSpeed(latestData.windSpeed)
    currentWindDirectionA.style.setProperty('--direction', `${latestData.windDirectionDegrees}deg`)
    currentWindDirectionT.innerHTML = latestData.windDirectionCardinal

    previousSolContainer.innerHTML = ''
    res.forEach((solData, index) => {
        const solContainer = previousSolTemp.content.cloneNode(true)
        solContainer.querySelector('[data-sol]').innerHTML = solData.sol
        solContainer.querySelector('[data-date]').innerHTML = formatDate(solData.date)
        solContainer.querySelector('[data-temp-high]').innerHTML = formateTemp(solData.maxTemp)
        solContainer.querySelector('[data-temp-low]').innerHTML = formateTemp(solData.minTemp)

        solContainer.querySelector('[data-more-info]').addEventListener('click', () => {
            setData(res, index)
        })
        previousSolContainer.append(solContainer)
    });
    upDateUnits()
}

let lowerstate = false
lowerPartBtn.addEventListener('click', () => {
    if (lowerstate) {
        lowerPartBtn.firstChild.classList.remove('rotate')
        lowerPart.classList.remove('show')
        lowerstate = !lowerstate
    } else {
        lowerPartBtn.firstChild.classList.add('rotate')
        lowerstate = !lowerstate
        lowerPart.classList.add('show')
    }
})

dataPromise.then(res => {
    let latestIndex = res.length - 1

    unitToggle.addEventListener('click', () => {
        let status = !unitMetric.checked
        unitMetric.checked = status
        unitImperial.checked = !status
        setData(res, latestIndex)
    })

    setData(res, latestIndex)
})
