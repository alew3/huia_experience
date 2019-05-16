export default class ImageHelper{
  static context = null;
  static img = null;
  static width = null;
  static height = null;
  static container = null;

  //return array with height data from img
  static getHeightData(img,scale){

   if (scale == undefined) scale=1;

      // if(ImageHelper.context == null){
        var canvas = document.createElement( 'canvas' );
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext( '2d' );

        var size = img.width * img.height;
        var data = new Float32Array( size );

        context.drawImage(img,0,0);
      // }

      for ( var i = 0; i < size; i ++ ) {
          data[i] = 0
      }

      var imgd = context.getImageData(0, 0, img.width, img.height);
      var pix = imgd.data;

      var j=0;
      for (var i = 0; i<pix.length; i +=4) {
          var all = pix[i]+pix[i+1]+pix[i+2];
          data[j++] = all/(12*scale);
      }

      return data;
  }

  static setImageAltitude(img){
      ImageHelper.width = img.width;
      ImageHelper.height = img.height;

      var canvas = document.createElement( 'canvas' );
      canvas.width = img.width;
      canvas.height = img.height;
      var context = canvas.getContext( '2d' );

      var size = img.width * img.height;
      var data = new Float32Array( size );

      context.drawImage(img,0,0);
      ImageHelper.context = context;

      canvas.style.width = "400px";
      canvas.style.height = "400px";
      canvas.style.position = "absolute";
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      // document.body.appendChild(canvas);

      this.container = document.createElement("div");
      this.container.style.overflow = "hidden";
      this.container.style.width = "400px";
      this.container.style.height = "400px";
      this.container.style.position = "absolute";
      this.container.style.top = "0px";
      this.container.style.left = "0px";
      this.container.append(canvas);

      var bullet = document.createElement("div");
      bullet.style.position = "absolute";
      bullet.style.display = "block";
      bullet.style.width = "10px";
      bullet.style.height = "10px";
      bullet.style.background = "#ff0000";
      bullet.style.top = "0px";
      bullet.style.left = "0px";
      this.container.append(bullet);
      // document.body.append(this.container);
  }

  static getPixelColor(x,y){
    // var posx = (ImageHelper.width/2)+(x*(ImageHelper.width/2));
    // var posy = (ImageHelper.height/2)+(y*(ImageHelper.height/2));
    var posx = ImageHelper.width * x;
    var posy = ImageHelper.width * y;
    var pixelData = ImageHelper.context.getImageData(posx, posy, 1, 1).data;
    var all = pixelData[0]+pixelData[1]+pixelData[2];

    TweenMax.set(this.container.children[1], {x : x*400, y : y*400});
    return all;
  }
}
