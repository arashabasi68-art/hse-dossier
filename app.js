'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FD='۰۱۲۳۴۵۶۷۸۹';
const fa=v=>String(v==null?'':v).replace(/\d/g,d=>FD[+d]).replace(/([۰-۹])\.([۰-۹])/g,'$1٫$2');
const toEn=s=>String(s==null?'':s).replace(/[۰-۹]/g,d=>FD.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/٫/g,'.');
const norm=s=>toEn(s).replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[‌‏ً-ٟ]/g,'').replace(/\s+/g,'').toLowerCase();
const T=Math.trunc;
/* تبدیل تاریخ شمسی و میلادی */
function g2j(gy,gm,gd){
 const gdm=[0,31,59,90,120,151,181,212,243,273,304,334];
 let jy; if(gy>1600){jy=979;gy-=1600}else{jy=0;gy-=621}
 const gy2=gm>2?gy+1:gy;
 let days=365*gy+T((gy2+3)/4)-T((gy2+99)/100)+T((gy2+399)/400)-80+gd+gdm[gm-1];
 jy+=33*T(days/12053);days%=12053;
 jy+=4*T(days/1461);days%=1461;
 if(days>365){jy+=T((days-1)/365);days=(days-1)%365}
 const jm=days<186?1+T(days/31):7+T((days-186)/30);
 const jd=1+(days<186?days%31:(days-186)%30);
 return [jy,jm,jd];
}
function j2g(jy,jm,jd){
 jy+=1595;
 let days=-355668+365*jy+T(jy/33)*8+T((jy%33+3)/4)+jd+(jm<7?(jm-1)*31:(jm-7)*30+186);
 let gy=400*T(days/146097);days%=146097;
 if(days>36524){gy+=100*T(--days/36524);days%=36524;if(days>=365)days++}
 gy+=4*T(days/1461);days%=1461;
 gy+=T((days-1)/365);
 if(days>365)days=(days-1)%365;
 let gd=days+1;
 const sal=[0,31,(gy%4===0&&gy%100!==0)||gy%400===0?29:28,31,30,31,30,31,31,30,31,30,31];
 let gm=0;for(;gm<13;gm++){const v=sal[gm];if(gd<=v)break;gd-=v}
 return [gy,gm,gd];
}
const RE=/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
const pad=n=>String(n).padStart(2,'0');
function dayNum(s){
 const m=RE.exec(toEn(s||'').trim());if(!m)return NaN;
 const y=+m[1],mo=+m[2],d=+m[3];if(mo<1||mo>12||d<1||d>31)return NaN;
 const g=j2g(y,mo,d);return Date.UTC(g[0],g[1]-1,g[2])/864e5;
}
const _n=new Date(),_tj=g2j(_n.getFullYear(),_n.getMonth()+1,_n.getDate());
const TODAY=_tj[0]+'/'+pad(_tj[1])+'/'+pad(_tj[2]);
const TN=dayNum(TODAY);
const MONTHS=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const longDate=s=>{const m=RE.exec(s||'');return m?fa(+m[3])+' '+MONTHS[+m[2]-1]+' '+fa(m[1]):(s?fa(s):'—')};
function expState(s){const n=dayNum(s);if(isNaN(n))return null;const d=n-TN;return{c:d<0?'exp':d<=60?'soon':'ok',d}}
const hash=s=>{let h1=0xdeadbeef,h2=0x41c6ce57;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return(4294967296*(2097151&h2)+(h1>>>0)).toString(36)};
let _u=0;const uid=()=>'x'+(++_u).toString(36)+Math.random().toString(36).slice(2,6);

const L={
 kind:{audio:'شنوایی‌سنجی',spiro:'اسپیرومتری',blood:'آزمایش خون',lead:'آزمایش سرب خون',vision:'بینایی‌سنجی'},
 status:{fit:'دارای صلاحیت کار',cond:'صلاحیت مشروط',unfit:'فاقد صلاحیت موقت'},
 rf:{doing:'در حال پیگیری',wait:'در انتظار پذیرش',done:'انجام و بسته شد'},
 act:{open:'باز',doing:'در حال انجام',done:'بسته شد'},
 role:{admin:'مدیر',user:'کاربر'}
};
const KEYS={tr:['title','date','hours','teacher','cert','valid'],ex:['kind','date','result','opinion','doctor','next'],rf:['to','reason','date','status'],inc:['kind','date','desc','severity'],ppe:['item','date','due'],exp:['agent','date','value','unit','limit']};
const rows=(t,a)=>(a||[]).map(r=>{const o={id:uid()};KEYS[t].forEach((k,i)=>o[k]=r[i]);return o});
const W=(name,code,job,unit,hire,status,nx,x={},type='worker')=>({id:uid(),type,name,code,job,unit,hire,status,nx,tr:rows('tr',x.tr),ex:rows('ex',x.ex),rf:rows('rf',x.rf),inc:rows('inc',x.inc),ppe:rows('ppe',x.ppe),exp:rows('exp',x.exp)});

function seedDB(){
 const workers=[
 W('علی رضایی','1021','جوشکار','تولید','1398/04/01','cond','1405/09/01',{
  tr:[['کار در ارتفاع','1403/05/12',8,'مهندس صالحی','دارد','1405/05/12'],['ایمنی جوشکاری و برشکاری','1404/02/18',6,'مهندس کاظمی','دارد','1406/02/18'],['کمک‌های اولیه و CPR','1404/09/10',4,'دکتر فرهادی','دارد','1405/09/20'],['آشنایی با برگه اطلاعات ایمنی مواد (MSDS)','1405/06/05',3,'مهندس کاظمی','در انتظار','']],
  ex:[['audio','1403/02/20','افت خفیف شنوایی در فرکانس‌های بالا (۴ و ۶ کیلوهرتز)','مناسب برای کار؛ استفاده دائم از محافظ گوش الزامی است','دکتر نیکزاد','1404/02/20'],['audio','1404/03/05','افت خفیف فرکانس بالا، بدون پیشرفت نسبت به سال قبل','مناسب برای کار با شرط استفاده از ایرماف؛ پایش سالانه','دکتر نیکزاد','1405/09/01'],['spiro','1404/03/05','نسبت FEV1/FVC برابر ۸۱٪ (طبیعی)','بدون محدودیت تنفسی','دکتر نیکزاد','1406/03/05'],['blood','1404/03/06','شمارش سلولی و آنزیم‌های کبدی در محدوده طبیعی','بدون یافته غیرطبیعی','دکتر نیکزاد','1405/03/06'],['lead','1404/03/06','سرب خون ۸ میکروگرم بر دسی‌لیتر (حد مجاز ۳۰)','در محدوده مجاز؛ پایش سالانه','دکتر نیکزاد','1405/09/06'],['vision','1404/03/06','حدت بینایی ۱۰/۱۰ با عینک؛ دید رنگ سالم','مناسب','دکتر ملکی','1406/03/06']],
  rf:[['متخصص گوش و حلق و بینی','افت شنوایی فرکانس بالا در شنوایی‌سنجی سالانه','1403/03/01','doing'],['متخصص چشم','سوزش و التهاب مزمن ملتحمه ناشی از جرقه','1404/07/12','done']],
  inc:[['شبه‌حادثه','1404/06/14','پرتاب جرقه روی مواد قابل اشتعال کنار ایستگاه جوش؛ بدون آسیب','کم'],['حادثه','1404/11/02','سوختگی درجه یک ساعد دست راست هنگام جوشکاری؛ درمان سرپایی','متوسط']],
  ppe:[['ماسک جوشکاری اتوماتیک','1404/05/01','1406/05/01'],['گوشی ایرماف','1404/12/15','1405/06/15'],['دستکش چرمی جوشکاری','1405/05/20','1405/11/20'],['کفش ایمنی','1405/01/10','1406/01/10']],
  exp:[['صدا','1405/04/10',88,'dB(A)',85],['دود جوشکاری','1405/04/10',3.1,'mg/m³',5]]}),
 W('مریم کریمی','1034','کارشناس کنترل کیفیت','آزمایشگاه','1400/07/15','fit','1406/01/20',{
  tr:[['ایمنی کار با مواد شیمیایی','1404/04/20',6,'دکتر امینی','دارد','1406/04/20'],['کمک‌های اولیه و CPR','1404/09/10',4,'دکتر فرهادی','دارد','1406/09/10']],
  ex:[['vision','1405/01/20','نزدیک‌بینی خفیف؛ ۱۰/۱۰ با عینک','مناسب','دکتر ملکی','1406/01/20'],['blood','1405/01/20','شمارش سلولی و کبد طبیعی','بدون یافته غیرطبیعی','دکتر نیکزاد','1406/01/20'],['spiro','1404/09/25','FEV1 برابر ۹۲٪ مقدار پیش‌بینی','طبیعی','دکتر نیکزاد','1405/09/25']],
  ppe:[['عینک ایمنی شیمیایی','1404/10/01','1405/10/01'],['روپوش آزمایشگاه','1405/02/01','1406/02/01']],
  exp:[['بخارات حلال (تولوئن)','1405/05/10',18,'ppm',20]]}),
 W('حسین احمدی','1008','اپراتور پرس','تولید','1396/11/20','cond','1405/08/20',{
  tr:[['کار با پرس و حفاظ ماشین‌آلات','1404/01/15',8,'مهندس صالحی','دارد','1406/01/15'],['قفل و برچسب (LOTO)','1403/08/10',4,'مهندس کاظمی','دارد','1405/08/10']],
  ex:[['audio','1404/08/20','افت متوسط دوطرفه در فرکانس‌های ۳ تا ۶ کیلوهرتز','صلاحیت مشروط؛ ارجاع برای ارزیابی تکمیلی و استفاده دائم از گوشی','دکتر نیکزاد','1405/08/20'],['spiro','1404/08/20','طبیعی','بدون محدودیت','دکتر نیکزاد','1406/08/20'],['blood','1404/08/21','طبیعی','بدون یافته غیرطبیعی','دکتر نیکزاد','1405/12/21'],['vision','1404/08/21','حدت بینایی ۹/۱۰','مناسب','دکتر ملکی','1406/08/21']],
  rf:[['متخصص طب کار (ارزیابی صلاحیت)','افت متوسط شنوایی در شنوایی‌سنجی','1404/08/25','wait'],['متخصص ارتوپدی','کمردرد مزمن هنگام کار ایستاده','1405/03/10','doing']],
  inc:[['حادثه','1403/12/10','گیر کردن انگشت دست چپ بین قالب‌ها؛ شکستگی ساده و ۱۴ روز استعلاجی','متوسط'],['شبه‌حادثه','1405/04/22','عملکرد ناخواسته پرس هنگام تنظیم؛ بدون آسیب','شدید']],
  ppe:[['گوشی ایرپلاگ','1405/01/10','1405/07/10'],['دستکش ضدبرش','1405/04/01','1405/09/30']],
  exp:[['صدا','1405/04/12',94,'dB(A)',85],['مه روغن','1405/04/12',1.2,'mg/m³',5]]}),
 W('زهرا موسوی','1045','انباردار','انبار','1401/02/10','fit','1406/02/10',{
  tr:[['جابجایی دستی بار و ارگونومی','1404/05/05',4,'دکتر امینی','دارد','1406/05/05'],['ایمنی انبار و ترافیک داخلی','1404/12/20',3,'مهندس کاظمی','ندارد','']],
  ex:[['audio','1404/05/15','طبیعی','مناسب','دکتر نیکزاد','1406/05/15'],['vision','1404/05/15','حدت بینایی ۱۰/۱۰','مناسب','دکتر ملکی','1406/05/15'],['blood','1405/02/10','طبیعی','بدون یافته غیرطبیعی','دکتر نیکزاد','1406/02/10']],
  inc:[['شبه‌حادثه','1405/03/03','ریزش کارتن از قفسه ارتفاع ۳ متری؛ بدون برخورد','کم']],
  ppe:[['کفش ایمنی','1404/05/10','1405/11/10'],['دستکش کار','1405/03/01','1405/09/01']],
  exp:[['گرد و غبار کل','1405/04/15',2.4,'mg/m³',10]]}),
 W('رضا محمدی','1012','برقکار','تعمیرات','1397/09/05','fit','1405/10/15',{
  tr:[['ایمنی برق و ارتینگ','1404/03/03',8,'مهندس صالحی','دارد','1406/03/03'],['کار در فضای بسته','1403/06/20',8,'مهندس کاظمی','دارد','1405/06/20']],
  ex:[['vision','1404/10/15','دید رنگ سالم؛ حدت ۱۰/۱۰','مناسب','دکتر ملکی','1405/10/15'],['audio','1404/10/15','طبیعی','مناسب','دکتر نیکزاد','1406/10/15'],['blood','1404/10/16','طبیعی','بدون یافته غیرطبیعی','دکتر نیکزاد','1405/10/16']],
  inc:[['حادثه','1404/02/02','شوک برقی خفیف هنگام تعویض فیوز؛ بدون عارضه قلبی','متوسط']],
  ppe:[['دستکش عایق ۱۰۰۰ ولت','1404/06/01','1405/12/01'],['کلاه ایمنی','1404/01/05','1406/01/05']],
  exp:[['صدا','1405/04/20',78,'dB(A)',85]]}),
 W('فاطمه حسینی','1056','کارگر بسته‌بندی','بسته‌بندی','1402/01/22','fit','1405/11/22',{
  tr:[['ارگونومی و وضعیت بدنی','1404/02/10',3,'دکتر امینی','دارد','1406/02/10'],['پیشگیری از حریق و کار با کپسول','1404/11/05',4,'مهندس کاظمی','دارد','1406/11/05']],
  ex:[['spiro','1404/11/22','طبیعی','بدون محدودیت','دکتر نیکزاد','1406/11/22'],['vision','1404/11/22','۱۰/۱۰','مناسب','دکتر ملکی','1405/11/22'],['audio','1404/11/22','طبیعی','مناسب','دکتر نیکزاد','1406/11/22']],
  rf:[['فیزیوتراپی و ارتوپدی','درد مچ دست و علائم اولیه سندرم تونل کارپ','1405/02/18','doing']],
  ppe:[['دستکش نخی ضدلغزش','1405/04/01','1405/10/01']],
  exp:[['صدا','1405/04/25',82,'dB(A)',85]]}),
 W('محمود نوری','1027','راننده لیفتراک','انبار','1399/06/30','fit','1405/09/12',{
  tr:[['گواهی ایمنی لیفتراک','1404/04/04',16,'مهندس صالحی','دارد','1405/09/28'],['ایمنی ترافیک داخلی','1404/05/02',3,'مهندس کاظمی','دارد','1406/05/02']],
  ex:[['vision','1404/09/12','حدت بینایی ۹/۱۰؛ میدان دید طبیعی','مناسب','دکتر ملکی','1405/09/12'],['audio','1404/09/12','طبیعی','مناسب','دکتر نیکزاد','1406/09/12'],['blood','1404/09/13','طبیعی','بدون یافته غیرطبیعی','دکتر نیکزاد','1405/12/13']],
  inc:[['حادثه','1404/08/15','برخورد لیفتراک با قفسه؛ خسارت مالی بدون آسیب جانی','کم']],
  ppe:[['جلیقه شبرنگ','1404/08/20','1406/08/20'],['کفش ایمنی','1404/10/10','1406/10/10']],
  exp:[['ارتعاش تمام بدن','1405/05/05',0.7,'m/s²',1.15]]}),
 W('سعید قاسمی','1003','نقاش صنعتی','رنگ','1395/03/12','unfit','1405/08/10',{
  tr:[['کار با حلال‌ها و تنفس ایمن','1403/04/04',6,'دکتر امینی','دارد','1405/04/04'],['ماسک نیم‌صورت فیلتردار','1404/05/25',2,'مهندس کاظمی','دارد','1406/05/25']],
  ex:[['spiro','1405/01/30','کاهش FEV1 (۷۶٪ مقدار پیش‌بینی) با الگوی انسدادی خفیف','فاقد صلاحیت موقت برای کار با حلال تا تکمیل بررسی ریوی','دکتر نیکزاد','1405/08/10'],['lead','1405/01/30','سرب خون ۲۵ میکروگرم بر دسی‌لیتر (حد مجاز ۳۰)','نزدیک به حد؛ پایش هر ۶ ماه','دکتر نیکزاد','1405/08/30'],['blood','1405/01/30','افزایش خفیف آنزیم کبدی ALT','ارجاع به داخلی','دکتر نیکزاد','1405/08/10'],['audio','1405/01/31','طبیعی','مناسب','دکتر نیکزاد','1406/01/31']],
  rf:[['متخصص ریه','کاهش FEV1 و سرفه مزمن','1405/02/10','doing'],['متخصص داخلی','افزایش آنزیم کبدی','1405/02/10','doing']],
  inc:[['شبه‌حادثه','1405/03/18','پاشش حلال روی چشم؛ شست‌وشوی فوری، بدون آسیب','متوسط']],
  ppe:[['ماسک نیم‌صورت دو فیلتره','1405/06/01','1405/09/01'],['فیلتر بخارات آلی','1405/06/01','1405/08/15']],
  exp:[['بخارات حلال (زایلن)','1405/04/30',132,'ppm',100],['صدا','1405/04/30',79,'dB(A)',85]]}),
 W('شرکت پیمانکاری آسمان‌سازه','C-201','پیمانکار داربست‌بندی','پروژه توسعه خط ۲','1404/03/01','fit','',{
  tr:[['کار در ارتفاع (کارکنان پیمانکار)','1405/03/10',8,'مهندس صالحی','دارد','1407/03/10']]},'client')
 ];
 const M=(unit,point,agent,value,mu,limit,dir,date,lab,note)=>({id:uid(),unit,point,agent,value,mu,limit,dir,date,lab,note});
 const lab='آزمایشگاه بهداشت حرفه‌ای آریا';
 const measures=[
  M('تولید','سالن جوشکاری · ایستگاه ۳','صدا',88,'dB(A)',85,'max','1405/04/10',lab,'تراز معادل ۸ ساعته'),
  M('تولید','سالن پرس · خط ۲','صدا',94,'dB(A)',85,'max','1405/04/12',lab,'تراز معادل ۸ ساعته'),
  M('تولید','سالن جوشکاری · ایستگاه ۳','دود جوشکاری',3.1,'mg/m³',5,'max','1405/04/10',lab,'نمونه‌برداری فردی'),
  M('رنگ','کابین رنگ · ایستگاه ۱','بخارات حلال (زایلن)',132,'ppm',100,'max','1405/04/30',lab,'میانگین ۸ ساعته'),
  M('آزمایشگاه','میز کار کنترل کیفیت','بخارات حلال (تولوئن)',18,'ppm',20,'max','1405/05/10',lab,''),
  M('انبار','راهروی اصلی','گرد و غبار کل',2.4,'mg/m³',10,'max','1405/04/15',lab,''),
  M('بسته‌بندی','خط بسته‌بندی ۱','روشنایی',420,'لوکس',300,'min','1405/05/22',lab,'سطح کار'),
  M('تعمیرات','کارگاه مکانیک','روشنایی',240,'لوکس',300,'min','1405/05/22',lab,'سطح کار'),
  M('انبار','محوطه بارگیری','استرس گرمایی (WBGT)',27.5,'°C',28,'max','1405/05/25',lab,'کار متوسط')
 ];
 const A=(title,src,mid,resp,due,pri,st,desc)=>({id:uid(),title,src,mid,resp,due,pri,st,desc});
 const actions=[
  A('کاهش تراز صدا در سالن پرس خط ۲','اندازه‌گیری صدا · ۹۴ dB(A)',measures[1].id,'مهندس صالحی (مدیر تولید)','1405/09/15','بالا','doing','نصب جداره آکوستیک و روکش‌دار کردن قالب‌ها؛ اندازه‌گیری مجدد پس از اصلاح.'),
  A('نصب تهویه موضعی برای کابین رنگ','بخارات زایلن · ۱۳۲ ppm',measures[3].id,'سرپرست واحد رنگ','1405/08/20','بالا','open','طراحی و نصب هواکش موضعی و بررسی سرعت هوای دهانه مکش.'),
  A('افزایش روشنایی کارگاه مکانیک','روشنایی · ۲۴۰ لوکس',measures[7].id,'سرپرست تعمیرات','1405/07/25','متوسط','open','تعویض چراغ‌ها با نوع LED و افزودن روشنایی موضعی روی میز کار.'),
  A('تعویض گوشی‌های حفاظتی منقضی','سررسید تجهیزات حفاظت فردی','','کارشناس HSE','1405/08/10','متوسط','doing','تحویل ایرماف و ایرپلاگ جدید به کارگران دارای تجهیز منقضی.'),
  A('ارجاع کارگران دارای افت شنوایی به متخصص','شنوایی‌سنجی سالانه','','پزشک طب کار','1404/12/01','بالا','done','ارجاع انجام و نتیجه در پرونده ثبت شد.'),
  A('نصب هود مکنده در ایستگاه‌های جوشکاری','دود جوشکاری · ۳٫۱ mg/m³',measures[2].id,'مهندس کاظمی','1405/10/30','پایین','open','بررسی و نصب هود مکنده متحرک با فیلتر HEPA.')
 ];
 const accounts=[
  {id:uid(),username:'admin',name:'مدیر سامانه',role:'admin',pass:hash('admin123')},
  {id:uid(),username:'expert',name:'کارشناس HSE کارگاه',role:'user',pass:hash('hse1405')}
 ];
 return{v:1,workers,measures,actions,accounts};
}
const DL={jobs:['جوشکار','اپراتور پرس','برقکار','انباردار','راننده لیفتراک','نقاش صنعتی','کارگر بسته‌بندی','کارشناس کنترل کیفیت','پیمانکار','مشتری'],agents:['صدا','گرد و غبار کل','دود جوشکاری','بخارات حلال (زایلن)','بخارات حلال (تولوئن)','روشنایی','استرس گرمایی (WBGT)','ارتعاش تمام بدن','مه روغن']};
const o2=obj=>Object.entries(obj);
const SCH={
 worker:{t:'مشخصات',f:[
  {k:'type',l:'نوع پرونده',t:'select',o:[['worker','کارگر'],['client','مشتری / کارفرما']]},
  {k:'name',l:'نام و نام خانوادگی',req:1,w:1},
  {k:'job',l:'نوع شغل / سمت',req:1,list:'jobs'},
  {k:'code',l:'کد پرسنلی / شناسه'},
  {k:'unit',l:'واحد / پروژه'},
  {k:'hire',l:'تاریخ استخدام',t:'date',h:'مثال: ۱۴۰۴/۰۳/۰۱'},
  {k:'status',l:'وضعیت صلاحیت کار',t:'select',o:o2(L.status)},
  {k:'nx',l:'تاریخ معاینه بعدی',t:'date'}]},
 tr:{t:'آموزش',f:[
  {k:'title',l:'عنوان دوره',req:1,w:1},
  {k:'date',l:'تاریخ برگزاری',t:'date',req:1,h:'مثال: ۱۴۰۵/۰۸/۰۲'},
  {k:'hours',l:'مدت (ساعت)',t:'number'},
  {k:'teacher',l:'مدرس'},
  {k:'cert',l:'وضعیت گواهی',t:'select',o:[['دارد','دارد'],['ندارد','ندارد'],['در انتظار','در انتظار صدور']]},
  {k:'valid',l:'اعتبار گواهی تا',t:'date'}]},
 ex:{t:'معاینه یا آزمایش',f:[
  {k:'kind',l:'نوع معاینه',t:'select',o:o2(L.kind)},
  {k:'date',l:'تاریخ انجام',t:'date',req:1},
  {k:'result',l:'نتیجه',t:'textarea',w:1,req:1},
  {k:'opinion',l:'نظر پزشک',t:'textarea',w:1},
  {k:'doctor',l:'نام پزشک'},
  {k:'next',l:'تاریخ معاینه بعدی',t:'date'}]},
 rf:{t:'ارجاع',f:[
  {k:'to',l:'مرجع ارجاع',req:1,w:1},
  {k:'reason',l:'علت ارجاع',t:'textarea',w:1,req:1},
  {k:'date',l:'تاریخ ارجاع',t:'date',req:1},
  {k:'status',l:'وضعیت پیگیری',t:'select',o:o2(L.rf)}]},
 inc:{t:'حادثه یا شبه‌حادثه',f:[
  {k:'kind',l:'نوع رویداد',t:'select',o:[['حادثه','حادثه'],['شبه‌حادثه','شبه‌حادثه']]},
  {k:'date',l:'تاریخ رویداد',t:'date',req:1},
  {k:'desc',l:'شرح رویداد',t:'textarea',w:1,req:1},
  {k:'severity',l:'شدت',t:'select',o:[['کم','کم'],['متوسط','متوسط'],['شدید','شدید']]}]},
 ppe:{t:'تجهیز حفاظت فردی',f:[
  {k:'item',l:'نام تجهیز',req:1,w:1},
  {k:'date',l:'تاریخ تحویل',t:'date',req:1},
  {k:'due',l:'سررسید تعویض',t:'date'}]},
 exp:{t:'مواجهه شغلی',f:[
  {k:'agent',l:'عامل زیان‌آور',req:1,list:'agents'},
  {k:'date',l:'تاریخ اندازه‌گیری',t:'date',req:1},
  {k:'value',l:'مقدار مواجهه',t:'number',req:1},
  {k:'unit',l:'واحد (مثلاً dB(A))',req:1},
  {k:'limit',l:'حد مجاز',t:'number',req:1}]},
 measure:{t:'اندازه‌گیری',f:[
  {k:'agent',l:'عامل زیان‌آور',req:1,list:'agents',w:1},
  {k:'unit',l:'واحد کاری',req:1},
  {k:'point',l:'نقطه / ایستگاه',req:1},
  {k:'value',l:'مقدار اندازه‌گیری',t:'number',req:1},
  {k:'mu',l:'یکاری مقدار (مثلاً ppm)',req:1},
  {k:'limit',l:'حد مجاز',t:'number',req:1},
  {k:'dir',l:'نوع حد',t:'select',o:[['max','حداکثر مجاز'],['min','حداقل لازم']]},
  {k:'date',l:'تاریخ اندازه‌گیری',t:'date',req:1},
  {k:'lab',l:'مرجع اندازه‌گیری'},
  {k:'note',l:'توضیح',w:1}]},
 action:{t:'اقدام اصلاحی',f:[
  {k:'title',l:'عنوان اقدام',req:1,w:1},
  {k:'desc',l:'شرح اقدام',t:'textarea',w:1},
  {k:'src',l:'منبع / علت'},
  {k:'mid',l:'اندازه‌گیری مرتبط',t:'select',o:()=>[['','بدون ارتباط'],...db.measures.map(m=>[m.id,m.agent+' · '+m.point])]},
  {k:'resp',l:'مسئول پیگیری',req:1},
  {k:'due',l:'مهلت انجام',t:'date',req:1},
  {k:'pri',l:'اولویت',t:'select',o:[['بالا','بالا'],['متوسط','متوسط'],['پایین','پایین']]},
  {k:'st',l:'وضعیت',t:'select',o:o2(L.act)}]},
 account:{t:'حساب کاربری',f:[
  {k:'name',l:'نام کامل',req:1,w:1},
  {k:'username',l:'نام کاربری',req:1,t:'user'},
  {k:'password',l:'گذرواژه',t:'password',h:'هنگام ویرایش، خالی بگذارید تا تغییر نکند'},
  {k:'role',l:'نقش',t:'select',o:[['user','کاربر · ثبت و ویرایش اطلاعات'],['admin','مدیر · مدیریت کاربران و حذف']]}]}
};
const DEF={worker:{type:'worker',status:'fit'},tr:{cert:'دارد'},ex:{kind:'audio'},rf:{status:'doing'},inc:{kind:'شبه‌حادثه',severity:'کم'},ppe:{},exp:{},measure:{dir:'max'},action:{pri:'متوسط',st:'open',mid:''},account:{role:'user'}};
/* ---------- وضعیت برنامه ---------- */
const KEY='hse-dossier-v1';
let db,ses=null,selId=null,query='',tab='tr',fy='',ft='',fsort='desc',view='workers',sugIdx=-1,mfl='',afl='';
function load(){try{const s=localStorage.getItem(KEY);if(s){const d=JSON.parse(s);if(d&&d.workers&&d.accounts)return d}}catch(e){}return seedDB()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}}
const canEdit=()=>!!ses;
const isAdmin=()=>!!ses&&ses.role==='admin';
const curW=()=>db.workers.find(w=>w.id===selId)||null;
const stCls={fit:'ok',cond:'soon',unfit:'exp'};
const badge=(c,t)=>`<span class="badge b-${c}">${esc(t)}</span>`;
const initials=n=>{const p=String(n).trim().split(/\s+/);return p[0][0]+(p[1]?'‌'+p[1][0]:'')};
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>{t.hidden=true},2800)}

