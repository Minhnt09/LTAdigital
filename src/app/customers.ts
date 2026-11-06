import { PartnerMarquee } from './partner-marquee';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Locale } from './app';
import { b } from './content';
import { partnerAssets } from './partners.data';
@Component({standalone:true,imports:[RouterLink,PartnerMarquee],template:`<section class="partners-hero"><div class="container"><span class="eyebrow">LTA / NETWORK</span><h1>{{l.t(title)}}</h1><p>{{l.t(intro)}}</p></div></section><section class="section brand-light partners-page"><div class="container"><partner-marquee/><p class="partners-note">{{l.t(note)}}</p></div></section><section class="section brand-cta"><div class="container cta-inner"><div><span class="eyebrow">PARTNERSHIP</span><h2>{{l.t(cta)}}</h2></div><a routerLink="/contact" class="button primary">{{l.t(contact)}} ↗</a></div></section>`})
export class Customers {l=inject(Locale);partners=partnerAssets;title=b('Đối tác & hệ sinh thái','Partners & ecosystem');intro=b('Kết nối công nghệ, nền tảng và thị trường để tạo ra giải pháp phù hợp cho khách hàng.','Connecting technology, platforms and markets to create solutions that fit customer needs.');note=b('Bộ logo do LTA cung cấp. Danh sách và quyền hiển thị từng thương hiệu cần được LTA xác nhận trước khi công bố.','Logos supplied by LTA. LTA should confirm each name and permission to display it before publication.');cta=b('Cùng tạo ra cơ hội hợp tác mới','Let’s create new partnership opportunities');contact=b('Liên hệ LTA','Contact LTA')}
