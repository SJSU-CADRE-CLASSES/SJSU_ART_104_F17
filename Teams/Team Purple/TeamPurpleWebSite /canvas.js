var canvas = document.getElementById('canvas'),
      georgeDistance = document.getElementById('georgeDistance'),
      newmanDistance = document.getElementById('newmanDistance'),
      jerryDistance = document.getElementById('jerryDistance'),
      ctx = canvas.getContext('2d'),
      width = canvas.width = window.innerWidth * 0.475,
      height = canvas.height = window.innerHeight *0.8,
      route = Route.createRandom({
        width: width,
        height: height,
        count: 15
      }),
      george = new GeorgeController({
        ctx: ctx,
        width: width,
        height: height,
        route: route
      }),
      newman = new NewmanController({
        ctx: ctx,
        width: width,
        height: height,
        route: route
      }),
      jerry = new JerryController({
        ctx: ctx,
        width: width,
        height: height,
        route: route
      });

  var myVar = setInterval(function() {run()}, 0);

  function run(){
  	//draw background;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = 'rgb(0,0,0)';//'rgb(32, 36, 45)';
    ctx.fill();

    //draw points
    var points = route.points,
        point,
        i = 0,
        max = points.length;
    //color points
      ctx.strokeStyle = 'rgb(244, 254, 255)';
      ctx.lineWidth = 20;
    for (; i < max; i++) {

      point = points[i];
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    george
        .update()
        .drawRoute();
    newman
        .update()
        .drawRoute();
    jerry
        .update()
        .drawRoute();

    georgeDistance.innerHTML = george.foundShortestRoute.distance.toString();
    newmanDistance.innerHTML = newman.foundShortestRoute.distance.toString();
    if (jerry.colony.globalBest !== null) {
      jerryDistance.innerHTML = jerry.colony.globalBest.tour.updateDistance().toString();
    }
  
  }