/* ---------- منطق سررسید و حدود ---------- */
const KEYF={tr:'title',ex:'kind',ppe:'item'};
const isOld=(w,t,r)=>{const k=KEYF[t];return !!k&&w[t].some(o=>o!==r&&o[k]===r[k]&&dayNum(o.date)>dayNum(r.date))};
function eb(date,lab){const s=expState(date);if(!s)return'';const t=s.c==='exp'?'منقضی شده · '+fa(-s.d)+' روز پیش':s.c==='soon'?'نزدیک انقضا · '+fa(s.d)+' روز مانده':lab+' '+fa(date);return badge(s.c,t)}
function tracked(w){
 const a=[];
 w.tr.forEach(r=>{if(r.cert==='دارد'&&r.valid&&!isOld(w,'tr',r))a.push(r.valid)});
 w.ex.forEach(r=>{if(r.next&&!isOld(w,'ex',r))a.push(r.next)});
 w.ppe.forEach(r=>{if(r.due&&!isOld(w,'ppe',r))a.push(r.due)});
 return a;
}
function alerts(w){const c={exp:0,soon:0,ok:0};tracked(w).forEach(d=>{const s=expState(d);if(s)c[s.c]++});return c}
function lvl(v,l,dir){v=+v;l=+l;if(!isFinite(v)||!isFinite(l)||!l)return'ok';if(dir==='min')return v<l?'exp':v<l*1.2?'soon':'ok';return v>l?'exp':v>=l*.8?'soon':'ok'}
const LV={exp:'خارج از حد مجاز',soon:'نزدیک به حد مجاز',ok:'در محدوده مجاز'};
function gauge(v,l,dir,c){const max=l*1.4,pct=Math.min(100,Math.max(3,v/max*100)),mk=l/max*100;return`<div class="gauge g-${c}" aria-hidden="true"><i style="width:${pct}%"></i><b style="right:${mk}%"></b></div><div class="gl"><span>مقدار: ${fa(v)}</span><span>${dir==='min'?'حداقل':'حداکثر'} مجاز: ${fa(l)}</span></div>`}
function service(h){const d=dayNum(TODAY)-dayNum(h);if(isNaN(d)||d<0)return'—';const y=T(d/365.25),m=T((d%365.25)/30.44);return(y?fa(y)+' سال':'')+(y&&m?' و ':'')+(m||!y?fa(m)+' ماه':'')}

