/*!
 * VERSION: 0.0.9
 * DATE: 2015-12-10
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * DrawSVGPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {

	"use strict";

	function getDistance(x1, y1, x2, y2) {
		x2 = parseFloat(x2) - parseFloat(x1);
		y2 = parseFloat(y2) - parseFloat(y1);
		return Math.sqrt(x2 * x2 + y2 * y2);
	}

	function unwrap(element) {
		if (typeof(element) === "string" || !element.nodeType) {
			element = _gsScope.TweenLite.selector(element);
			if (element.length) {
				element = element[0];
			}
		}
		return element;
	}

	//accepts values like "100%" or "20% 80%" or "20 50" and parses it into an absolute start and end position on the line/stroke based on its length. Returns an an array with the start and end values, like [0, 243]
	function parse(value, length, defaultStart) {
		var i = value.indexOf(" "),
			s, e;
		if (i === -1) {
			s = defaultStart !== undefined ? defaultStart + "" : value;
			e = value;
		} else {
			s = value.substr(0, i);
			e = value.substr(i+1);
		}
		s = (s.indexOf("%") !== -1) ? (parseFloat(s) / 100) * length : parseFloat(s);
		e = (e.indexOf("%") !== -1) ? (parseFloat(e) / 100) * length : parseFloat(e);
		return (s > e) ? [e, s] : [s, e];
	}

	function getLength(element) {
		if (!element) {
			return 0;
		}
		element = unwrap(element);
		var type = element.tagName.toLowerCase(),
			length, bbox, points, point, prevPoint, i, rx, ry;
		if (type === "path") {
			//IE bug: calling getTotalLength() locks the repaint area of the stroke to whatever its current dimensions are on that frame/tick. To work around that, we must call getBBox() to force IE to recalculate things.
			prevPoint = element.style.strokeDasharray;
			element.style.strokeDasharray = "none";
			length = element.getTotalLength() || 0;
			try {
				bbox = element.getBBox(); //solely for fixing bug in IE - we don't actually use the bbox.
			} catch (e) {
				//firefox has a bug that throws an error if the element isn't visible.
			}
			element.style.strokeDasharray = prevPoint;
		} else if (type === "rect") {
			length = element.getAttribute("width") * 2 + element.getAttribute("height") * 2;
		} else if (type === "circle") {
			length = Math.PI * 2 * parseFloat(element.getAttribute("r"));
		} else if (type === "line") {
			length = getDistance(element.getAttribute("x1"), element.getAttribute("y1"), element.getAttribute("x2"), element.getAttribute("y2"));
		} else if (type === "polyline" || type === "polygon") {
			points = element.getAttribute("points").split(", ").join(",").split(" ");
			length = 0;
			prevPoint = points[0].split(",");
			if (points[points.length-1] === "") { //if there's an extra space at the end, fix it.
				points.pop();
			}
			if (type === "polygon") {
				points.push(points[0]);
				if (points[0].indexOf(",") === -1) {
					points.push(points[1]);
				}
			}
			for (i = 1; i < points.length; i++) {
				point = points[i].split(",");
				if (point.length === 1) {
					point[1] = points[i++];
				}
				if (point.length === 2) {
					length += getDistance(prevPoint[0], prevPoint[1], point[0], point[1]) || 0;
					prevPoint = point;
				}
			}
		} else if (type === "ellipse") {
			rx = parseFloat(element.getAttribute("rx"));
			ry = parseFloat(element.getAttribute("ry"));
			length = Math.PI * ( 3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)) );
		}
		return length || 0;
	}

	var _getComputedStyle = document.defaultView ? document.defaultView.getComputedStyle : function() {},
		DrawSVGPlugin;

	function getPosition(element, length) {
		if (!element) {
			return [0, 0];
		}
		element = unwrap(element);
		length = length || (getLength(element) + 1);
		var cs = _getComputedStyle(element),
			dash = cs.strokeDasharray || "",
			offset = parseFloat(cs.strokeDashoffset),
			i = dash.indexOf(",");
		if (i < 0) {
			i = dash.indexOf(" ");
		}
		dash = (i < 0) ? length : parseFloat(dash.substr(0, i)) || 0.00001;
		if (dash > length) {
			dash = length;
		}
		return [Math.max(0, -offset), Math.max(0, dash - offset)];
	}

	DrawSVGPlugin = _gsScope._gsDefine.plugin({
		propName: "drawSVG",
		API: 2,
		version: "0.0.9",
		global: true,
		overwriteProps: ["drawSVG"],

		init: function(target, value, tween) {
			if (!target.getBBox) {
				return false;
			}
			var length = getLength(target) + 1,
				start, end, overage;
			this._style = target.style;
			if (value === true || value === "true") {
				value = "0 100%";
			} else if (!value) {
				value = "0 0";
			} else if ((value + "").indexOf(" ") === -1) {
				value = "0 " + value;
			}
			start = getPosition(target, length);
			end = parse(value, length, start[0]);
			this._length = length + 10;
			if (start[0] === 0 && end[0] === 0) {
				overage = Math.max(0.00001, end[1] - length); //allow people to go past the end, like values of 105% because for some paths, Firefox doesn't return an accurate getTotalLength(), so it could end up coming up short.
				this._dash = length + overage;
				this._offset = length - start[1] + overage;
				this._addTween(this, "_offset", this._offset, length - end[1] + overage, "drawSVG");
			} else {
				this._dash = (start[1] - start[0]) || 0.000001; //some browsers render artifacts if dash is 0, so we use a very small number in that case.
				this._offset = -start[0];
				this._addTween(this, "_dash", this._dash, (end[1] - end[0]) || 0.00001, "drawSVG");
				this._addTween(this, "_offset", this._offset, -end[0], "drawSVG");
			}
			return true;
		},

		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
		set: function(ratio) {
			if (this._firstPT) {
				this._super.setRatio.call(this, ratio);
				this._style.strokeDashoffset = this._offset;
				if (ratio === 1 || ratio === 0) {
					this._style.strokeDasharray = (this._offset < 0.001 && this._length - this._dash <= 10) ? "none" : (this._offset === this._dash) ? "0px, 999999px" : this._dash + "px," + this._length + "px";
				} else {
					this._style.strokeDasharray = this._dash + "px," + this._length + "px";
				}
			}
		}

	});

	DrawSVGPlugin.getLength = getLength;
	DrawSVGPlugin.getPosition = getPosition;

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }