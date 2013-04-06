var Panorama=new Class(
	{
	initialize: function(panorama)
		{
		this.root=$(panorama);
		this.image=this.root.getElement('img');
		this.pace=0;
		this.pos=0;
		this.isDown=false;
		this.clientX=false;
		this.clientY=false;
		this.root.setStyle('cursor','e-resize');
		this.root.setStyle('overflow','hidden');
		this.root.setStyle('height',this.image.height+'px');
		this.root.addEvent('mousewheel', this.mouseWheel.bind(this));
		this.root.addEvent('mousedown', this.mouseDown.bind(this));
		this.root.addEvent('mouseup', this.mouseUp.bind(this));
		this.root.addEvent('mouseout', this.mouseUp.bind(this));
		this.root.addEvent('mousemove', this.mouseMove.bind(this));
		this.display();
		},
	display: function()
		{
		this.image.style.display='none';
		if(this.pos>this.image.width)
			this.pos=this.pos-this.image.width;
		else if(this.pos<0)
			this.pos=this.image.width-this.pos;
		this.root.setStyle('background','url('+this.image.src+') repeat-x '+this.pos+'px center');
		document.getElementsByTagName('title')[0].innerHTML='url('+this.image.src+') repeat-x '+this.pos+'px center';
		},
	mouseDown: function(event)
		{
		this.isDown=true;
		this.clientX=event.client.x;
		this.clientY=event.client.y;
		event.stop();
		},
	mouseUp: function(event)
		{
		this.isDown=false;
		this.clientX=0;
		this.clientY=0;
		event.stop();
		},
	mouseMove: function(event)
		{
		if(this.isDown)
			{
			this.pace=this.image.width/1000*Math.abs(this.clientX-event.client.x);
			if(this.clientX<event.client.x)
				this.slideRight();
			else
				this.slideLeft();
			this.clientX=event.client.x;
			this.clientY=event.client.y;
			event.stop();
			}
		},
	mouseWheel: function(event)
		{
		this.pace=this.image.width/100*5;
		if(event.wheel < 0)
			this.slideRight();
		else
			this.slideLeft();
		event.stop();
		},
	slideLeft: function(event)
		{
		this.pos+=this.pace;
		this.display();
		},
	slideRight: function(event)
		{
		this.pos-=this.pace;
		this.display();
		}
	});

window.addEvent('load', function()
	{
	$$('.panorama').forEach(function (panorama)
		{
		new Panorama(panorama);
		}, this);
	});