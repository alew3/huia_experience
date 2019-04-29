/**
* @author Paulo Araujo
*/

export default class WireframeShader  {
  constructor(){

    //uniforms sao os valores que podem ser setados de fora do shader em tempo real
    //os THREE.UniformsLib são os padrao que a Three usa para as config basicas do material
    //as ultimas como timeLowFrequency e light position sao customizações minhas
    this.uniforms = THREE.UniformsUtils.merge(  [

      THREE.UniformsLib[ "common" ],
      THREE.UniformsLib[ "aomap" ],
      THREE.UniformsLib[ "fog" ],
      THREE.UniformsLib[ "shadowmap" ],
      {
        "tintColor": {
          type: 'c',
          value: new THREE.Color( 0x00FFFF00 )
        },
        "tintFlag": {
          type: 'v2',
          value: new THREE.Vector2( .01 , 0 )
        },
        "timeLowFrequency": {
          type: 'float',
          value: 1.0
        },
        "timeMidFrequency": {
          type: 'float',
          value: 1.0
        },
        "timeHighFrequency": {
          type: 'float',
          value: 1.0
        },
        "currentTimeValue": {
          type: 'float',
          value: 1.0
        },
        //posicao de luz que vem do JS
        "lightPosition": {
          type: 'v3',
          value: new THREE.Vector3( 1.0, 1.0 , 1.0 )
        }
        ,"dimmEffect": {
          type: 'float',
          value: 1.0
        }
      }
    ] );

    this.vertexShader = [
      THREE.ShaderChunk[ "common" ],
      THREE.ShaderChunk[ "uv_pars_vertex" ],
      THREE.ShaderChunk[ "uv2_pars_vertex" ],
      THREE.ShaderChunk[ "envmap_pars_vertex" ],
      THREE.ShaderChunk[ "color_pars_vertex" ],
      THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
      THREE.ShaderChunk[ "skinning_pars_vertex" ],
      THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
      THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

      "uniform vec3 tintColor;",
      "uniform vec3 lightPosition;",

      //declaracao das uniforms que serao usadas (valores passados do JS para o shader)
      "uniform float timeLowFrequency;",
      "uniform float timeMidFrequency;",
      "uniform float dimmEffect;",
      "uniform float timeHighFrequency;",
      "uniform float currentTimeValue;",

      //ja estavam no shader wireframe basico da Three. quem sabe de pra tirar
      "varying vec3 vTintColor;",
      "uniform vec2 tintFlag;",
      "varying vec2 vTintFlag;",

      //varying -> valores que sao setados no vertex e poderao ser acessados no fragment
      "varying vec3 vNormal;",
      "varying vec3 vPosition;",

      "void main() {",

      //"position = position;",

      "vTintColor = tintColor;",
      "vTintFlag = tintFlag;",

      //shader chunks padrao da ThreeJs para aplicar coisas como:
      //animacao, cor, feature de wireframe basica, etc
      //tirei todas as que eu sabia que nao ia precisar,
      //mas pode ser que de pra tirar mais coisas para melhorar o desempenho.
      //só lembrar de tirar o chunk correspondente do fragmente shader tambem senao provavelmente vai dar bug
      THREE.ShaderChunk[ "color_vertex" ],
      THREE.ShaderChunk[ "skinbase_vertex" ],
      THREE.ShaderChunk[ "begin_vertex" ],
      THREE.ShaderChunk[ "morphtarget_vertex" ],
      THREE.ShaderChunk[ "skinning_vertex" ],
      THREE.ShaderChunk[ "project_vertex" ],
      THREE.ShaderChunk[ "worldpos_vertex" ],

      //guardando o valor da normal para se usado no fragmentShader, se necessário para animacao/cor
      "vNormal = normal;",


      //exemplo de animacao dos vertices usando normal e os 3 timers passados por parametro
      //  "float displacementFactor = position.x*(vNormal.x*timeMidFrequency)*(timeHighFrequency)*.02;",
      //  "float displacementFactor2 = position.y*(vNormal.y*timeLowFrequency)*(timeHighFrequency)*.02;",
      //  "float displacementFactor3 = position.z*(vNormal.z*timeHighFrequency)*(timeHighFrequency)*.02;",
      //  "vec4 translatePosition = vec4(0.0+displacementFactor, 0.0+displacementFactor2, -0.1-(displacementFactor3), 0.0);",

      //faço o vertice ficar um pouco mais pra frente (-0.1) da tela do que o resto do corpo
      "vec4 translatePosition = vec4(0.0, 0.0, -0.1, 0.0);",
      "gl_Position = gl_Position+(translatePosition);",

      //guardo o valor da posicao do vertice para ser usado no fragmentShader
      "vPosition = position;",

      "}"
    ].join( "\n" );

    this.fragmentShader = [

      //declarando as uniforms que vou ler no fragmentShader
      "uniform vec3 diffuse;",
      "uniform float opacity;",
      "uniform float timeLowFrequency;",
      "uniform float timeMidFrequency;",
      "uniform float timeHighFrequency;",
      "uniform float currentTimeValue;",
      "uniform float dimmEffect;",
      "uniform vec3 lightPosition;",

      //valores passados pelo vertex shader
      "varying vec3 vTintColor;",
      "varying vec2 vTintFlag;",
      "varying vec3 vNormal;",
      "varying vec3 vPosition;",


      //uniforms e var default
      THREE.ShaderChunk[ "common" ],
      THREE.ShaderChunk[ "color_pars_fragment" ],
      THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],


      "vec3 getColorValue(vec3 sourceColor, vec3 colorRef, float stepValue, float cf, float diffIncrease, float divValue){",
      "float diff = 1.0-abs((cf-stepValue));",
      "diff = diff*5.0;",
      "diff = min(1.0, (5.0-diff)/5.0);",
      "float colorMult =  min(1.0, diff);",
      "return colorMult*colorRef.rgb;",
      "}",

      "void main() {",

      //como wireframe ta setado para true no material,
      //aqui os fragmentos que estao chegando ja devem ser os do wire

      //o fragmento é, por padrão invisivel
      "float thisFragmentAlpha = 0.0;",
      //checo a distancia da posicao do fragmento (nesse caso é a pos do vertice interpolada pro frag)...
      //.. pra pos da Luz/ponteiro do mouse que foi enviada pelo JS manualmante
      "float distance = 0.0;",

      //só faço o calculo de visibilidade se o verticel está com normal olhando na direção da camera (para evitar vertices da parte traseira das asas ou patas de aparecer)
      //o calculo pode nao ser muito correto e certamente vai dar merda se o passaro se virar na hora
      //em ultimo caso pode ser necessário fazer um calculo para saber se a normal esta olhando para a Luz ou nao
    //  "if(vNormal.r>0.0){",
      "distance = length(lightPosition - vPosition);",
      "distance = 1.0-(distance*.3);",
      "thisFragmentAlpha = distance;",
      //"}",

      //dando uma atenuado da intensidade do efeito de wire
      "thisFragmentAlpha *= 0.7;",

      //mostra todo o wireframe ignorando as regas de distancia pra luz
      //"thisFragmentAlpha = 1.0;",


      //animações de cor usando as uniforms de tempo como base
      "float timeValueR = timeLowFrequency*1.3;",
      "float timeValueG = timeMidFrequency*0.3;",
      "float timeValueB = (1.0-timeMidFrequency);",

      "float componentR = .0+timeValueR*vPosition.r*distance;",
      "float componentG = .0+timeValueG*vPosition.g*distance;",
      "float componentB = .0+timeValueB*(vPosition.b)*distance;",




      //141432
      "vec3 color1 = vec3(0.07, 0.07, 0.19);",
      "vec3 color2 = vec3(0.58, 0.43, 0.86);",
      "vec3 color3 = vec3(0.38, 0.76, 0.70);",
      "vec3 color4 = vec3(1.0, 0.39, 0.45);",
      "vec3 color5 = vec3(0.07, 0.07, 0.19);",


      "float cf = 0.95;",
      "vec3 finalColor = vec3(0.0, 0.0, 0.0);",

      "float diff;",
      "float divValue = 2.0;",
      "float diffIncrease = 1.0;",
      "finalColor.rgb = vec3(0.0, 0.0, 0.0);",

      //"cf = ((vPosition.g*timeHighFrequency)*.3)+(timeMidFrequency*.7) ;",
      //"cf = (vPosition.g*.0)+(timeMidFrequency-(vPosition.g*.3));",


      //"cf = (((timeLowFrequency+.2)*((vPosition.b*.7)*timeLowFrequency))*.19)+.0;",
      "cf = (((timeLowFrequency+.2))*.19)+.0;",
      //"cf = (timeLowFrequency);",


      "finalColor.rgb += getColorValue(finalColor, color2, 0.00, cf, diffIncrease, divValue);",
      "finalColor.rgb += getColorValue(finalColor, color2, 0.50, cf, diffIncrease, divValue);",
      "finalColor.rgb += getColorValue(finalColor, color2, 0.75, cf, diffIncrease, divValue);",
      //"finalColor.rgb += getColorValue(finalColor, color3, 0.99, cf, diffIncrease, divValue);",



      //seto as cores e o alpha do fragmento de acordo com os calculos previos
      //"gl_FragColor = vec4( componentR, componentG, componentB, thisFragmentAlpha );",
      "gl_FragColor = vec4( finalColor.r, finalColor.g, finalColor.b, thisFragmentAlpha*dimmEffect );",

      "}"
    ].join( "\n" );

  }



};
