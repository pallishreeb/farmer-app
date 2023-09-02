var request = require('request');

exports.Findtemperature = async (req, res) => {
    let lat = req.query.lat;
    let lon = req.query.lon;
    request(
        // `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=8388081f025e7f09e67b6f0c7ea7c406`,
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=8388081f025e7f09e67b6f0c7ea7c406`,
        function(err,response,body){
            data = JSON.parse(body)
            if(response.statusCode === 200){
                console.log(data.main.temp)
                res.send(`The Weather in Your lat "${lat}" lon "${lon}" is "${data.main.temp}"`)
            }
        }
    )
}
