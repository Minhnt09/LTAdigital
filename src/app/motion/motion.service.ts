import { Injectable } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
@Injectable({providedIn:'root'})
export class MotionService {
 private ctx?:gsap.Context;private cleanups:(()=>void)[]=[];
 init(){this.destroy();if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const desktop=matchMedia('(min-width: 901px) and (hover:hover) and (pointer:fine)').matches;
 this.ctx=gsap.context(()=>{
 gsap.fromTo('h1',{opacity:0,y:25,clipPath:'inset(0 0 100% 0)'},{opacity:1,y:0,clipPath:'inset(0 0 0% 0)',duration:.9,ease:'power3.out'});
 document.querySelectorAll<HTMLElement>('[data-count]').forEach(el=>{const value=Number(el.dataset['count']),counter={value:0};gsap.to(counter,{value,duration:1.3,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(counter.value).toString(),scrollTrigger:{trigger:el,start:'top 85%',once:true}})});
 document.querySelectorAll('.section, .catalog-section, .philosophy').forEach(section=>{
 const headings=section.querySelectorAll('h2');if(headings.length)gsap.fromTo(headings,{opacity:0,y:24},{opacity:1,y:0,duration:.7,scrollTrigger:{trigger:section,start:'top 88%',once:true}});
 const targets=section.querySelectorAll('.capability-card,.catalog-card,.principle-grid article,.reason-grid article,.detail-points article,.flow-grid article,.contact-details>div');if(targets.length)gsap.fromTo(targets,{opacity:0,y:25},{opacity:1,y:0,duration:.65,stagger:.08,scrollTrigger:{trigger:section,start:'top 86%',once:true}});
 });
 if(desktop)document.querySelectorAll('.home-about-image img,.catalog-heading-image img').forEach(img=>gsap.fromTo(img,{y:-18,scale:1.08},{y:18,scale:1.08,ease:'none',scrollTrigger:{trigger:img,start:'top bottom',end:'bottom top',scrub:true}}));
 });
 document.querySelectorAll<HTMLElement>('.button').forEach(button=>{const click=(e:MouseEvent)=>{const r=button.getBoundingClientRect(),wave=document.createElement('span'),size=Math.max(r.width,r.height);wave.className='ripple-wave';Object.assign(wave.style,{width:size+'px',height:size+'px',left:(e.clientX-r.left-size/2)+'px',top:(e.clientY-r.top-size/2)+'px'});button.append(wave);setTimeout(()=>wave.remove(),700)};button.addEventListener('click',click);this.cleanups.push(()=>button.removeEventListener('click',click))});
 if(desktop){
 const lenis=new Lenis({duration:1.05,smoothWheel:true});const tick=(time:number)=>lenis.raf(time*1000);gsap.ticker.add(tick);lenis.on('scroll',ScrollTrigger.update);this.cleanups.push(()=>{gsap.ticker.remove(tick);lenis.destroy()});
 const cursor=document.createElement('div');cursor.className='lta-cursor';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);const cursorMove=(e:PointerEvent)=>{gsap.to(cursor,{x:e.clientX-12,y:e.clientY-12,duration:.18,overwrite:true})};window.addEventListener('pointermove',cursorMove);this.cleanups.push(()=>{window.removeEventListener('pointermove',cursorMove);cursor.remove()});
 document.querySelectorAll<HTMLElement>('.catalog-card,.reason-grid article,.button').forEach(card=>{const button=card.classList.contains('button');const move=(e:PointerEvent)=>{const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;card.style.setProperty('--mx',x+'px');card.style.setProperty('--my',y+'px');gsap.to(card,button?{x:(x-r.width/2)*.12,y:(y-r.height/2)*.15,duration:.3}:{rotationX:-(y/r.height-.5)*5,rotationY:(x/r.width-.5)*5,transformPerspective:1000,duration:.3})};const leave=()=>gsap.to(card,{x:0,y:0,rotationX:0,rotationY:0,duration:.4});card.addEventListener('pointermove',move);card.addEventListener('pointerleave',leave);this.cleanups.push(()=>{card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);gsap.set(card,{clearProps:'transform'})})});
 }
 requestAnimationFrame(()=>ScrollTrigger.refresh());
 }
 destroy(){this.ctx?.revert();this.ctx=undefined;for(const cleanup of this.cleanups)cleanup();this.cleanups=[]}
}
