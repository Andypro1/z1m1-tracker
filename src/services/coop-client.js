
const coopClient = () => {
    //  TODO: Configurify
    const endpoint = 'ws://localhost:8080/';
    const conn     = new WebSocket(endpoint);

    conn.onopen = () => {
        console.log('onopen()');
    };

    conn.onmessage = async (e) => {
        if(e.data) {
            if(e.data instanceof Blob) {
                var content = await e.data.text();
                console.log(content);
                return content;
            }
            else { //string content
                console.log(e.data);
                return e.data;
            }
        }
    };

    conn.onclose = () => {
        console.log('onclose()');
    };

    const send = (data) => {
        if(conn.readyState === WebSocket.OPEN) {
            conn.send(data);
            console.log(`sent: ${data}`);
        }
        else {
            console.log(`could not send.`);
        }
    };

    return {
        onopen   : conn.onopen,
        onmessage: conn.onmessage,
        onclose  : conn.onclose,
        send     : send
    };
};

export default coopClient();