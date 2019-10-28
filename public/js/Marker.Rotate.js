/*
 * Based on comments by @runanet and @coomsie 
 * https://github.com/CloudMade/Leaflet/issues/386
 *
 * Wrapping function is needed to preserve L.Marker.update function
 */
(function () {
	let _old__setPos = L.Marker.prototype._setPos;
	L.Marker.include({
		_updateImg: function (i, a, s) {
			a = L.point(s).divideBy(2)._subtract(L.point(a));
			let transform = '';
			transform += ' translate(' + -a.x + 'px, ' + -a.y + 'px)';
			transform += ' rotate(' + this.options.iconAngle + 'deg)';
			transform += ' translate(' + a.x + 'px, ' + a.y + 'px)';
			i.style[L.DomUtil.TRANSFORM] += transform;
		},
		
		_getShortestEndDegree: function (startDegrees, endDegrees) {
			let turnAngle = Math.abs(endDegrees - startDegrees);
			let turnAnglePositive = (endDegrees - startDegrees) >= 0;
			if (turnAngle <= 180) return endDegrees;
			let result = startDegrees + (360 - turnAngle) * (turnAnglePositive ? -1 : 1);
			return result;
		},

		setIconAngle: function (iconAngle) {
			// find shortest angle to turn over
			this.options.iconAngle = this._getShortestEndDegree(this.options.iconAngle || 0, iconAngle);
			if (this._map)
				this.update();
		},

		_setPos: function (pos) {
			if (this._icon)
				this._icon.style[L.DomUtil.TRANSFORM] = '';
			if (this._shadow)
				this._shadow.style[L.DomUtil.TRANSFORM] = '';

			_old__setPos.apply(this,[pos]);

			if (this.options.iconAngle) {
				let defaultIcon = new L.Icon.Default();
				let a = this.options.icon.options.iconAnchor || defaultIcon.options.iconAnchor;
				let s = this.options.icon.options.iconSize || defaultIcon.options.iconSize;
				let i;
				if (this._icon) {
					i = this._icon;
					this._updateImg(i, a, s);
				}
				if (this._shadow) {
					if (this.options.icon.options.shadowAnchor)
						a = this.options.icon.options.shadowAnchor;
					s = this.options.icon.options.shadowSize;
					i = this._shadow;
					this._updateImg(i, a, s);
				}
			}
		}
	});
}());