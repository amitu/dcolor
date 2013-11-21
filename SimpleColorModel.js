define(["dcl/dcl", "./utils"],
	function (dcl, utils) {
	
	return dcl(null, {
		// summary:
		//		Base class for color models that return a color from a data value
		//		using an interpolation between two extremum colors.
		
		_startColor: null,
		_endColor: null,
	
		constructor: function (startColor, endColor) {
			// summary:
			//		Construct a color model interpolating between start and end color.
			//		If only start color is provided use it to compute reasonable start and end
			//		colors from it.
			// startColor: dojo/_base/Color
			//		The start color. 
			// endColor: dojo/_base/Color?
			//		The end color.
			if (endColor !== undefined) {
				this._startColor = startColor;
				this._endColor = endColor;
			} else {
				// When only one color is provided
				// use only the hue, and compute
				// the start/end colors by playing
				// with the luminance...
				var hsl = utils.toHsl(startColor);
				hsl.s = 100;
				hsl.l = 85;
				this._startColor = utils.fromHsl(hsl.h, hsl.s, hsl.l);
				this._startColor.a = startColor.a;
				hsl.l = 15;
				this._endColor = utils.fromHsl(hsl.h, hsl.s, hsl.l);
				this._endColor.a = startColor.a;
			}
		},
		
		_getInterpoledValue: function (from, to, value) {
			return (from + (to - from) * value);
		},
	
		getNormalizedValue: function (/*value*/) {
			// summary:
			//		Return the normalized (between 0 and 1) value for a given data value.
			//		This function must be implemented by implementations.
			// value: Number
			//		The data value.
		},
	
		getColor: function (value) {
			// summary:
			//		return the color for a given data value.
			// value: Number
			//		The data value.
			var completion = this.getNormalizedValue(value);
			var hslFrom = utils.toHsl(this._startColor);
			var hslTo = utils.toHsl(this._endColor);
			var h = this._getInterpoledValue(hslFrom.h, hslTo.h, completion);
			var s = this._getInterpoledValue(hslFrom.s, hslTo.s, completion);
			var l = this._getInterpoledValue(hslFrom.l, hslTo.l, completion);
			var a = this._getInterpoledValue(this._startColor.a, this._endColor.a, completion);
			var c = utils.fromHsl(h, s, l);
			c.a = a;
			return c;
		}
	});
});
