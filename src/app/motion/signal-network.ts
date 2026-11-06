import { Component, ElementRef, DestroyRef, afterNextRender, inject, viewChild } from '@angular/core';
@Component({selector:'signal-network',standalone:true,template:`<canvas #canvas aria-hidden="true"></canvas>`})
export class SignalNetwork {
 private canvas=viewChild.required<ElementRef<HTMLCanvasElement>>('canvas'); private destroy=inject(DestroyRef);
 constructor(){afterNextRender(()=>this.start())}
 private start(){
  const el=this.canvas().nativeElement, ctx=el.getContext('2d');if(!ctx)return;
  const host=el.parentElement!;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(max-width: 700px)').matches;
  let width=0,height=0,dpr=1,frame=0,visible=true,raf=0,mouse={x:-9999,y:-9999};
  type Node={x:number;y:number;vx:number;vy:number;r:number;phase:number};let nodes:Node[]=[];
  const resize=()=>{width=host.clientWidth;height=host.clientHeight;dpr=Math.min(devicePixelRatio||1,2);el.width=Math.max(1,Math.floor(width*dpr));el.height=Math.max(1,Math.floor(height*dpr));el.style.width=width+'px';el.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(width<700?34:85,Math.max(20,Math.floor(width*height/15000)));nodes=Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.36,vy:(Math.random()-.5)*.36,r:Math.random()*1.6+.7,phase:Math.random()*Math.PI*2}));draw()};
  const draw=()=>{ctx.clearRect(0,0,width,height);for(let i=0;i<nodes.length;i++){const n=nodes[i];for(let j=i+1;j<nodes.length;j++){const m=nodes[j],dist=Math.hypot(n.x-m.x,n.y-m.y);if(dist<170){ctx.strokeStyle=`rgba(68,178,227,${(1-dist/170)*.25})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke()}}ctx.fillStyle=`rgba(94,199,242,${.45+.35*Math.sin(n.phase+frame*.018)})`;ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill()}if(nodes.length>3){let a=nodes[(Math.floor(frame/160)*7)%nodes.length],b=nodes[(Math.floor(frame/160)*7+3)%nodes.length],p=(frame%160)/160;ctx.fillStyle='#e8b86b';ctx.shadowColor='#e8b86b';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(a.x+(b.x-a.x)*p,a.y+(b.y-a.y)*p,2.6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}};
  const tick=()=>{if(!visible||document.hidden)return;frame++;for(const n of nodes){n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>width)n.vx*=-1;if(n.y<0||n.y>height)n.vy*=-1;if(mouse.x>-1000){const dx=n.x-mouse.x,dy=n.y-mouse.y,d=Math.hypot(dx,dy);if(d<120&&d>1){n.x+=dx/d*.32;n.y+=dy/d*.32}}}draw();raf=requestAnimationFrame(tick)};
  const onMove=(e:PointerEvent)=>{if(e.pointerType==='touch')return;const r=host.getBoundingClientRect();mouse={x:e.clientX-r.left,y:e.clientY-r.top}};
  const onLeave=()=>mouse={x:-9999,y:-9999};const onVisibility=()=>{cancelAnimationFrame(raf);if(!document.hidden&&visible&&!reduced)raf=requestAnimationFrame(tick)};
  const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;onVisibility()});const ro=new ResizeObserver(resize);ro.observe(host);io.observe(host);host.addEventListener('pointermove',onMove);host.addEventListener('pointerleave',onLeave);document.addEventListener('visibilitychange',onVisibility);resize();if(!reduced)raf=requestAnimationFrame(tick);
  this.destroy.onDestroy(()=>{cancelAnimationFrame(raf);io.disconnect();ro.disconnect();host.removeEventListener('pointermove',onMove);host.removeEventListener('pointerleave',onLeave);document.removeEventListener('visibilitychange',onVisibility)})
 }
}
