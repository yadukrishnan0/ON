const SearchStorage =require('./Search.js');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getAll = (transaction_id, Attempt) => {
    const results = []; 
    let index;

    while ((index = SearchStorage.findIndex(item => item.context.transaction_id === transaction_id)) !== -1) {
        const result = SearchStorage[index];
        results.push(result); 
        SearchStorage.splice(index, 1); 
    }
    results.Attempt = Attempt; 
    return results; 
};

const GetSearch = async (transaction_id) => {
    let Attempt = 1;
    let allResponses = [];

    while (Attempt <= 5) {
        const responses = getAll(transaction_id, Attempt);
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
