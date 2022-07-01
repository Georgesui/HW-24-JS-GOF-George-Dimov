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

	emitMessage(message, subscriber) {
		console.log(subscriber + message);
		const replies = subscriber === 'Jack' ? 'jack-rose' : 'billy-rose'
		this.sendReply(replies, `${subscriber} is ok`)
	}

	sendReply(replies, message) {
		this.newPubsub.publish(replies, message, this.name)
	}
}

class Billy {
	constructor(newPubsub) {
		this.name = 'Billy';
		this.newPubsub = newPubsub;
		this.newPubsub.subscribe('billy-rose', this.emitMessage, this)
	}

	emitMessage(message, subscriber) {
		console.log(subscriber + message);
		console.log(`${this.name} run away`)
	}

	sendReply(replies, message) {
		this.newPubsub.publish(replies, message, this.name)
	}
}

class Jack {
	constructor(newPubsub) {
		this.name = 'Jack';
		this.newPubsub = newPubsub;
		this.newPubsub.subscribe('jack-rose', this.emitMessage, this)
	}

	emitMessage(message, subscriber) {
		console.log(subscriber + message);
		console.log(`${this.name} run away`)
	}

	sendReply(replies, message) {
		this.newPubsub.publish(replies, message, this.name)
	}
}

const newPubsub = new PubSub();
const rose = new Rose(newPubsub);
const billy = new Billy(newPubsub);
const jack = new Jack(newPubsub);

jack.sendReply('event-message', 'Rose')