/* ---------- نوار کاربر و منو ---------- */
function renderUser(){
 $('#userbox').innerHTML=ses?`<span class="chip-u">${esc(ses.name)} · ${L.role[ses.role]}</span><button class="btn btn-light btn-sm" data-a="logout">خروج</button>`:`<span class="chip-u">مهمان · فقط مشاهده</span><button class="btn btn-light btn-sm" data-a="login">ورود</button>`;
}
const VIEWS=[['workers','پرونده کارگران'],['measure','گزارش اندازه‌گیری عوامل زیان‌آور'],['actions','اقدام اصلاحی'],['accounts','کاربران و دسترسی']];
function renderNav(){
 const open=db.actions.filter(a=>a.st!=='done').length;
 $('#nav').innerHTML=VIEWS.filter(v=>v[0]!=='accounts'||isAdmin()).map(([k,t])=>`<button class="navbtn${view===k?' on':''}" data-a="view" data-v="${k}"${view===k?' aria-current="page"':''}>${t}${k==='actions'&&open?`<span class="cnt">${fa(open)}</span>`:''}</button>`).join('');
}
function setView(v){
 if(v==='accounts'&&!isAdmin())v='workers';
 view=v;
 VIEWS.forEach(([k])=>{$('#view-'+k).hidden=k!==v});
 renderNav();
 if(v==='workers'){renderResults();renderProfile();renderDossier();renderStats()}
 if(v==='measure')renderMeasure();
 if(v==='actions')renderActions();
 if(v==='accounts')renderAccounts();
}
function renderAll(){renderUser();setView(view)}

/* ---------- جستجو ---------- */
function matches(q){const n=norm(q);if(!n)return db.workers;return db.workers.filter(w=>norm(w.name+w.code).includes(n))}
function syncSel(){const m=matches(query);if(!m.length){selId=null}else if(!m.some(w=>w.id===selId)){selId=m[0].id}}
function renderSuggest(){
 const box=$('#sug'),inp=$('#q');
 if(!query.trim()){box.hidden=true;box.innerHTML='';inp.setAttribute('aria-expanded','false');return}
 const m=matches(query).slice(0,6);
 box.hidden=false;inp.setAttribute('aria-expanded','true');
 box.innerHTML=m.length?m.map((w,i)=>`<button type="button" role="option" class="sug-i${i===sugIdx?' on':''}" data-a="pick" data-id="${w.id}"><span class="av sm">${esc(initials(w.name))}</span><span class="sug-t"><b>${esc(w.name)}</b><small>${esc(w.job)}${w.unit?' · '+esc(w.unit):''} · ${w.type==='client'?'شناسه':'کد'} ${fa(w.code||'—')}</small></span></button>`).join(''):'<div class="sug-none">موردی یافت نشد</div>';
}
function renderResults(){
 const m=matches(query),el=$('#resList');
 $('#resCount').textContent=query.trim()?fa(m.length)+' مورد یافت شد':fa(m.length)+' پرونده ثبت‌شده';
 if(!m.length){
  el.className='';
  el.innerHTML=`<div class="empty"><b>موردی یافت نشد</b>برای «${esc(query)}» پرونده‌ای ثبت نشده است. نام را کوتاه‌تر بنویسید یا با کد پرسنلی جستجو کنید.${canEdit()?`<div class="row" style="justify-content:center;margin-top:12px"><button class="btn btn-pri" data-a="add" data-e="worker">افزودن «${esc(query.trim())}» به‌عنوان پرونده جدید</button></div>`:''}</div>`;
  return;
 }
 el.className='picks';
 el.innerHTML=m.map(w=>`<button class="pick${w.id===selId?' on':''}" data-a="pick" data-id="${w.id}"><span class="av sm">${esc(initials(w.name))}</span><span><b>${esc(w.name)}</b><small>${esc(w.job)}${w.unit?' · '+esc(w.unit):''}</small></span></button>`).join('');
}

/* ---------- کارت پروفایل ---------- */
function renderProfile(){
 const w=curW(),el=$('#profile');
 if(!w){el.innerHTML='';return}
 const a=alerts(w),nx=expState(w.nx),isC=w.type==='client';
 el.innerHTML=`<div class="card prof">
  <div class="prof-top"><span class="av">${esc(initials(w.name))}</span>
   <div class="grow"><h3>${esc(w.name)}</h3><div class="row" style="margin-top:6px">${badge(stCls[w.status],L.status[w.status])}${isC?badge('info','مشتری / کارفرما'):''}</div></div>
   <div class="row"><button class="btn btn-pri btn-sm" data-a="print">نمای چاپی پرونده</button>${canEdit()?`<button class="btn btn-ghost btn-sm" data-a="edit" data-e="worker" data-id="${w.id}">ویرایش مشخصات</button>`:''}</div></div>
  <div class="pf-grid">
   <div><small>${isC?'شناسه':'کد پرسنلی'}</small><b>${fa(w.code||'—')}</b></div>
   <div><small>سمت / نوع شغل</small><b>${esc(w.job)}</b></div>
   <div><small>واحد</small><b>${esc(w.unit||'—')}</b></div>
   <div><small>${isC?'شروع همکاری':'تاریخ استخدام'}</small><b>${longDate(w.hire)}</b>${w.hire?`<small>سابقه: ${service(w.hire)}</small>`:''}</div>
   <div><small>معاینه بعدی</small><b>${w.nx?longDate(w.nx):'—'}</b>${nx?`<div style="margin-top:4px">${eb(w.nx,'معتبر')}</div>`:''}</div>
  </div>
  ${a.exp+a.soon?`<div class="alertbar" role="alert">این پرونده ${a.exp?fa(a.exp)+' مورد منقضی':''}${a.exp&&a.soon?' و ':''}${a.soon?fa(a.soon)+' مورد نزدیک انقضا':''} دارد.</div>`:''}
 </div>`;
}

