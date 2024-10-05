function Search_Transaction_id(city, type) {
    console.log(city)
    const sanitizedCity = city.replace(/[^a-zA-Z0-9]/g, "-");
    const currentDate = new Date();
    const timestamp = currentDate.getTime().toString().slice(-6); 

    let Transcation_id = '';
    
    if (type === "full") {
        Transcation_id = `eatiko-${sanitizedCity}-f1-${timestamp}-os`;
    } else if (type === "inc") {
        Transcation_id = `eatiko-${sanitizedCity}-i1-${timestamp}-os`;
    }

    return Transcation_id;
}

module.exports = Search_Transaction_id;
