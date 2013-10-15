var WebDisplay = new Class({
	// Initialize the carousel
	initialize: function (carbox) {
		// Saving root element
		this.root = $(carbox);
		// Setting properties
		this.frequency = (this.root.get('class').test(/(^| )freq([0-9]+)($| )/) ?
			this.root.get('class').replace(/(?:.*)freq([0-9]+)(?:.*)/, '$1') : 0);
		this.root.removeClass('undetected');
		// Registering elements
		this.panels = this.root.getElements('.carpanel');
		this.cars = this.root.getElements('.carmenu a');
		// Finding currently selected panel
		this.panels.forEach(function (panel) {
			if ($(panel).hasClass('selected'))
				this.selectedPanel = panel;
		}, this);
		// Registering events
		this.root.addEvent('mouseenter', this.pause.bind(this));
		this.root.addEvent('mouseleave', this.resume.bind(this));
		this.root.addEvent('focus', this.pause.bind(this), true);
		this.root.addEvent('blur', this.resume.bind(this), true);
		this.root.addEvent('click', this.handleCommand.bind(this));
		window.addEvent('hashchange', this.handleHash.bind(this), false);
		// Trying to show the panel from the hash
		if (document.location.hash)
			this.selectFromHash(document.location.hash);
		// Selecting the first panel if none selected
		if (!this.selectedPanel) {
			this.selectPanel(this.panels[0]);
		}
		// Running the timer
		this.resume();
	},
	// Selecting the given panel
	selectPanel: function (panel, manual) {
		if (this.selectedPanel && this.selectedPanel != panel) {
			this.previouslySelectedPanel = this.selectedPanel;
		}
		this.selectedPanel = panel;
		var i = 0;
		this.panels.forEach(function (p, index) {
			if ($(this.selectedPanel).get('id') == $(p).get('id')) {
				i = index;
			}
		}, this);
		this.panels.forEach(function (panel) {
			if (this.selectedPanel == panel)
				$(panel).addClass('selected');
			else
				$(panel).removeClass('selected');
			if (this.previouslySelectedPanel && this.previouslySelectedPanel == panel)
				$(panel).addClass('unselected');
			else
				$(panel).removeClass('unselected');
		}, this);
		this.cars.forEach(function (tab) {
			var rel = $(tab).get('rel');
			if (rel && rel.indexOf('prev') >= 0) {
				$(tab).set('href', '#'
					+ this.panels[(i == 0 ? this.panels.length - 1 : i - 1)].get('id'));
			} else if (rel && rel.indexOf('next') >= 0) {
				$(tab).set('href', '#'
					+ this.panels[(i < this.panels.length - 1 ? i + 1 : 0)].get('id'));
			}
			if ($(this.selectedPanel).get('id') == tab.href.substring(
				tab.href.indexOf('#') + 1)) {
				$(tab.parentNode).addClass('selected');
				$(tab.parentNode).focus();
			} else {
				$(tab.parentNode).removeClass('selected');
			}
			if (this.previouslySelectedPanel && this.previouslySelectedPanel.get('id')
				== tab.href.substring(tab.href.indexOf('#') + 1)) {
				$(tab.parentNode).addClass('unselected');
			} else {
				$(tab.parentNode).removeClass('unselected');
			}
		}, this);
		if (manual) {
			var id = this.selectedPanel.get('id');
			this.selectedPanel.set('id', '');
			document.location.hash = '#' + id;
			this.selectedPanel.set('id', id);
		}
	},
	// Browse menu
	handleCommand: function (event) {
		var a = event.target,
			found = false;
		while (a && a.nodeName != 'A' && a != this.root)
			a = a.parentNode;
		if (a != this.root) {
			this.stop();
			if ($(a).get('rel') && $(a).get('rel').indexOf('prev') >= 0) {
				this.selectPrevious(true);
				found = true;
			} else if ($(a).get('rel') && $(a).get('rel').indexOf('next') >= 0) {
				this.selectNext(true);
				found = true;
			} else {
				this.panels.forEach(function (panel) {
					if ($(panel).get('id') == a.href.substring(a.href.indexOf('#') + 1)) {
						this.selectPanel(panel, true);
						found = true;
					}
				}, this);
			}
			if (found)
				event.stop();
			if (!this.root.hasClass('paused'))
				this.resume();
		}
	},
	selectPrevious: function (manual) {
		for (var i = this.panels.length - 1; i >= 0; i--) {
			if (this.panels[i] == this.selectedPanel) {
				if (i == 0) {
					this.selectPanel(this.panels[this.panels.length - 1], manual);
				} else {
					this.selectPanel(this.panels[i - 1], manual);
				}
				break;
			}
		}
	},
	selectNext: function (manual) {
		for (var i = this.panels.length - 1; i >= 0; i--) {
			if (this.panels[i] == this.selectedPanel) {
				if (i >= this.panels.length - 1) {
					this.selectPanel(this.panels[0], manual);
				} else {
					this.selectPanel(this.panels[i + 1], manual);
				}
				break;
			}
		}
	},
	// Hashes management
	handleHash: function (event) {
		this.selectFromHash(document.location.hash);
	},
	selectFromHash: function (hash) {
		var panel = $(hash.substr(1));
		if (panel && panel != this.selectedPanel) {
			this.panels.forEach(function (p) {
				if (p == panel) {
					this.selectPanel(panel, true);
				}
			}, this);
		}
	},
	// Manage the timer
	handleTimer: function (event) {
		this.stop();
		this.selectNext();
		this.resume();
	},
	resume: function () {
		this.root.removeClass('paused');
		if (this.frequency)
			this.timer = this.handleTimer.delay(this.frequency * 1000, this);
	},
	pause: function () {
		this.root.addClass('paused');
		this.stop();
	},
	stop: function () {
		if (this.timer)
			clearTimeout(this.timer);
	}
});

window.addEvent('domready', function () {
	$$('.carbox').forEach(function (carbox) {
		new WebDisplay(carbox);
	});
});