/* ---------- تب‌ها ---------- */
const TABS=[['tr','آموزش‌ها'],['ex','معاینات و آزمایش‌ها'],['rf','ارجاعات'],['ot','سایر موارد']];
const FT={
 tr:[['','همه وضعیت‌ها'],['cert','گواهی‌دار'],['nocert','بدون گواهی / در انتظار'],['risk','منقضی یا نزدیک انقضا']],
 ex:[['','همه معاینات'],...o2(L.kind)],
 rf:[['','همه وضعیت‌ها'],...o2(L.rf)],
 ot:[['','همه موارد'],['inc','حوادث و شبه‌حادثه'],['ppe','تجهیزات حفاظت فردی'],['exp','مواجهه شغلی']]
};
function entries(w,tb){
 if(tb==='ot')return[...w.inc.map(r=>({t:'inc',r})),...w.ppe.map(r=>({t:'ppe',r})),...w.exp.map(r=>({t:'exp',r}))];
 return w[tb].map(r=>({t:tb,r}));
}
function passF(tb,e,w){
 if(!ft)return true;
 if(tb==='ot')return e.t===ft;
 if(tb==='ex')return e.r.kind===ft;
 if(tb==='rf')return e.r.status===ft;
 if(ft==='cert')return e.r.cert==='دارد';
 if(ft==='nocert')return e.r.cert!=='دارد';
 const s=e.r.cert==='دارد'&&!isOld(w,'tr',e.r)?expState(e.r.valid):null;return !!s&&s.c!=='ok';
}
function renderDossier(){
 const w=curW(),el=$('#dossier');
 if(!w){el.innerHTML='';return}
 const all=entries(w,tab),years=[...new Set(all.map(e=>String(e.r.date||'').slice(0,4)).filter(Boolean))].sort().reverse();
 if(fy&&!years.includes(fy))fy='';
 el.innerHTML=`<div class="card">
  <div class="tabs" role="tablist">${TABS.map(([k,t])=>`<button class="tab${tab===k?' on':''}" role="tab" aria-selected="${tab===k}" data-a="tab" data-v="${k}">${t}<span class="n">${fa(entries(w,k).length)}</span></button>`).join('')}</div>
  <div class="tools">
   <select class="sel" id="fy" aria-label="فیلتر سال"><option value="">همه سال‌ها</option>${years.map(y=>`<option value="${y}"${fy===y?' selected':''}>${fa(y)}</option>`).join('')}</select>
   <select class="sel" id="ft" aria-label="فیلتر نوع">${FT[tab].map(([k,t])=>`<option value="${k}"${ft===k?' selected':''}>${t}</option>`).join('')}</select>
   <button class="btn btn-ghost" data-a="sort" id="sortBtn">${fsort==='desc'?'جدیدترین ابتدا ↓':'قدیمی‌ترین ابتدا ↑'}</button>
  </div>
  ${canEdit()?`<div class="row" style="margin-bottom:12px">${tab==='ot'?`<button class="btn btn-warn btn-sm" data-a="add" data-e="inc">+ حادثه / شبه‌حادثه</button><button class="btn btn-warn btn-sm" data-a="add" data-e="ppe">+ تجهیز حفاظت فردی</button><button class="btn btn-warn btn-sm" data-a="add" data-e="exp">+ مواجهه شغلی</button>`:`<button class="btn btn-warn btn-sm" data-a="add" data-e="${tab}">+ افزودن ${SCH[tab].t}</button>`}</div>`:''}
  <div id="recs"></div></div>`;
 renderRecs();
}
function renderRecs(){
 const w=curW(),el=$('#recs');if(!w||!el)return;
 let list=entries(w,tab).filter(e=>passF(tab,e,w)&&(!fy||String(e.r.date).slice(0,4)===fy));
 list.sort((a,b)=>(dayNum(a.r.date)-dayNum(b.r.date))*(fsort==='desc'?-1:1));
 let h='';
 if(tab==='ot'){const s=expState(w.nx);h+=`<div class="next"><span>معاینه بعدی طب کار:</span><b>${w.nx?longDate(w.nx):'ثبت نشده'}</b>${s?eb(w.nx,'معتبر'):''}</div>`}
 h+=list.length?`<div class="recs">${list.map(e=>card(e.t,e.r,w)).join('')}</div>`:`<div class="empty"><b>موردی برای نمایش نیست</b>${entries(w,tab).length?'فیلترها را تغییر دهید.':'هنوز موردی در این بخش ثبت نشده است.'}</div>`;
 el.innerHTML=h;
}
const acts=(e,id)=>canEdit()?`<div class="acts"><button class="btn btn-ghost btn-sm" data-a="edit" data-e="${e}" data-id="${id}">ویرایش</button><button class="btn btn-ghost btn-sm danger" data-a="del" data-e="${e}" data-id="${id}">حذف</button></div>`:'';
const rec=(h,b,m,p,e,id)=>`<article class="rec"><h4>${h}</h4><div class="rec-b">${b.join('')}</div><div class="rec-m">${m.filter(Boolean).map(x=>`<span>${x}</span>`).join('')}</div>${p}${acts(e,id)}</article>`;
const supers=badge('info','جایگزین‌شده با نمونه جدیدتر');
function card(t,r,w){
 if(t==='tr'){
  const old=isOld(w,t,r),b=[badge(r.cert==='دارد'?'ok':r.cert==='ندارد'?'exp':'info','گواهی: '+r.cert)];
  if(old)b.push(supers);else if(r.cert==='دارد'&&r.valid)b.push(eb(r.valid,'اعتبار تا'));
  return rec(esc(r.title),b,['تاریخ: '+fa(r.date),r.hours?'مدت: '+fa(r.hours)+' ساعت':'',r.teacher?'مدرس: '+esc(r.teacher):''],'','tr',r.id);
 }
 if(t==='ex'){
  const old=isOld(w,t,r),b=[old?supers:eb(r.next,'معاینه بعدی')];
  return rec(esc(L.kind[r.kind]||r.kind),b,['تاریخ: '+fa(r.date),r.doctor?'پزشک: '+esc(r.doctor):''],`<p class="rec-p"><b>نتیجه:</b> ${esc(r.result)}</p>${r.opinion?`<p class="rec-p"><b>نظر پزشک:</b> ${esc(r.opinion)}</p>`:''}`,'ex',r.id);
 }
 if(t==='rf')return rec(esc(r.to),[badge({doing:'soon',wait:'info',done:'ok'}[r.status]||'info',L.rf[r.status]||r.status)],['تاریخ ارجاع: '+fa(r.date)],`<p class="rec-p"><b>علت:</b> ${esc(r.reason)}</p>`,'rf',r.id);
 if(t==='inc')return rec(esc(r.kind),[badge(r.kind==='حادثه'?'exp':'info',r.kind),badge({'کم':'ok','متوسط':'soon','شدید':'exp'}[r.severity]||'info','شدت: '+r.severity)],['تاریخ: '+fa(r.date)],`<p class="rec-p">${esc(r.desc)}</p>`,'inc',r.id);
 if(t==='ppe'){const old=isOld(w,t,r);return rec(esc(r.item),[old?supers:eb(r.due,'تعویض تا')],['تحویل: '+fa(r.date)],'','ppe',r.id)}
 if(t==='exp'){const c=lvl(r.value,r.limit,'max');return rec('مواجهه شغلی · '+esc(r.agent),[badge(c,LV[c])],['تاریخ: '+fa(r.date)],`<p class="rec-p">${fa(r.value)} ${esc(r.unit)} در برابر حد مجاز ${fa(r.limit)} ${esc(r.unit)}</p>${gauge(+r.value,+r.limit,'max',c)}`,'exp',r.id)}
 return'';
}

