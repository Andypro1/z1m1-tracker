
const commManager = () => {
    let _rooms = [];


    const handleInit = (msg, userid) => {
        console.log(`initt\'n\' ${userid}!`);

        if(msg.room) {
            const existingRoom = _rooms.filter(r => r.id === msg.room);

            return { success: existingRoom.length };
        }
        else {
            return { failed: 'room property not valid.' };
        }
    };


    const _directives = [
        { name: 'init', method: handleInit }
    ];

    
    const handleMessage = (msg, userid) => {
        console.log(`handlin\' from ${userid}!`);

        if(typeof msg === 'string' && msg[0] === '{') {
            try {
                const msgObj = JSON.parse(msg);
                console.log(`parsed: ${JSON.stringify(msgObj)}`);

                if(msgObj && msgObj.name && _directives.filter(n => n.name === msgObj.name)) {
                    const res = _directives.filter(n => n.name === msgObj.name)[0].method(msgObj, userid);

                    console.log(JSON.stringify(res));
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