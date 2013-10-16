window.size=(function() {
	var	SIZES=['XS','S','M','L','XL','XXL','XXXL']
		, DEFAULT_SIZE = 'L'
		, SIZE_EVT = 'sizechange'
		, _size = _readSize()
		, _self = {}
		, _callbacks = [];
	function _readSize() {
		if(!('getComputedStyle' in window)) {
			return DEFAULT_SIZE;
		}
		_size=window.getComputedStyle(
			document.querySelector('head link')
		).getPropertyValue('content') || DEFAULT_SIZE;
		return _size=('normal'!==_size?_size:
			window.getComputedStyle(
				document.querySelector('head link'),
				':after'
			).getPropertyValue('content')).replace(/"/g,'');
	}
	function parseFormURLEncoded(s) {
		if(!s) {
			return null;
		}
		var chunks=s.split('&'), parts, o={};
		for(var i=chunks.length-1; i>=0; i--) {
			parts=chunks[i].split('=');
			if('undefined'===typeof o[parts[0]]) {
				o[parts[0]]=[];
			}
			o[parts[0]].push(decodeURIComponent(parts[1]));
		}
		return o;
	}
	window.onresize=(function(oldResize) {
		return function(e) {
			var oldSize=_size;
			_size=_readSize();
			if(_size!==oldSize) {
				_callbacks.forEach(function(callback) {
					callback(_size,oldSize, e);
				});
			}
			('function' === typeof oldResize)&&oldResize(e);
		};
	})(window.onresize);
	return {
		addEventListener : function(type,callback) {
			if(SIZE_EVT!==type) {
				return false;
			}
			('function'===typeof callback)
				&&_callbacks.push(callback);
			return false;
		},
		removeEventListener : function(callback) {
			if(SIZE_EVT!==type) {
				return false;
			}
			var index=_callbacks.indexOf(callback);
			-1!==index&&_callbacks.splice(index,1);
			return true;
		},
		getSizedData : function (data) {
			data = parseFormURLEncoded(data);
			if(!data) {
				return '';
			}
			for(var i=SIZES.indexOf(_size); i>=0; i--) {
				if(data[SIZES[i]]) {
					return data[SIZES[i]][0];
				}
			}
			return '';
		},
		getSize : function () {
			return _size;
		}
	};
})();
