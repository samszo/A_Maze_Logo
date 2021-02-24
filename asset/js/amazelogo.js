class amazelogo {
    constructor(params) {
        var me = this;
        this.idCont = params.idCont;
        this.cont = d3.select("#"+params.idCont);
        this.textes = params.textes ? params.textes : [
            ["ARCANES"]
        ];
        this.nbCol = params.nbColo ? params.nbColo : 10;        
        this.nbRow = params.nbRow ? params.nbRow : 6;        
        this.width = params.width ? params.width : this.cont.node().offsetWidth;
        this.height = params.height ? params.height : this.cont.node().offsetHeight;
        /*
        this.anime = params.anime ? params.anime : false;
        this.fontFileName = params.fontFileName ? params.fontFileName : 'asset/fonts/slkscr.ttf';        
        this.fontFamily = params.fontFamily ? params.fontFamily : "sans-serif";
        this.regleColor = params.regleColor ? params.regleColor : "red";
        this.txtColor = params.txtColor ? params.txtColor : "black";
        this.duree = params.duree ? params.duree : 1;//en seconde
        this.delais = params.delais ? params.delais : 250;//en milliseseconde
        this.boutons = params.boutons ? params.boutons : false;
        this.fctEnd = params.fctEnd ? params.fctEnd : false;
        this.fctPause = params.fctPause ? params.fctPause : false;
        this.fctChange = params.fctChange ? params.fctChange : false;
        this.fctClickRegle = params.fctClickRegle ? params.fctClickRegle : pauseChangeText;
        this.fctEndAlterneTexte = params.fctEndAlterneTexte ? params.fctEndAlterneTexte : false;
        this.interpolateColor = params.interpolateColor ? params.interpolateColor : d3.interpolateTurbo;
        this.animations = params.animations ? params.animations : [];
        this.f;
        */
        var svg, global, contPre, margin=6, arrMaze=[]
            , scaleH = d3.scaleLinear().domain([0, me.nbRow*2+1]).range([margin*2, me.height-margin])
            , scaleW = d3.scaleLinear().domain([0, me.nbCol*4+1]).range([margin*2, me.width-margin]);
        /*
            , color = d3.scaleSequential().domain([1,100])
                .interpolator(me.interpolateColor)//d3.interpolateWarm
            , aleaColor = d3.randomUniform(0, 100)
            , tl
            , rapportFont=0.8, fontSize=20, fontSizeRedim=fontSize*rapportFont
            , btnPause, btnPlay, btnReload, bPause = false, chars=[]
            , regle, arrTextes=[], arrTextesSelect=[], curdim
            ;            
        */

        this.init = function () {
            
            svg = this.cont.append("svg")
                .attr("id", me.idCont+'svgMazeLogo')
                .attr("width",me.width+'px').attr("height", me.height+'px')
                .style("margin",margin+"px");            
            global = svg.append("g").attr("id",me.idCont+'svgMazeLogoGlobal');
            contPre = this.cont.append("pre").attr("id",me.idCont+'preMazeLogo');
            //construction du labyrinthe aléatoire suivant les dimensions
            arrMaze = maze(me.nbRow,me.nbCol);
            //dessine le labyrinte en texte
            contPre.html(displayText(arrMaze));
            //calcule les paths du labyrinthe en svg 
            let pp = displayPath(arrMaze);
            //dessine les points du labyrinte en svg
            global.append('g').attr('id','points').selectAll('.point').data(pp.points).enter().append('path')
                .attr("class", "point")
                .attr("id", (d,i)=>"point"+i)
                .style("stroke", "black")
                .style("fill", "red")
                .attr("d", d=>d)
            //dessine les murs du labyrinte en svg
            global.append('g').attr('id','murs').selectAll('.mur').data(pp.murs).enter().append('path')
                .attr("class", "mur")
                .attr("id", (d,i)=>"mur"+i)
                .style("stroke", "red")
                .style("stroke-width",margin)
                .style("fill", "black")
                .attr("d", d=>d.d)
            //ajoute un rectangle qui bouge
              
        }

        function maze(x,y) {
            var n=x*y-1;
            if (n<0) {alert("illegal maze dimensions");return;}
            let horiz =[],verti =[],next; 
            for (var j= 0; j<x+1; j++) horiz[j]= [];
            for (var j= 0; j<x+1; j++) verti[j]= [];
            let here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
                path = [here],
                unvisited = [];
            for (var j = 0; j<x+2; j++) {
                unvisited[j] = [];
                for (var k= 0; k<y+1; k++)
                    unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
            }
            while (0<n) {
                var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
                    [here[0]-1, here[1]], [here[0],here[1]-1]];
                var neighbors = [];
                for (var j = 0; j < 4; j++)
                    if (unvisited[potential[j][0]+1][potential[j][1]+1])
                        neighbors.push(potential[j]);
                if (neighbors.length) {
                    n = n-1;
                    next= neighbors[Math.floor(Math.random()*neighbors.length)];
                    unvisited[next[0]+1][next[1]+1]= false;
                    if (next[0] == here[0])
                        horiz[next[0]][(next[1]+here[1]-1)/2]= true;
                    else 
                        verti[(next[0]+here[0]-1)/2][next[1]]= true;
                    path.push(here = next);
                } else 
                    here = path.pop();
            }
            return {x: x, y: y, horiz: horiz, verti: verti};
        }

        function displayText(m) {
            var text= [];
            for (var j= 0; j<m.x*2+1; j++) {
                var line= [];
                if (0 == j%2)
                    for (var k=0; k<m.y*4+1; k++)
                        if (0 == k%4) 
                            line[k]= '+';
                        else
                            if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
                                line[k]= ' ';
                            else
                                line[k]= '-';
                else
                    for (var k=0; k<m.y*4+1; k++)
                        if (0 == k%4)
                            if (k>0 && m.horiz[(j-1)/2][k/4-1])
                                line[k]= ' ';
                            else
                                line[k]= '|';
                        else
                            line[k]= ' ';
                if (0 == j) line[1]= line[2]= line[3]= ' ';
                if (m.x*2-1 == j) line[4*m.y]= ' ';
                text.push(line.join('')+'\r\n');
            }
            return text.join('');
        }

        function displayPath(m) {
            var points = [], murs=[];
            for (var j= 0; j<m.x*2+1; j++) {
                var line= d3.path();
                if (0 == j%2)
                    for (var k=0; k<m.y*4+1; k++)
                        if (0 == k%4) 
                            points.push(getCirclePath(k,j,margin));//'+';
                        else
                            if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
                                line.moveTo(scaleW(k+1), scaleH(j));// ' ';
                            else
                                line.lineTo(scaleW(k+1), scaleH(j));//'-';
                else
                    for (var k=0; k<m.y*4+1; k++)
                        if (0 == k%4)
                            if (k>0 && m.horiz[(j-1)/2][k/4-1])
                                line.moveTo(scaleW(k+1), scaleH(j));// ' ';
                            else{
                                //murs verticaux
                                let vline = d3.path();
                                vline.moveTo(scaleW(k), scaleH(j-1))
                                vline.lineTo(scaleW(k), scaleH(j+1));//= '|';
                                murs.push({'j':j,'k':k,'d':vline.toString()});
                            }
                        else
                            line.moveTo(scaleW(k+1), scaleH(j));// = ' ';
                if (0 == j){
                    //ligne du haut
                    line= d3.path();
                    line.moveTo(scaleW(4), scaleH(j))//'   ';
                    line.lineTo(scaleW(k-1), scaleH(j));
                    murs.push({'j':j,'k':k,'d':line.toString()});
                }else{
                    let d = line.toString();
                    if(d.substring(0,1)=='L'){
                        d="M"+scaleW(0)+','+scaleH(j)+d;
                    }
                    murs.push({'j':j,'k':k,'d':d});
                }                 
            }
            //l'avant dernier mur invisible et la sortie
            console.log(murs);
            murs.splice(-3, 2);
            console.log(murs);
            return {'points':points,'murs':murs};
        }

        function getCirclePath(x, y, radius){
            var context = d3.path();
            context.arc(scaleW(x), scaleH(y), radius, 0, 2 * Math.PI);
            return context.toString();
        }
  
        this.hide = function(){
          svg.attr('visibility',"hidden");
        }
        this.show = function(){
          svg.attr('visibility',"visible");
        }

         me.init();

    }
}
