class PubSub {
	constructor() {
		this.handlers = [];
	}
	subscribe(event, handler, context) {
		if (typeof context === 'undefined') {
			context = handler;
		}
		this.handlers.push({
			event: event,
			handler: handler.bind(context)
		});
	}
	publish(event, message, subscriber) {
		this.handlers.forEach((topic) => {
			if (topic.event === event) {
				topic.handler(message, subscriber)
			}
		})
	}
}

class Rose {
	constructor(newPubsub) {
		this.name = 'Rose';
		this.newPubsub = newPubsub;
		this.newPubsub.subscribe('event-message', this.emitMessage, this)
	}

	emitMessage(event, subscriber) {
		if (subscriber === 'Jack') {
			console.log(`${this.name} is ok with Jack`)
			this.sendReply('billy-rose', `${subscriber} is ok`)
		} else if (subscriber === 'Billy') {
			console.log(`${this.name} is ok with Billy`)
			this.sendReply('jack-rose', `${subscriber} is ok`)
		}
	}

	sendReply(event, message) {
		this.newPubsub.publish(event, message, this.name)
	}
}

class Billy {
	constructor(newPubsub) {
		this.name = 'Billy';
		this.newPubsub = newPubsub;
		this.newPubsub.subscribe('billy-rose', this.emitMessage, this)
	}

	emitMessage() {
		console.log(`${this.name} run away`)
	}

	sendReply() {
		console.log(`${this.name} with Rose`)
		this.newPubsub.publish('event-message', `${this.name} with Rose`, this.name)
	}
}

class Jack {
	constructor(newPubsub) {
		this.name = 'Jack';
		this.newPubsub = newPubsub;
		this.newPubsub.subscribe('jack-rose', this.emitMessage, this)
	}

	emitMessage() {
		console.log(`${this.name} run away`)
	}

	sendReply() {
		console.log(`${this.name} with Rose`)
		this.newPubsub.publish('event-message', `${this.name} with Rose`, this.name)
	}
}

const newPubsub = new PubSub();
const rose = new Rose(newPubsub);
const billy = new Billy(newPubsub);
const jack = new Jack(newPubsub);

jack.sendReply('event-message', 'Rose')