var PopmenuManager=new Class({
	initialize: function(root)
		{
		this.root=root;
		this.selectedMenuItems=[];
		this.overMenuMode=true;
		this.obstrusiveMenuMode=false;
		this.root.addEvent('mouseover', this.handleFocus.bind(this), false);
		this.root.addEvent('focus', this.handleFocus.bind(this), true);
		this.root.addEvent('mouseout', this.handleBlur.bind(this), false);
		this.root.addEvent('blur', this.handleBlur.bind(this), true);
		},
	handleFocus: function(event)
		{
		if(this.overMenuMode)
			{
			this.handleHideMenuEvent(event);
			this.handleShowMenuEvent(event);
			}
		},
	handleBlur: function(event)
		{
		if(this.overMenuMode)
			this.handleHideMenuEvent(event);
		},
	handleShowMenuEvent: function(event)
		{
		var targetElement=event.target;
		while(targetElement!=this.root&&!targetElement.hasClass('menu'))
			{
			targetElement=targetElement.parentNode;
			}
		if(targetElement.hasClass('menu')&&!targetElement.hasClass('selected'))
			{
			var menus;
			menus=targetElement.getElements('ul.popmenu');
			if(menus[0]&&menus[0].childNodes.length)
				{
				targetElement.addClass('selected');
				var matches=targetElement.get('class')
					.match(/(?:^| )(?:(left|center|right)(top|center|bottom))(?:(left|center|right)(top|center|bottom))?(?:$| )/);
				if(matches)
					{
					console.log({aHPos:matches[1],aVPos:matches[2],hPos:(matches[3]||'left'),vPos:(matches[4]||'top')});
					menus[0].setAnchoredPosition(targetElement,{aHPos:matches[1],aVPos:matches[2],hPos:(matches[3]||'left'),vPos:(matches[4]||'top')});
					}
				this.selectedMenuItems.push(targetElement);
				}
			}
		},
	handleHideMenuEvent: function(event)
		{
		var targetElement=event.target;
		// Finding if element or one of it's ancestors is inside selected menu items
		var index=this.selectedMenuItems.indexOf(targetElement);
		while(targetElement!=this.root&&index<0)
			{
			targetElement=targetElement.parentNode;
			index=this.selectedMenuItems.indexOf(targetElement);
			}
		// The target element must be deleted only if it's the original event target
		if(targetElement!=event.target)
			{
			if(this.selectedMenuItems[index+1])
				this.hideMenu(this.selectedMenuItems[index+1]);
			}
		},
	hideMenuItem: function()
		{
		this.hideMenu(this.selectedMenuItems[this.selectedMenuItems.length-1]);
		},
	hideMenu: function(targetElement)
		{
		// Removing obsolete menu item
		for(var i=this.selectedMenuItems.length-1; i>=0; i--)
			{
			var item=this.selectedMenuItems.pop();
			if(this.obstrusiveMenuMode)
				{
				var menus;
				menus=item.getElements('ul.popmenu');
				if(menus[0]&&menus[0].lastChild)
					{
					menus[0].removeChild(menus[0].lastChild);
					}
				}
			item.removeClass('selected');
			if(targetElement==item)
				{
				break;
				}
			}
		}
	});

window.addEvent('domready', function()
	{
	new PopmenuManager(document.body);
	});