/* ---------- آمار کلی ---------- */
const tile=(l,v,w,s)=>`<div class="tile${w?' w':''}"><small>${l}</small><b>${fa(v)}</b>${s?`<small>${s}</small>`:''}</div>`;
function renderStats(){
 const ws=db.workers.filter(w=>w.type!=='client'),n=ws.length;
 const st={fit:0,cond:0,unfit:0},it={ok:0,soon:0,exp:0},un={};
 ws.forEach(w=>{st[w.status]++;const a=alerts(w);it.ok+=a.ok;it.soon+=a.soon;it.exp+=a.exp;un[w.unit||'نامشخص']=(un[w.unit||'نامشخص']||0)+1});
 const rfo=ws.reduce((s,w)=>s+w.rf.filter(r=>r.status!=='done').length,0);
 const acc=ws.reduce((s,w)=>s+w.inc.filter(r=>r.kind==='حادثه').length,0),nm=ws.reduce((s,w)=>s+w.inc.filter(r=>r.kind!=='حادثه').length,0);
 const mx=db.measures.filter(m=>lvl(m.value,m.limit,m.dir)==='exp').length,ao=db.actions.filter(a=>a.st!=='done').length;
 const maxU=Math.max(1,...Object.values(un));
 const ml={ok:0,soon:0,exp:0};db.measures.forEach(m=>ml[lvl(m.value,m.limit,m.dir)]++);
 const stack=(o,labs)=>{const tot=Math.max(1,o.ok+o.soon+o.exp);return`<div class="stk" role="img" aria-label="${labs.map(([k,t])=>t+' '+fa(o[k])).join('، ')}">${['ok','soon','exp'].map(k=>o[k]?`<i class="s-${k}" style="flex:${o[k]/tot}"></i>`:'').join('')}</div><div class="lg">${labs.map(([k,t])=>`<span style="--c:var(--${k==='ok'?'ok':k==='soon'?'accent':'bad'})">${t}: ${fa(o[k])}</span>`).join('')}</div>`};
 $('#statDate').textContent='تا '+longDate(TODAY);
 $('#stats').innerHTML=`<div class="tiles">
  ${tile('کارگران ثبت‌شده',n)}
  ${tile('دارای صلاحیت کامل',st.fit,0,n?fa(Math.round(st.fit/n*100))+'٪ کارگران':'')}
  ${tile('صلاحیت مشروط یا موقتاً فاقد',st.cond+st.unfit,st.cond+st.unfit>0)}
  ${tile('سررسید گذشته',it.exp,it.exp>0,'آموزش، معاینه، تجهیزات')}
  ${tile('نزدیک انقضا (۶۰ روز)',it.soon,it.soon>0)}
  ${tile('ارجاع در جریان',rfo,rfo>0)}
  ${tile('حادثه / شبه‌حادثه',acc+nm,0,fa(acc)+' حادثه، '+fa(nm)+' شبه‌حادثه')}
  ${tile('اندازه‌گیری خارج از حد',mx,mx>0)}
  ${tile('اقدام اصلاحی باز',ao,ao>0)}
 </div>
 <div class="charts">
  <div class="card"><h3>کارگران به تفکیک واحد</h3>${Object.entries(un).sort((a,b)=>b[1]-a[1]).map(([u,c])=>`<div class="hb"><span>${esc(u)}</span><div class="hb-t"><i style="width:${c/maxU*100}%"></i></div><b>${fa(c)}</b></div>`).join('')}</div>
  <div class="card"><h3>وضعیت سررسید آموزش‌ها، معاینات و تجهیزات</h3>${stack(it,[['ok','معتبر'],['soon','نزدیک انقضا'],['exp','منقضی']])}<h3 style="margin-top:6px">وضعیت صلاحیت کار</h3>${stack({ok:st.fit,soon:st.cond,exp:st.unfit},[['ok','دارای صلاحیت'],['soon','مشروط'],['exp','فاقد موقت']])}</div>
  <div class="card"><h3>نتیجه اندازه‌گیری عوامل زیان‌آور</h3>${stack(ml,[['ok','مجاز'],['soon','نزدیک حد'],['exp','خارج از حد']])}<p class="hint" style="margin-top:0">${fa(db.measures.length)} نقطه اندازه‌گیری‌شده در ${fa(new Set(db.measures.map(m=>m.unit)).size)} واحد کاری.</p></div>
 </div>`;
}
/* ---------- گزارش اندازه‌گیری عوامل زیان‌آور ---------- */
function renderMeasure(){
 const ms=db.measures,lv=ms.map(m=>lvl(m.value,m.limit,m.dir));
 const cnt=k=>lv.filter(x=>x===k).length;
 const agents=[...new Set(ms.map(m=>m.agent))];
 if(mfl&&!agents.includes(mfl))mfl='';
 $('#measureV').innerHTML=`<div class="tiles">${tile('نقطه اندازه‌گیری‌شده',ms.length)}${tile('خارج از حد مجاز',cnt('exp'),cnt('exp')>0)}${tile('نزدیک به حد مجاز',cnt('soon'),cnt('soon')>0)}${tile('در محدوده مجاز',cnt('ok'))}</div>
 <div class="tools"><select class="sel" id="mfl" aria-label="فیلتر عامل"><option value="">همه عوامل زیان‌آور</option>${agents.map(a=>`<option value="${esc(a)}"${mfl===a?' selected':''}>${esc(a)}</option>`).join('')}</select>${canEdit()?'<button class="btn btn-warn" data-a="add" data-e="measure">+ ثبت اندازه‌گیری</button>':''}</div>
 <div id="mList"></div>`;
 renderMList();
}
function renderMList(){
 const list=db.measures.filter(m=>!mfl||m.agent===mfl).sort((a,b)=>dayNum(b.date)-dayNum(a.date));
 $('#mList').innerHTML=list.length?`<div class="recs">${list.map(m=>{
  const c=lvl(m.value,m.limit,m.dir),n=db.actions.filter(a=>a.mid===m.id).length;
  return`<article class="rec"><h4>${esc(m.agent)}</h4><div class="rec-b">${badge(c,LV[c])}${n?badge('info','اقدام اصلاحی: '+fa(n)+' مورد'):(c!=='ok'?badge('soon','بدون اقدام اصلاحی'):'')}</div>
  <div class="rec-m"><span>${esc(m.unit)} · ${esc(m.point)}</span><span>تاریخ: ${fa(m.date)}</span>${m.lab?`<span>${esc(m.lab)}</span>`:''}</div>
  <p class="rec-p"><b>${fa(m.value)} ${esc(m.mu)}</b>${m.note?' · '+esc(m.note):''}</p>${gauge(+m.value,+m.limit,m.dir,c)}
  ${canEdit()?`<div class="acts">${c!=='ok'?`<button class="btn btn-warn btn-sm" data-a="mk-action" data-id="${m.id}">ثبت اقدام اصلاحی</button>`:''}<button class="btn btn-ghost btn-sm" data-a="edit" data-e="measure" data-id="${m.id}">ویرایش</button><button class="btn btn-ghost btn-sm danger" data-a="del" data-e="measure" data-id="${m.id}">حذف</button></div>`:''}</article>`}).join('')}</div>`:'<div class="empty"><b>اندازه‌گیری ثبت نشده است</b></div>';
}

/* ---------- اقدام اصلاحی ---------- */
const AF=[['','همه اقدام‌ها'],['open','باز'],['doing','در حال انجام'],['done','بسته‌شده'],['late','دارای تأخیر']];
const isLate=a=>a.st!=='done'&&dayNum(a.due)<TN;
function renderActions(){
 const as=db.actions,o=as.filter(a=>a.st==='open').length,d=as.filter(a=>a.st==='doing').length,c=as.filter(a=>a.st==='done').length,l=as.filter(isLate).length;
 $('#actionsV').innerHTML=`<div class="tiles">${tile('باز',o,o>0)}${tile('در حال انجام',d)}${tile('بسته‌شده',c)}${tile('دارای تأخیر',l,l>0)}</div>
 <div class="tools"><select class="sel" id="afl" aria-label="فیلتر وضعیت">${AF.map(([k,t])=>`<option value="${k}"${afl===k?' selected':''}>${t}</option>`).join('')}</select>${canEdit()?'<button class="btn btn-warn" data-a="add" data-e="action">+ اقدام اصلاحی جدید</button>':''}</div><div id="aList"></div>`;
 renderAList();
}
function renderAList(){
 const pc={'بالا':'exp','متوسط':'soon','پایین':'info'};
 const list=db.actions.filter(a=>!afl||(afl==='late'?isLate(a):a.st===afl)).sort((a,b)=>dayNum(a.due)-dayNum(b.due));
 $('#aList').innerHTML=list.length?`<div class="recs">${list.map(a=>{
  const nextTxt={open:'شروع اقدام',doing:'بستن اقدام',done:'بازگشایی'}[a.st],m=db.measures.find(x=>x.id===a.mid);
  return`<article class="rec"><h4>${esc(a.title)}</h4><div class="rec-b">${badge({open:'info',doing:'soon',done:'ok'}[a.st],L.act[a.st])}${badge(pc[a.pri]||'info','اولویت '+a.pri)}${a.st!=='done'?eb(a.due,'مهلت تا'):badge('ok','انجام‌شده')}</div>
  <div class="rec-m"><span>مسئول: ${esc(a.resp)}</span>${a.src?`<span>منبع: ${esc(a.src)}</span>`:''}${m?`<span>اندازه‌گیری: ${esc(m.agent)} · ${esc(m.point)}</span>`:''}</div>
  ${a.desc?`<p class="rec-p">${esc(a.desc)}</p>`:''}
  ${canEdit()?`<div class="acts"><button class="btn btn-pri btn-sm" data-a="adv" data-id="${a.id}">${nextTxt}</button><button class="btn btn-ghost btn-sm" data-a="edit" data-e="action" data-id="${a.id}">ویرایش</button><button class="btn btn-ghost btn-sm danger" data-a="del" data-e="action" data-id="${a.id}">حذف</button></div>`:''}</article>`}).join('')}</div>`:'<div class="empty"><b>اقدامی با این فیلتر وجود ندارد</b></div>';
}

