var Thumbs=new Class(
	{
	initialize: function(thumb)
		{
		this.photoElement=thumb.getElements('img')[0];
		this.thumbsElement=thumb.getElements('ul')[0];
		var event='click';
		if($(thumb).hasClass('mouseover'))
			{
			event='mouseover';
			}
		if(this.thumbsElement)
			{
			var links = $(this.thumbsElement).getElements('a');
			links.each(function (link)
				{
				link.addEvent(event, this.zoomThumb.bind(this), false);
				}, this);
			}
		},
	zoomThumb: function(event)
		{
		var target=event.target;
		if(target.nodeName.toLowerCase()!='a')
			target=target.parentNode;
		if(target.nodeName.toLowerCase()=='a')
			{
			this.photoElement.src=target.getAttribute('href');
			event.stop();
			}
		}
	});

window.addEvent('domready', function()
	{
	$$('.thumbs').forEach(function (thumbs)
		{
		new Thumbs(thumbs);
		}, this);
	});