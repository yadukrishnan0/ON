const Search =require ('../Schema/Search.js'); 

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getAll = async (transaction_id, Attempt) => {
    const results = await Search.find({ 'context.transaction_id': transaction_id });
    results.forEach(result => {
        result.Attempt = Attempt; 
    });
    return results;
};

const GetSearch = async (transaction_id) => {
    let Attempt = 1;
    let allResponses = [];
    await delay(1000); 
    while (Attempt <= 5) {
        const responses = await getAll(transaction_id, Attempt);
        allResponses = allResponses.concat(responses);
        
        if (allResponses.length > 0) {
            return allResponses; 
        }

        Attempt++;
        await delay(3000); 
    }

    return allResponses;
};

module.exports= GetSearch;
