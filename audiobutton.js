var AudioButton=new Class(
	{
	initialize: function(button)
		{
		button.addEvent('click',this.play.bind(this));
		},
	play: function(event)
		{
		var button=$(event.target);
		while((!button.hasClass('audiobutton'))&&button.parentNode)
			button=button.parentNode;
		event.stop();
		var audio=document.createElement('audio');
		if(audio.canPlayType&&audio.canPlayType(button.get('type')))
			{
			audio.set('autobuffer','autobuffer');
			audio.set('type',button.get('type'));
			audio.set('src',button.get('href'));
			audio.play();
			}
		else if(Browser.Engine.trident)
			{
			audio=$(document.createElement('bgsound'));
			audio.set('loop',0);
			audio.set('src',button.get('href'));
			document.appendChild(audio);
			} 
		else
			{
			window.open(button.get('href'));
			}
		}
	});

window.addEvent('domready', function()
	{
	$$('a.audiobutton').forEach(function (button)
		{
		if(button.get('type'))
			throw 'Audio buttons must have a type attribute.';
		new AudioButton(button);
		}, this);
	});
