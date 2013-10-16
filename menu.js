var PopmenuManager = new Class({
	initialize: function (root) {
		this.root = root;
		this.selectedMenuItems = [];
		this.overMenuMode = true;
		this.obstrusiveMenuMode = false;
		this.root.addEvent('mouseover', this.handleFocus.bind(this), false);
		this.root.addEvent('focus', this.handleFocus.bind(this), true);
		this.root.addEvent('mouseout', this.handleBlur.bind(this), false);
		this.root.addEvent('blur', this.handleBlur.bind(this), true);
		this.root.addEvent('click', this.handleClick.bind(this), true);
	},
	getMenuMode: function (event) {
		var targetElement = event.target, matches, menus, anchorElement;
		// Looking for the menu base
		while (targetElement != this.root && !targetElement.hasClass('menu')) {
			targetElement = targetElement.parentNode;
		}
		// Getting the menu mode
		matches = size.getSizedData(targetElement.get('data-popmode'))
			.match(/(?:^| )(?:(click|over))(?:$| )/);
		if (matches) {
			return matches[1];
		}
		return 'over';
	},
	handleFocus: function (event) {
		if ('over'===this.getMenuMode(event)) {
			this.handleHideMenuEvent(event);
			this.handleShowMenuEvent(event);
		}
	},
	handleBlur: function (event) {
		if ('over'===this.getMenuMode(event)) {
			this.handleHideMenuEvent(event);
		}
	},
	handleClick: function (event) {
		var targetElement = event.target
		if ('click'===this.getMenuMode(event)) {
			// Looking for a back button
			while (targetElement != this.root && !targetElement.hasClass('back')) {
				targetElement = targetElement.parentNode;
			}
			if(targetElement.hasClass('back')) {
				this.hideMenuItem();
			} else {
				this.handleShowMenuEvent(event);
			}
		}
	},
	handleShowMenuEvent: function (event) {
		var targetElement = event.target, matches, menus, anchorElement;
		// Looking for the menu base
		while (targetElement != this.root && !targetElement.hasClass('menu')) {
			targetElement = targetElement.parentNode;
		}
		// If the menu is not selected
		if (targetElement.hasClass('menu') && !targetElement.hasClass('selected')) {
			// Selecting the menu
			targetElement.addClass('selected');
			this.selectedMenuItems.push(targetElement);
			// If the submenu has childs
			menus = targetElement.getElements('ul.popmenu');
			if (menus[0] && menus[0].childNodes.length) {
				anchorElement=targetElement;
				// Finding the parent for positionning
				matches = size.getSizedData(targetElement.get('data-popparent'))
					.match(/(?:^| )(?:([0-9]|css))(?:$| )/);
				if (matches) {
					// positionning relatively to the viewport
					if('css'===matches[1]) {
						anchorElement = null;
					// positionning relatively to the body
					} else {
						for (var i = matches[1]; i > 0; i--) {
							anchorElement = anchorElement.parentNode;
						}
					}
				}
				// Finding the positionning directivesmatches = document.size
				if(anchorElement) {
					matches = size.getSizedData(targetElement.get('data-poppos'))
						.match(/(?:(left|center|right)(top|center|bottom))(?:(left|center|right)(top|center|bottom))?/);
					if (matches) {
						menus[0].setAnchoredPosition(anchorElement, {
							aHPos: matches[1],
							aVPos: matches[2],
							hPos: (matches[3] || 'left'),
							vPos: (matches[4] || 'top')
						});
					}
				} else {
					menus[0].set('style','');
				}
			}
		}
	},
	handleHideMenuEvent: function (event) {
		var targetElement = event.target;
		// Finding if element or one of it's ancestors is inside one of the selected menu items
		var index = this.selectedMenuItems.indexOf(targetElement);
		while (targetElement != this.root && index < 0) {
			targetElement = targetElement.parentNode;
			index = this.selectedMenuItems.indexOf(targetElement);
		}
		// The target element must be deleted only if it's the original event target
		if (targetElement != event.target) {
			if (this.selectedMenuItems[index + 1])
				this.hideMenu(this.selectedMenuItems[index + 1]);
		}
	},
	hideMenuItem: function () {
		this.hideMenu(this.selectedMenuItems[this.selectedMenuItems.length - 1]);
	},
	hideMenu: function (targetElement) {
		// Removing obsolete menu item
		for (var i = this.selectedMenuItems.length - 1; i >= 0; i--) {
			var item = this.selectedMenuItems.pop();
			if (this.obstrusiveMenuMode) {
				var menus;
				menus = item.getElements('ul.popmenu');
				if (menus[0] && menus[0].lastChild) {
					menus[0].removeChild(menus[0].lastChild);
				}
			}
			item.removeClass('selected');
			if (targetElement == item) {
				break;
			}
		}
	}
});

window.addEvent('domready', function () {
	new PopmenuManager(document.body);
});