/* ---------- کاربران ---------- */
function renderAccounts(){
 if(!isAdmin()){$('#accountsV').innerHTML='';return}
 $('#accountsV').innerHTML=`<div class="tools"><button class="btn btn-warn" data-a="add" data-e="account">+ تعریف حساب جدید</button><button class="btn btn-ghost danger" data-a="reset">بازنشانی به داده نمونه</button></div>
 <div class="recs">${db.accounts.map(a=>`<article class="rec"><h4>${esc(a.name)}</h4><div class="rec-b">${badge(a.role==='admin'?'info':'ok',L.role[a.role])}${ses&&ses.id===a.id?badge('soon','حساب فعلی'):''}</div><div class="rec-m"><span dir="ltr">${esc(a.username)}</span></div><div class="acts"><button class="btn btn-ghost btn-sm" data-a="edit" data-e="account" data-id="${a.id}">ویرایش</button><button class="btn btn-ghost btn-sm danger" data-a="del" data-e="account" data-id="${a.id}">حذف</button></div></article>`).join('')}</div>
 <p class="hint">مدیر می‌تواند کاربر تعریف و پرونده را حذف کند؛ کاربر عادی فقط اطلاعات را ثبت و ویرایش می‌کند. مهمان فقط مشاهده می‌کند. گذرواژه‌ها در همین مرورگر ذخیره می‌شود و این نسخه جایگزین احراز هویت سروری نیست.</p>`;
}

/* ---------- نمای چاپی ---------- */
function dossierDoc(w){
 const sec=(t,head,rs)=>`<h3>${t}</h3>${rs.length?`<table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rs.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`:'<p class="none">موردی ثبت نشده است.</p>'}`;
 const srt=a=>a.slice().sort((x,y)=>dayNum(y.date)-dayNum(x.date));
 const ex=(d,old)=>d?fa(d)+(old?'':(expState(d).c==='exp'?' (منقضی)':expState(d).c==='soon'?' (نزدیک انقضا)':'')):'—';
 return`<div class="pscroll"><div class="paper"><h2>پرونده بهداشت حرفه‌ای</h2><p>تاریخ تهیه: ${longDate(TODAY)}</p>
 <table><tbody><tr><th>نام</th><td>${esc(w.name)}</td><th>${w.type==='client'?'شناسه':'کد پرسنلی'}</th><td>${fa(w.code||'—')}</td></tr><tr><th>سمت</th><td>${esc(w.job)}</td><th>واحد</th><td>${esc(w.unit||'—')}</td></tr><tr><th>تاریخ استخدام</th><td>${longDate(w.hire)}</td><th>وضعیت صلاحیت کار</th><td>${L.status[w.status]}</td></tr><tr><th>معاینه بعدی</th><td colspan="3">${w.nx?longDate(w.nx):'—'}</td></tr></tbody></table>
 ${sec('آموزش‌ها',['عنوان','تاریخ','مدت','مدرس','گواهی','اعتبار تا'],srt(w.tr).map(r=>[esc(r.title),fa(r.date),r.hours?fa(r.hours)+' ساعت':'—',esc(r.teacher||'—'),esc(r.cert),r.valid?ex(r.valid,isOld(w,'tr',r)):'—']))}
 ${sec('معاینات و آزمایش‌های طب کار',['نوع','تاریخ','نتیجه','نظر پزشک','معاینه بعدی'],srt(w.ex).map(r=>[L.kind[r.kind],fa(r.date),esc(r.result),esc(r.opinion||'—'),ex(r.next,isOld(w,'ex',r))]))}
 ${sec('ارجاعات',['مرجع','علت','تاریخ','وضعیت'],srt(w.rf).map(r=>[esc(r.to),esc(r.reason),fa(r.date),L.rf[r.status]]))}
 ${sec('حوادث و شبه‌حادثه',['نوع','تاریخ','شرح','شدت'],srt(w.inc).map(r=>[esc(r.kind),fa(r.date),esc(r.desc),esc(r.severity)]))}
 ${sec('تجهیزات حفاظت فردی',['تجهیز','تاریخ تحویل','سررسید تعویض'],srt(w.ppe).map(r=>[esc(r.item),fa(r.date),ex(r.due,isOld(w,'ppe',r))]))}
 ${sec('مواجهه شغلی',['عامل','تاریخ','مقدار','حد مجاز','نتیجه'],srt(w.exp).map(r=>[esc(r.agent),fa(r.date),fa(r.value)+' '+esc(r.unit),fa(r.limit)+' '+esc(r.unit),LV[lvl(r.value,r.limit,'max')]]))}
 <div class="sign"><div>پزشک طب کار</div><div>کارشناس HSE</div><div>مسئول کارگاه</div></div></div></div>`;
}
function openPrint(){const w=curW();if(!w)return;const p=$('#printLayer');p.innerHTML=`<div class="pbar noprint"><button class="btn btn-pri" data-a="closeprint">بازگشت به پرونده</button><span class="muted">برای چاپ یا ذخیره PDF از منوی مرورگر (Ctrl+P) استفاده کنید.</span></div>${dossierDoc(w)}`;p.hidden=false;p.scrollTop=0}

