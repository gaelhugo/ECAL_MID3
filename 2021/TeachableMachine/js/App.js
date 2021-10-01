'use strict';
class App {
	constructor() {
		// chargement de la video
		this.video = document.getElementById('video');
		this.loadVideo();
		this.loadModel();

		// 3 legends
		this.legend_green = document.getElementById('legend_green');
		this.legend_purple = document.getElementById('legend_purple');
		this.legend_red = document.getElementById('legend_red');
		this.legend_orange = document.getElementById('legend_orange');
		// 3 counter
		this.counter_green = 0;
		this.counter_purple = 0;
		this.counter_red = 0;
		this.counter_orange = 0;

		// sound dict
		this.index = { green: 0, purple: 1, red: 2 };
	}

	loadVideo() {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: true }).then(
				function (stream) {
					// this.video.src = window.URL.createObjectURL(stream);
					this.video.srcObject = stream;
					this.video.play();
				}.bind(this)
			);
		}
	}

	loadModel() {
		this.featureExtractor = ml5.featureExtractor('MobileNet', this.modelLoaded.bind(this));
		console.log(this.featureExtractor);
	}

	modelLoaded() {
		this.classifier = this.featureExtractor.classification(this.video, this.ready.bind(this));
		this.featureExtractor.config.numLabels = 4;
	}

	ready() {
		console.log('ALL OK');
		//load Audio
		this.allAudios = Array.from(document.getElementsByClassName('sound'));
		console.log(this.allAudios);
		// init listener
		this.interaction = document.getElementById('interaction');
		this.interaction.addEventListener('click', this.onbuttonclick.bind(this));
		document.addEventListener('keydown', this.onSave.bind(this));

		document.getElementById('loader').addEventListener('change', (e) => {
			console.log(e.target.files);
			this.classifier.load(e.target.files[0].name, () => {
				console.log('loaded');
				this.legend_green.textContent = 'Model loaded';
				this.startGuessing();
			});
		});
	}

	startGuessing() {
		this.detection = setInterval(() => {
			// console.log('detection');
			this.classifier.classify((error, result) => {
				if (error) {
					// console.log(error);
				} else {
					// console.log(result);
					const res = result[0].label;
					this.legend_purple.style.fontSize = '50px';
					this.legend_purple.textContent = res;
					if (res != 'orange') {
						// console.log(res, this.index[res]);
						this.allAudios[this.index[res]].play();
					}
				}
			});
		}, 100);
	}
	onbuttonclick(e) {
		let val = e.target.id.split('_');
		console.log(val);
		if (val.length == 2) {
			// train
			this.classifier.train((lossValue) => {
				if (lossValue) {
					this.l = lossValue;
					this.legend_green.textContent = 'Loss : ' + this.l;
				} else {
					console.log('train finito');
					this.legend_green.textContent = 'Loss : ' + this.l;
					this.startGuessing();
				}
			});
		} else if (val[0] != '') {
			// add image
			if (val[0] == 'green') {
				this.counter_green++;
				this.legend_green.textContent = this.counter_green + ' images';
			}
			if (val[0] == 'purple') {
				this.counter_purple++;
				this.legend_purple.textContent = this.counter_purple + ' images';
			}
			if (val[0] == 'red') {
				this.counter_red++;
				this.legend_red.textContent = this.counter_red + ' images';
			}
			if (val[0] == 'orange') {
				this.counter_orange++;
				this.legend_orange.textContent = this.counter_orange + ' images';
			}
			this.classifier.addImage(val[0]);
		}
	}

	onSave(e) {
		if (e.keyCode == 32) {
			console.log(this.classifier);

			clearInterval(this.detection);
			this.classifier.save();
		}
	}
}
window.onload = function () {
	new App();
};
