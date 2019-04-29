

export default class THREEEnvironmentHelper {

  static toScreenPosition(obj, camera, renderer)
  {
      var vector = new THREE.Vector3();

      var widthHalf = 0.5*renderer.context.canvas.width;
      var heightHalf = 0.5*renderer.context.canvas.height;

      obj.updateMatrixWorld();
      vector.setFromMatrixPosition(obj.matrixWorld);
      vector.project(camera);

      vector.x = ( vector.x * widthHalf ) + widthHalf;
      vector.y = - ( vector.y * heightHalf ) + heightHalf;

      return {
          x: vector.x,
          y: vector.y
      };
  }

  static toLatLng(vector){
    return (vector.x/50).toFixed(4) + "," + (vector.z/50).toFixed(4);
  }

  static getDistance(v1,v2){
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;
    var number = Math.sqrt( dx * dx + dy * dy + dz * dz );
    // number /= 10000;

    return number;
  }

  static getAngleBetweenPoints(v1,v2){
    return Math.atan2(v2.z - v1.z, v2.x - v1.x);
  }
}
