const http = require('http');
const {URL} = require('url');

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

function send(res, status, obj){
  res.statusCode = status;
  res.setHeader('Content-Type','application/json');
  res.end(JSON.stringify(obj));
}

function decodePolyline(str){
  let index=0, lat=0, lng=0, coordinates=[];
  while(index < str.length){
    let result=0, shift=0, b;
    do{ b=str.charCodeAt(index++)-63; result |= (b & 0x1f) << shift; shift +=5; }while(b>=0x20);
    const dlat = ((result & 1)? ~(result>>1):(result>>1));
    lat += dlat;
    result=0; shift=0;
    do{ b=str.charCodeAt(index++)-63; result |= (b & 0x1f) << shift; shift +=5; }while(b>=0x20);
    const dlng = ((result & 1)? ~(result>>1):(result>>1));
    lng += dlng;
    coordinates.push([lng/1e5, lat/1e5]);
  }
  return coordinates;
}

async function geocode(q){
  if(!GOOGLE_KEY) throw new Error('Missing API key');
  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('address', q);
  url.searchParams.set('key', GOOGLE_KEY);
  const j = await fetch(url).then(r=>r.json());
  const loc = j.results?.[0]?.geometry?.location;
  if(!loc) throw new Error('not found');
  return {lat: loc.lat, lon: loc.lng};
}

async function directions(origin,destination){
  if(!GOOGLE_KEY) throw new Error('Missing API key');
  const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
  url.searchParams.set('origin', origin);
  url.searchParams.set('destination', destination);
  url.searchParams.set('key', GOOGLE_KEY);
  const j = await fetch(url).then(r=>r.json());
  const points = j.routes?.[0]?.overview_polyline?.points;
  if(!points) throw new Error('no route');
  return {coordinates: decodePolyline(points)};
}

async function stations(path, detour){
  if(!GOOGLE_KEY) throw new Error('Missing API key');
  const radius = Math.min(detour||5,50)*1609;
  const results = new Map();
  for(let i=0;i<path.length;i+=25){
    const [lon,lat] = path[i];
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.set('location', `${lat},${lon}`);
    url.searchParams.set('radius', radius);
    url.searchParams.set('keyword', 'truck stop');
    url.searchParams.set('key', GOOGLE_KEY);
    const j = await fetch(url).then(r=>r.json());
    (j.results||[]).forEach(p=>{
      if(results.has(p.place_id)) return;
      results.set(p.place_id,{id:p.place_id,name:p.name,brand:p.name,lat:p.geometry.location.lat,lon:p.geometry.location.lng,addr:p.vicinity,truckFriendly:true});
    });
  }
  return Array.from(results.values());
}

const server = http.createServer(async (req,res)=>{
  try{
    const u = new URL(req.url, 'http://localhost');
    if(req.method==='GET' && u.pathname==='/api/google/geocode'){
      const q = u.searchParams.get('q');
      const out = await geocode(q);
      return send(res,200,out);
    }
    if(req.method==='GET' && u.pathname==='/api/google/directions'){
      const origin = u.searchParams.get('origin');
      const dest = u.searchParams.get('destination');
      const out = await directions(origin,dest);
      return send(res,200,out);
    }
    if(req.method==='POST' && u.pathname==='/api/google/stations'){
      let body='';
      req.on('data',d=>body+=d);
      req.on('end', async ()=>{
        try{
          const j=JSON.parse(body||'{}');
          const out = await stations(j.path||[], j.detour);
          send(res,200,out);
        }catch(e){ send(res,500,{error:e.message}); }
      });
      return;
    }
    send(res,404,{error:'not found'});
  }catch(e){
    send(res,500,{error:e.message});
  }
});

const port = process.env.PORT || 3000;
server.listen(port, ()=> console.log('Server listening on '+port));
