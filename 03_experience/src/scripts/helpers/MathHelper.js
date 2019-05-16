

class MathHelper {
  static drawCircleSegment(graphics, center, start, end, r, h_ratio, v_ratio, new_drawing){
      var x = center.x;
      var y = center.y;
      // first point of the circle segment
      if(new_drawing)
      {
          graphics.moveTo(x+Math.cos(start)*r*h_ratio, y+Math.sin(start)*r*v_ratio);
      }

      // draw the circle in segments
      var segments = 8;

      var theta = (end-start)/segments;
      var angle = start; // start drawing at angle ...

      var ctrlRadius = r/Math.cos(theta/2); // this gets the radius of the control point
      for (var i = 0; i<segments; i++) {
           // increment the angle
           angle += theta;
           var angleMid = angle-(theta/2);
           // calculate our control point
           var cx = x+Math.cos(angleMid)*(ctrlRadius*h_ratio);
           var cy = y+Math.sin(angleMid)*(ctrlRadius*v_ratio);
           // calculate our end point
           var px = x+Math.cos(angle)*r*h_ratio;
           var py = y+Math.sin(angle)*r*v_ratio;
           // draw the circle segment
           graphics.quadraticCurveTo(cx, cy, px, py);
      }
  }

  static radiusToPI(nu){
    return nu * Math.PI/180;
  }

  static hexToRGB(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

  static hexToDec(hex){
    hex = hex.replace("#","");
    hex = hex.toLowerCase();

    return parseInt(hex, 16);
  }

  static distanceBetweenTwoPoints(el1, el2){
    return Math.sqrt(Math.pow(el1.x - el2.x, 2) + Math.pow(el1.y - el2.y, 2));
  }

  static angleBetweenTwoPoints(el1, el2){
    return Math.atan2(el2.y - el1.y, el2.x - el1.x)*180/Math.PI;
  }


  static randomizeArray(array){
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  static checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
      // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
      var denominator, a, b, numerator1, numerator2, result = {
          x: null,
          y: null,
          onLine1: false,
          onLine2: false
      };
      denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
      if (denominator == 0) {
          return result;
      }
      a = line1StartY - line2StartY;
      b = line1StartX - line2StartX;
      numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
      numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
      a = numerator1 / denominator;
      b = numerator2 / denominator;

      // if we cast these lines infinitely in both directions, they intersect here:
      result.x = line1StartX + (a * (line1EndX - line1StartX));
      result.y = line1StartY + (a * (line1EndY - line1StartY));
  /*
          // it is worth noting that this should be the same as:
          x = line2StartX + (b * (line2EndX - line2StartX));
          y = line2StartX + (b * (line2EndY - line2StartY));
          */
      // if line1 is a segment and line2 is infinite, they intersect if:
      var b1= false;
      var b2= false;
      if (a > 0 && a < 1) {
          b1 = true;
      }
      // if line2 is a segment and line1 is infinite, they intersect if:
      if (b > 0 && b < 1) {
          b2 = true;
      }
      // if line1 and line2 are segments, they intersect if both of the above are true
      return b1 && b2;
  }
}


export default MathHelper;
