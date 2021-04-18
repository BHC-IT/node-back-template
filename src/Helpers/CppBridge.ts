import * as net from 'net';
// cppBridge class:
// specialised wrapper for javascript socket object to handle requests with C++ server
// Note. If the socket breaks, this class will attempt to reconnect
//   failing that, it will throw an error

// See the bottom of the file for an example
class cppBridge {
	ip : undefined | string;
	port : number;
	socket : net.Socket;
	timeout : number;
	endPacket : string;
	connect (ip : undefined | string, port : number, timeout : number = 300000) {
		this.ip = ip;
		this.port = port;
		this.socket = new net.Socket();
		this.timeout = timeout;
		this.endPacket = '\n\n';

		return new Promise((resolve : Function, reject : Function) => {
			const timer = setTimeout(() => {
				this.socket.removeListener('msg', waitReady);
				reject(new Error('timeout waiting for connect'));
			}, timeout);

			const waitReady = (x : any) => {
				clearTimeout(timer);
				resolve(this);
			};

			this.socket.on('error', (err : Error) => reject(err));
			this.socket.on('close', (err : Error) => reject(err));

			this.socket.on('connect', waitReady);
			this.socket.connect(port, ip);
		});
	}

	recover () {
		throw Error('Dosi: socket broken');
	}

	send (tag : any, content : any, timeout : number = this.timeout) {
		[
		{ n: 'close', f: this.recover },
		{ n: 'end', f: this.recover },
		{ n: 'error', f: this.recover },
		{ n: 'timeout', f: this.recover }
		].forEach((eventStr : any, handler : any) => this.socket.on(eventStr, (_ : any) => handler()));

		const packet = JSON.stringify({
			tag: tag,
			contents: content
		});

		return new Promise((resolve : Function, reject : Function) => {
			this.socket.write(packet);


			const waitData = (data : any) => {
				clearTimeout(timer);
				resolve(data.toString());
			};

			this.socket.on('data', waitData);

			const timer = setTimeout(() => {
				reject(new Error('timeout waiting for msg'));
				this.socket.removeListener('msg', waitData);
			}, timeout);
		});
	}
}

export default cppBridge;

// example();

// Testing instructions:
// run in sh:
// $ `netc -l -p 50231 <<< 'response'`
// $ `node CppBridge.js`
