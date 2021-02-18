let API_KEY = 'dWH02vmWyuYdcsZUWJZeY9BZan92ga6tNoNZqXbK'
let API = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`

function getdata(api) {
    return new Promise((resolve, reject) => {
        fetch(api)
            .then(res => res.json())
            .then(data => {
                const {
                    sol_keys,
                    validity_checks,
                    ...solData
                } = data
                resolve(Object.entries(solData).map(([sol, data]) => {
                    return {
                        sol: sol,
                        maxTemp: data.AT.max,
                        minTemp: data.AT.min,
                        windSpeed: data.HWS.av,
                        windDirectionDegrees: data.WD.most_comon.compass_degrees,
                        windDirectionCardinal: data.WD.most_comon.compass_point,
                        date: new Date(data.First_UTC)
                    }
                }))
            })
    })
}

export const dataPromise = getdata(API)
