
import {path} from './path';
import{ toastShort} from "../utils/ToastUtil";

let points=null;

function init()
{
    points = {};

    let saved;
    try {
        saved = JSON.parse(path);
    }
    catch (e)
    {
        toastShort('加载导航路径失败！');
        return false;
    }
    for (var s in saved)
    {
        let key = parseInt(s);
        if (!isNaN(key))
        {
            let pt = new Point(saved[s].x, saved[s].y);
            pt.key = key;
            pt.temp = saved[s]["visiblePt"];
            points[pt.key] = pt;
        }    
    }
    for (var i in points)
    {
        let pt = points[i];
        for (let k = 0; k < pt.temp.length; k++)
        {
            pt.addVisiblePt(points[pt.temp[k]]);
        }
    } 
    return true;
}
export function findPathAny(x0,y0,x1,y1)
{
    let startP = new Point(x0,y0);
    let endP = new Point(x1,y1);
    let d = Date.now();
    let shortestStart;
    let shortestEnd;
    let starta;
    let startb;
    let enda:Point;
    let endb: Point;
    if(!points && !init())
    {
        return;    
    }
    for (var i in points)
    {
        let p = points[i];
        for (var k in p.visiblePoint)
        {
            if (p.key < p.visiblePoint[k].key)
            {
                let t = GetDistance(p, p.visiblePoint[k], startP);
                let t2 = GetDistance(p, p.visiblePoint[k], endP);
                if (shortestStart==null || t < shortestStart)
                {
                    shortestStart = t;
                    starta = p;
                    startb = p.visiblePoint[k];
                }  
                if (shortestEnd==null || t2 < shortestEnd)
                {
                    shortestEnd = t2;
                    enda = p;
                    endb = p.visiblePoint[k];
                }   
            }    
        }
    } 
    let start = getnearestpoint(starta, startb, startP);
    let end = getnearestpoint(enda, endb, endP);

    if ((starta == enda && startb == endb) || (starta == endb && startb == enda))
    {
        return [start,end];
    }    
    else
    {
        if (end != enda && end != endb)
        {
            end.key = -1;
            enda.addVisiblePt(end);
            endb.addVisiblePt(end);
        } 
        if (start != starta && start != startb)
        {
            start.addVisiblePt(starta);
            start.addVisiblePt(startb);
        }   
        let path = [startP].concat(findPath(start, end),[endP]);
        if (end != enda && end != endb)
        {
            enda.removeVisiblePt(end);
            endb.removeVisiblePt(end);
        }  
        return path;   
    }
    
    console.log(Date.now() - d, "findany");
}
function GetDistance(PA:Point, PB:Point, P3:Point)  
{  
    let a,b,c;  
    a=GetPointDistance(PB,P3);  
    if(a<=0)   
        return 0;   
    b=GetPointDistance(PA,P3);  
    if(b<=0)   
        return 0;  
    
    c = GetPointDistance(PA, PB);  
    if(c<=0)   
        return a;
    if(a*a>=b*b+c*c)
        return b;   
    if(b*b>=a*a+c*c)
        return a; 
    let l=(a+b+c)/2;     //周长的一半  
    let s=Math.sqrt(l*(l-a)*(l-b)*(l-c));  //海伦公式求面积，也可以用矢量求  
    return (2 * s / c);
}
function GetPointDistance(p1:Point, p2:Point)   
{  
    return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));  
}  
function getnearestpoint(PA:Point, PB:Point, P3:Point)  
{  
    let a,b,c;  
    a=GetPointDistance(PB,P3);  
    b=GetPointDistance(PA,P3);  
    c = GetPointDistance(PA, PB);  
    if(c<=0)   
        return PA;
    if(a*a>=b*b+c*c)//--------图3--------   
        return PA;   
    if(b*b>=a*a+c*c)//--------图4-------   
        return PB; 

    let A = (PA.y-PB.y)/(PA.x- PB.x);  
    let B = (PA.y-A*PA.x);  
    let m = P3.x + A * P3.y;  
    /// 求两直线交点坐标  
    let x = (m - A * B) / (A * A + 1);
    let y = A * x + B;
    
    let newPt = new Point(x, y);  
    return newPt;
}
let tempFoundPoint:Point;
[] = [];
let endPoint: Point;
let pathFounded:Point;
[] = [];
let foundedLength: number = 0;
let tempLength: number = 0;
function findPath(startP:Point,endP:Point):Point[]{
    endPoint = endP;
    tempFoundPoint = [];
    pathFounded = [];
    foundedLength = 0;
    tempLength = 0;
    fun1(startP);
    return pathFounded;
};;
function fun1(a: Point):any
{
    if (tempFoundPoint.indexOf(a) >= 0) return false;
    let tL=0;
    if (tempFoundPoint.length>0)
    {
        tL = GetPointDistance(tempFoundPoint[tempFoundPoint.length - 1], a);
        if (pathFounded.length >0 && tempLength + tL >= foundedLength)
        {
            return false;
        }   
    }    
    tempLength += tL;
    tempFoundPoint.push(a);

    if (a.key == endPoint.key)
    {
        tempFoundPoint.pop();
        tempLength -= tL;
        return true;
    }    
    for (var i in a.visiblePoint)
    {
        if (fun1(a.visiblePoint[i]))//找到了
        {
            pathFounded = tempFoundPoint.concat(endPoint);
            foundedLength = tempLength+GetPointDistance(tempFoundPoint[tempFoundPoint.length-1],endPoint);

        }  
    }    
    tempFoundPoint.pop();
    tempLength -= tL; 
    return false;
}

class Point{
    constructor(x,y)
    {
        this.x=x;
        this.y=y;
        this.visiblePoint={};
    }
    addVisiblePt(p:Point)
    {
        this.visiblePoint[p.key] = p;
    }
    removeVisiblePt(p:Point)
    {
        delete this.visiblePoint[p.key];
    }
    
}