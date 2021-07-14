
const commManager = () => {
    let _rooms = [];


    const handleInit = (msg) => {
        console.log('initt\'n\'!');
    };


    const _directives = [
        { name: 'init', method: handleInit }
    ];

    
    const handleMessage = (msg) => {
        console.log('handlin\'.');

        if(typeof msg === 'string' && msg[0] === '{') {
            try {
                const msgObj = JSON.parse(msg);
                console.log(`parsed: ${JSON.stringify(msgObj)}`);

                if(msgObj && msgObj.name && _directives.filter(n => n.name === msgObj.name)) {
                    this[_directives.filter(n => n.name === msgObj.name)[0].method](msgObj);
                }
                else {
                    console.log(`Directive not found: ${JSON.stringify(msgObj)}`);
                }
            }
            catch(e) {
                console.log(`Error: ${e}`);
            }
        }
    };


    return {
        handleMessage
    };
};

export default commManager();