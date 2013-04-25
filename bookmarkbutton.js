var BookmarkButton=new Class({
	initialize: function(button)
		{
		button.addEvent('click',this.addFav.bind(this));
		},
	addFav: function(event)
		{
		var url=event.target.get('href');
		var title=event.target.get('title');
		if(window.external)
			window.external.AddFavorite(url,title)
		else if(window.sidebar&&window.sidebar.addPanel)
			window.sidebar.addPanel(title, url,"");
		}
	});

window.addEvent('domready', function()
	{
	$$('a.bookmarkbutton').forEach(function(button)
		{
		if((window.external)||(window.sidebar&&window.sidebar.addPanel))
			new BookmarkButton(button);
		else
			button.setStyle('display','none');
		}, this);
	});