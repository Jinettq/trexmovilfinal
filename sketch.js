
var trex;
var trex_corriendo;


var suelo;
var nubes;
var nube_juego;
var obstaculo;

var obs1; 
var obs2; 
var obs3; 
var obs4; 
var obs5; 
var obs6;


var play = 1
var fin = 0
var estado_juego = play

var trex_choca;
var reinicio;

var img_reinicio
var img_game_over

var fin_juego


function preload(){
  

  trex_corriendo = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  suelo_del_juego= loadImage("suelo2.png") 
  nube_juego= loadImage("nube.png")
  obs1 = loadImage("obstaculo1.png")
  obs2 = loadImage("obstaculo2.png")
  obs3 = loadImage("obstaculo3.png")
  obs4 = loadImage("obstaculo4.png")
  obs5 = loadImage("obstaculo5.png")
  obs6 = loadImage("obstaculo6.png")
  trex_choca = loadAnimation("trex_choca.png")
  fin_juego = loadAnimation("gameOver.png")
  reinicio = loadAnimation("reinicio.png")

  sonido_puntos = loadSound("gana_punto.mp3")
  sonido_salto = loadSound("salto.mp3")
  sonido_muerte = loadSound("trex_muere.mp3")
}


function setup(){

//--------------MODIFICACION DEL TAMAÑO DE PANTALLA
  createCanvas(windowWidth,windowHeight)
  
  //-------MODIFICAMOS LA POSICION DE REX DE ACUERDO A LA PANTALLA
  trex = createSprite(50,height-10, 40, 40)
  trex.addAnimation("trex_corriendo", trex_corriendo)

  trex.addAnimation("trex_choca", trex_choca)

  trex.setCollider("circle", 0, 0, 40)
  //trex.debug= true

  trex.scale = 0.5;
  trex.x = 50;

  bordes = createEdgeSprites();
  
  //---cambia posicion del suelo
  suelo =createSprite(width/2 ,height - 50, 600,20)
  suelo.addAnimation("suelo_del_juego", suelo_del_juego)

  //-------MODIFICAMOS LA POSICION DE REX DE ACUERDO A LA PANTALLA
  suelo_invisible = createSprite(width / 2, height - 20, width, 20)
  suelo_invisible.visible = false
 
  puntos = 0

  grupo_nubes = new Group()
  grupo_cactus = new Group()

  //---cambias la posicion de la img de game over
  img_game_over = createSprite(width/2 , height/2)
  img_game_over.addAnimation("fin_juego", fin_juego)
  img_game_over.visible = false

  //---cambias la posicion de sprite de reinicio
  img_reinicio = createSprite(width/2 , 50 + heigth/2)
  img_reinicio.scale =0.05
  img_reinicio.addAnimation("reinicio", reinicio)
  img_reinicio.visible = false

  img_game_over.scale = 0.5
  img_reinicio.scale = 0.3
}


function draw()
{

  background("mistyrose")
  
  textSize(15)
  text("Puntos = " + puntos, 10, 20)

    if(estado_juego === play)
    {

      puntos = puntos + (Math.round(getFrameRate()/60))
      suelo.velocityX = -3 - (puntos/100)

      if(suelo.x < 0)
      {
      suelo.x = suelo.width / 2
      }

        //----------hacemos cambio a touch en lugar de tecla
      if(((touches.length >0 ) || (keyDown("space"))) && (trex.y >= height -100))
        {
          trex.velocityY = -11;
          sonido_salto.play()
          //reinicio de matriz de touch para el sgte toque en pantalla
          touches = []
        }
     
      trex.velocityY = trex.velocityY + 0.8;


      generar_nubes()
      generar_obstaculos()

  
      if(grupo_cactus.isTouching(trex))
      {
        sonido_muerte.play()
        estado_juego = fin
      }

      if(((puntos > 0) && (puntos % 100)) === 0)
      {
        sonido_puntos.play()
      }
    }

    else if(estado_juego === fin)
    {
      suelo.velocityX = 0
      trex.velocityY = 0

      grupo_cactus.setVelocityEach(0)
      grupo_nubes.setVelocityEach(0)

      trex.changeAnimation("trex_choca", trex_choca)


      grupo_nubes.setLifetimeEach(-1)
      grupo_cactus.setLifetimeEach(-1)

      grupo_cactus.destroyEach()
      grupo_nubes.destroyEach()

      img_game_over.visible = true
      img_reinicio.visible = true

        if(mousePressedOver(img_reinicio))
        {
          console.log("juego reiniciado")
          reinicio_juego()
        }

    }

 
    trex.collide(bordes[3])
    trex.collide(suelo_invisible)
    
    drawSprites();
}



function generar_nubes()
{

  if(frameCount %60 === 0)
  {
    nubes = createSprite(550, windowHeight -100, 40, 20)
    nubes.addImage(nube_juego)
    nubes.scale=0.7

    nubes.y = Math.round(random(10,80))
    nubes.velocityX = -3

    nubes.lifetime =190
    nubes.depth = trex.depth
    trex.depth = trex.depth + 3
    
    grupo_nubes.add(nubes)
  }
  
}


function generar_obstaculos()
{
   if(frameCount%60 === 1)
   {
      obstaculo = createSprite(580, windowHeight -50, 20, 40)
      obstaculo.velocityX = -3 - (puntos/100)

      var numero= Math.round(random(1,6))

      switch(numero)
      {
      case 1:
        obstaculo.addImage(obs1)
        break
      case 2:
        obstaculo.addImage(obs2)
        break
      case 3:
        obstaculo.addImage(obs3)
        break
      case 4:
        obstaculo.addImage(obs4)
        break
      case 5:
        obstaculo.addImage(obs5)
        break
      case 6:
        obstaculo.addImage(obs6)
        break
      default:
        break
      }

      obstaculo.scale = 0.4
      obstaculo.lifetime = 200
      
      grupo_cactus.add(obstaculo)
   }
}


function reinicio_juego(){
  estado_juego = play
  puntos = 0
  img_game_over.visible =false
  img_reinicio.visible = false

  grupo_cactus.destroyEach()
  grupo_nubes.destroyEach()

  trex.changeAnimation("trex_corriendo", trex_corriendo)

}