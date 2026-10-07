import { writeFileSync } from 'node:fs';
export const palette = {ink:'#20334b',muted:'#61738a',line:'#bdd0df',blue:'#345b92',teal:'#14786b',amber:'#ab7628',violet:'#735b99'};
const escape = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function text(x,y,label,size=20,color=palette.ink,weight=400){return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${escape(label)}</text>`;}
export function lane(x,y,w,h,title,subtitle='',color=palette.blue){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#fff" stroke="${palette.line}" stroke-width="2" stroke-dasharray="7 7"/>${text(x+22,y+34,title,19,color,700)}${subtitle?text(x+22,y+60,subtitle,16):''}`;}
export function box(x,y,w,h,title,lines=[],kind='service'){
 const colors={service:['#f1f6fc','#345b92'],data:['#edf8f3','#14786b'],model:['#f4effa','#735b99'],human:['#fff7e6','#ab7628'],control:['#eef6fa','#345b92']};
 const [fill,accent]=colors[kind]||colors.service;
 return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${accent}" stroke-width="1.7"/><rect x="${x}" y="${y+16}" width="5" height="${h-32}" rx="2" fill="${accent}"/>${text(x+19,y+34,title,22,palette.ink,700)}${lines.map((line,i)=>text(x+19,y+64+i*25,line,18,palette.muted)).join('')}</g>`;
}
export function store(x,y,w,h,title,lines=[]){return `<g><path d="M${x},${y+18} C${x},${y-6} ${x+w},${y-6} ${x+w},${y+18} L${x+w},${y+h-18} C${x+w},${y+h+6} ${x},${y+h+6} ${x},${y+h-18} Z" fill="#edf8f3" stroke="#14786b" stroke-width="1.7"/><ellipse cx="${x+w/2}" cy="${y+18}" rx="${w/2}" ry="18" fill="#edf8f3" stroke="#14786b" stroke-width="1.7"/>${text(x+18,y+59,title,22,palette.ink,700)}${lines.map((line,i)=>text(x+18,y+89+i*25,line,18,palette.muted)).join('')}</g>`;}
export function edge(path,label='',x=0,y=0,kind='request'){
 const color=kind==='control'?palette.amber:kind==='async'?palette.teal:palette.blue;
 return `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" ${kind==='async'?'stroke-dasharray="7 5"':''} marker-end="url(#${kind}-arrow)"/>${label?`<text x="${x}" y="${y}" font-size="17" fill="${color}" paint-order="stroke" stroke="#f8fbfe" stroke-width="6" stroke-linejoin="round">${escape(label)}</text>`:''}`;
}
export function sheet({title,subtitle,body,footer,output}){
 const defs=['request','async','control'].map((kind,i)=>`<marker id="${kind}-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="${[palette.blue,palette.teal,palette.amber][i]}" stroke-width="1.6"/></marker>`).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">${escape(subtitle+' '+footer)}</desc><defs>${defs}<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#dce6ee"/></pattern></defs><style>text{font-family:Arial,Helvetica,sans-serif}</style><rect width="1600" height="1000" fill="#f8fbfe"/><rect width="1600" height="1000" fill="url(#grid)"/>${text(40,49,title,30,palette.ink,700)}${text(40,83,subtitle,19,palette.muted)}${body}<path d="M40 917 H1560" stroke="#cbd8e2"/>${text(40,947,footer,18,palette.muted)}${text(40,978,'→ Request / response flow  |  ⇢ Dashed: preparation or persistence  |  Amber: approval / escalation',17,palette.muted)}</svg>`;
 writeFileSync(output,svg);return svg;
}