/* ---------- فرم‌ها و پنجره ---------- */
function modal(html){$('#modalRoot').innerHTML=`<div class="modal" data-a="mbg"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;const f=$('#modalRoot input:not([type=hidden]),#modalRoot select');if(f)setTimeout(()=>f.focus(),30)}
function closeModal(){$('#modalRoot').innerHTML=''}
function fieldHTML(f,v){
 const id='f_'+f.k,val=v==null?'':v;let c;
 const o=typeof f.o==='function'?f.o():f.o;
 if(f.t==='select')c=`<select id="${id}" name="${f.k}">${o.map(([k,l])=>`<option value="${esc(k)}"${String(k)===String(val)?' selected':''}>${esc(l)}</option>`).join('')}</select>`;
 else if(f.t==='textarea')c=`<textarea id="${id}" name="${f.k}" rows="3">${esc(val)}</textarea>`;
 else{
  const ltr=f.t==='date'||f.t==='number'||f.t==='password'||f.t==='user';
  c=`<input id="${id}" name="${f.k}" type="${f.t==='password'?'password':'text'}" value="${esc(f.t==='date'||f.t==='number'?fa(val):val)}"${f.t==='date'?' inputmode="numeric" placeholder="1405/01/01"':''}${f.t==='number'?' inputmode="decimal"':''}${ltr?' dir="ltr" style="text-align:right"':''}${f.list?` list="dl_${f.list}"`:''} autocomplete="off">`;
 }
 return`<label class="fld${f.w?' wide':''}" for="${id}"><span>${f.l}${f.req?' <em>*</em>':''}</span>${c}${f.h?`<small>${f.h}</small>`:''}</label>`;
}
function openForm(ent,rec,pre){
 const s=SCH[ent],vals=Object.assign({},DEF[ent]||{},pre||{},rec||{});
 if(ent==='account'&&rec)vals.password='';
 const del=rec&&((ent==='worker'&&isAdmin())||ent==='account')?`<button type="button" class="btn btn-ghost danger" data-a="del" data-e="${ent}" data-id="${rec.id}">حذف</button>`:'';
 modal(`<h3>${rec?'ویرایش':'افزودن'} ${s.t}</h3><form id="frm" data-e="${ent}" data-id="${rec?rec.id:''}" novalidate><div id="ferr" class="ferr" hidden></div><div class="fgrid">${s.f.map(f=>fieldHTML(f,vals[f.k])).join('')}</div>
 <datalist id="dl_jobs">${DL.jobs.map(x=>`<option value="${esc(x)}">`).join('')}</datalist><datalist id="dl_agents">${DL.agents.map(x=>`<option value="${esc(x)}">`).join('')}</datalist>
 <div class="fbar"><button type="submit" class="btn btn-pri">ذخیره</button><button type="button" class="btn btn-ghost" data-a="mclose">انصراف</button>${del}</div></form>`);
}
function readForm(ent,form){
 const out={},errs=[];
 SCH[ent].f.forEach(fl=>{
  let v=form.elements[fl.k].value.trim();
  if(fl.t==='date'||fl.t==='number')v=toEn(v);
  if(fl.t==='user')v=toEn(v);
  if(fl.req&&!v)errs.push(fl.l+' را وارد کنید.');
  if(fl.t==='date'&&v){const m=RE.exec(v);if(!m||isNaN(dayNum(v)))errs.push(fl.l+' را به شکل ۱۴۰۵/۰۸/۰۲ وارد کنید.');else v=m[1]+'/'+pad(+m[2])+'/'+pad(+m[3])}
  if(fl.t==='number'&&v){if(!isFinite(+v))errs.push(fl.l+' باید عدد باشد.');else v=+v}
  out[fl.k]=v;
 });
 return{out,errs};
}
function coll(e){return e==='worker'?db.workers:e==='measure'?db.measures:e==='action'?db.actions:e==='account'?db.accounts:(curW()?curW()[e]:[])}
function submitForm(form){
 const ent=form.dataset.e,id=form.dataset.id,{out,errs}=readForm(ent,form);
 const arr=coll(ent),rec=id?arr.find(r=>r.id===id):null;
 if(ent==='account'){
  if(out.username&&db.accounts.some(a=>a.username===out.username&&a.id!==id))errs.push('این نام کاربری قبلاً تعریف شده است.');
  if(!rec&&!out.password)errs.push('گذرواژه را وارد کنید.');
  if(out.password&&out.password.length<4)errs.push('گذرواژه دست‌کم ۴ نویسه باشد.');
  if(rec&&rec.role==='admin'&&out.role!=='admin'&&db.accounts.filter(a=>a.role==='admin').length<2)errs.push('دست‌کم یک مدیر باید باقی بماند.');
 }
 if(errs.length){const b=$('#ferr');b.innerHTML=errs.map(e=>`<p>${e}</p>`).join('');b.hidden=false;return}
 if(ent==='account'){const pw=out.password;delete out.password;if(pw)out.pass=hash(pw);else if(rec)out.pass=rec.pass}
 let target=rec;
 if(rec)Object.assign(rec,out);
 else{
  target=Object.assign({id:uid()},out);
  if(ent==='worker'){['tr','ex','rf','inc','ppe','exp'].forEach(k=>target[k]=[]);selId=target.id;query='';$('#q').value='';tab='tr';fy='';ft=''}
  arr.push(target);
 }
 if(ent==='account'&&ses&&ses.id===target.id)ses=target;
 save();closeModal();
 if(ent==='worker'||['tr','ex','rf','inc','ppe','exp'].includes(ent)){
  if(['inc','ppe','exp'].includes(ent)&&tab!=='ot'){tab='ot';ft=''}
  if(['tr','ex','rf'].includes(ent))tab=ent;
 }
 renderAll();renderSuggest();toast(rec?'تغییرات ذخیره شد.':'مورد جدید ثبت شد.');
}
function doDel(e,id){
 const arr=coll(e),i=arr.findIndex(r=>r.id===id);if(i<0)return;
 if(e==='account'){
  if(ses&&ses.id===id){toast('حساب فعلی را نمی‌توان حذف کرد.');return}
  if(arr[i].role==='admin'&&arr.filter(a=>a.role==='admin').length<2){toast('دست‌کم یک مدیر باید باقی بماند.');return}
 }
 arr.splice(i,1);
 if(e==='worker'){selId=db.workers[0]?db.workers[0].id:null;query='';$('#q').value=''}
 save();closeModal();renderAll();renderSuggest();toast('حذف شد.');
}
/* ---------- ورود و خروج ---------- */
function openLogin(){
 modal(`<h3>ورود به سامانه</h3><form id="loginForm" novalidate><div id="ferr" class="ferr" hidden></div><div class="fgrid">
 <label class="fld wide" for="lu"><span>نام کاربری</span><input id="lu" name="u" dir="ltr" style="text-align:right" autocomplete="username"></label>
 <label class="fld wide" for="lp"><span>گذرواژه</span><input id="lp" name="p" type="password" dir="ltr" style="text-align:right" autocomplete="current-password"></label></div>
 <div class="fbar"><button class="btn btn-pri" type="submit">ورود</button><button type="button" class="btn btn-ghost" data-a="mclose">انصراف</button></div>
 <p class="hint">حساب‌های نمونه: مدیر ← admin / admin123 ، کارشناس ← expert / hse1405</p></form>`);
}
function doLogin(form){
 const u=toEn(form.elements.u.value).trim(),p=form.elements.p.value;
 const a=db.accounts.find(x=>x.username===u&&x.pass===hash(p));
 if(!a){const b=$('#ferr');b.innerHTML='<p>نام کاربری یا گذرواژه درست نیست.</p>';b.hidden=false;return}
 ses=a;try{localStorage.setItem(KEY+'-ses',a.id)}catch(e){}
 closeModal();renderAll();toast('خوش آمدید، '+a.name);
}
function doLogout(){ses=null;try{localStorage.removeItem(KEY+'-ses')}catch(e){}renderAll();toast('از حساب خارج شدید.')}
function needEdit(admin){
 if(!ses){toast('برای ثبت یا ویرایش ابتدا وارد شوید.');openLogin();return false}
 if(admin&&!isAdmin()){toast('این کار فقط برای مدیر مجاز است.');return false}
 return true;
}
function arm(el){
 if(el.dataset.armed)return true;
 el.dataset.armed='1';el.dataset.orig=el.textContent;el.textContent='تأیید حذف';el.classList.add('armed');
 setTimeout(()=>{if(el.isConnected&&el.dataset.armed){delete el.dataset.armed;el.textContent=el.dataset.orig;el.classList.remove('armed')}},4000);
 return false;
}
function pickWorker(id){
 const w=db.workers.find(x=>x.id===id);if(!w)return;
 selId=id;query=w.name;$('#q').value=w.name;sugIdx=-1;fy='';ft='';
 $('#sug').hidden=true;$('#q').setAttribute('aria-expanded','false');
 setView('workers');
 const p=$('#profile');if(p&&p.scrollIntoView)p.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ---------- رویدادها ---------- */
document.addEventListener('click',ev=>{
 if(!ev.target.closest('.searchbox')){const s=$('#sug');if(s)s.hidden=true}
 const el=ev.target.closest('[data-a]');if(!el)return;
 const a=el.dataset.a,id=el.dataset.id,e=el.dataset.e;
 if(a==='mbg'){if(ev.target===el)closeModal();return}
 if(a==='mclose')return closeModal();
 if(a==='view')return setView(el.dataset.v);
 if(a==='pick')return pickWorker(id);
 if(a==='tab'){tab=el.dataset.v;ft='';fy='';return renderDossier()}
 if(a==='sort'){fsort=fsort==='desc'?'asc':'desc';el.textContent=fsort==='desc'?'جدیدترین ابتدا ↓':'قدیمی‌ترین ابتدا ↑';return renderRecs()}
 if(a==='print')return openPrint();
 if(a==='closeprint'){$('#printLayer').hidden=true;return}
 if(a==='login')return openLogin();
 if(a==='logout')return doLogout();
 if(a==='add'){
  if(!needEdit(e==='account'))return;
  if(e!=='worker'&&e!=='measure'&&e!=='action'&&e!=='account'&&!curW())return;
  return openForm(e,null,e==='worker'&&query.trim()?{name:query.trim()}:null);
 }
 if(a==='edit'){
  if(!needEdit(e==='account'))return;
  const r=coll(e).find(x=>x.id===id);if(r)openForm(e,r);return;
 }
 if(a==='del'){
  if(!needEdit(e==='account'||e==='worker'))return;
  if(!arm(el))return;
  return doDel(e,id);
 }
 if(a==='mk-action'){
  if(!needEdit())return;
  const m=db.measures.find(x=>x.id===id);if(!m)return;
  return openForm('action',null,{title:'اصلاح وضعیت '+m.agent+' در '+m.point,src:m.agent+' · '+fa(m.value)+' '+m.mu,mid:m.id,pri:lvl(m.value,m.limit,m.dir)==='exp'?'بالا':'متوسط'});
 }
 if(a==='adv'){
  if(!needEdit())return;
  const x=db.actions.find(r=>r.id===id);if(!x)return;
  x.st={open:'doing',doing:'done',done:'open'}[x.st];save();renderActions();renderNav();toast('وضعیت اقدام: '+L.act[x.st]);return;
 }
 if(a==='reset'){
  if(!needEdit(true))return;
  if(!arm(el))return;
  const un=ses.username;db=seedDB();ses=db.accounts.find(x=>x.username===un)||null;
  try{localStorage.setItem(KEY+'-ses',ses?ses.id:'')}catch(err){}
  const w=db.workers[0];selId=w.id;query='';$('#q').value='';save();renderAll();toast('داده نمونه بازگردانده شد.');
 }
});
document.addEventListener('change',ev=>{
 const t=ev.target;
 if(t.id==='fy'){fy=t.value;renderRecs()}
 else if(t.id==='ft'){ft=t.value;renderRecs()}
 else if(t.id==='mfl'){mfl=t.value;renderMList()}
 else if(t.id==='afl'){afl=t.value;renderAList()}
});
document.addEventListener('submit',ev=>{
 const f=ev.target;ev.preventDefault();
 if(f.id==='frm')submitForm(f);else if(f.id==='loginForm')doLogin(f);
});
const qi=$('#q');
qi.addEventListener('input',()=>{
 query=qi.value;sugIdx=-1;syncSel();
 if(view!=='workers')setView('workers');else{renderResults();renderProfile();renderDossier()}
 renderSuggest();
});
qi.addEventListener('focus',()=>{if(query.trim())renderSuggest()});
qi.addEventListener('keydown',ev=>{
 const n=Math.min(6,matches(query).length);
 if(ev.key==='ArrowDown'&&n){ev.preventDefault();sugIdx=(sugIdx+1)%n;renderSuggest()}
 else if(ev.key==='ArrowUp'&&n){ev.preventDefault();sugIdx=(sugIdx-1+n)%n;renderSuggest()}
 else if(ev.key==='Enter'){const m=matches(query);if(query.trim()&&m.length){ev.preventDefault();pickWorker(m[Math.max(0,sugIdx)].id)}}
 else if(ev.key==='Escape'){$('#sug').hidden=true}
});
document.addEventListener('keydown',ev=>{
 if(ev.key==='Escape'){if(!$('#printLayer').hidden)$('#printLayer').hidden=true;else closeModal()}
});

/* ---------- شروع ---------- */
(function init(){
 db=load();
 try{const id=localStorage.getItem(KEY+'-ses');ses=db.accounts.find(a=>a.id===id)||null}catch(e){}
 const w=db.workers.find(x=>x.name==='علی رضایی')||db.workers[0];selId=w?w.id:null;
 let h='';try{h=(location.hash||'').slice(1)}catch(e){}
 view=VIEWS.some(v=>v[0]===h)?h:'workers';
 renderAll();
})();
