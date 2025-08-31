diff --git a//dev/null b/server.js
index 0000000000000000000000000000000000000000..97118d909efc7cce2cb8a56ea028fce727c18a6e 100644
--- a//dev/null
+++ b/server.js
@@ -0,0 +1,98 @@
+import express from 'express';
+
+const app = express();
+app.use(express.static('.'));
+
+const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY || '9a30d1fe0c684c489f1ff7f506e9a1ff';
+const GOOGLE_KEY = process.env.GOOGLE_KEY || 'AIzaSyCdtEARwHnW4TAyITUf2TbC4FRSaUM3i0c';
+
+function decodePolyline(str){
+  let index=0, lat=0, lng=0, coordinates=[];
+  while(index < str.length){
+    let b, shift=0, result=0;
+    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while(b >= 0x20);
+    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
+    lat += dlat;
+    shift=0; result=0;
+    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while(b >= 0x20);
+    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
+    lng += dlng;
+    coordinates.push([lng/1e5, lat/1e5]);
+  }
+  return coordinates;
+}
+
+app.get('/api/directions', async (req,res) => {
+  const { provider='geoapify', startLon, startLat, endLon, endLat, hazmat } = req.query;
+  try {
+    if(provider === 'google'){
+      const u = new URL('https://maps.googleapis.com/maps/api/directions/json');
+      u.searchParams.set('origin', `${startLat},${startLon}`);
+      u.searchParams.set('destination', `${endLat},${endLon}`);
+      u.searchParams.set('key', GOOGLE_KEY);
+      const r = await fetch(u);
+      if(!r.ok) return res.status(r.status).end();
+      const j = await r.json();
+      const poly = j.routes?.[0]?.overview_polyline?.points;
+      if(!poly) return res.status(500).json({error:'No route'});
+      const geometry = { type:'LineString', coordinates: decodePolyline(poly) };
+      return res.json({ geometry });
+    } else {
+      const u = new URL('https://api.geoapify.com/v1/routing');
+      u.searchParams.set('waypoints', `${startLon},${startLat}|${endLon},${endLat}`);
+      u.searchParams.set('mode','drive');
+      u.searchParams.set('vehicle','truck');
+      u.searchParams.set('truckHeight','4.115');
+      u.searchParams.set('truckWidth','2.59');
+      u.searchParams.set('truckLength','22.86');
+      u.searchParams.set('truckWeight','36287');
+      if(hazmat === 'true') u.searchParams.set('hazmat','true');
+      u.searchParams.set('details','instruction_details');
+      u.searchParams.set('apiKey', GEOAPIFY_KEY);
+      const r = await fetch(u);
+      if(!r.ok) return res.status(r.status).end();
+      const j = await r.json();
+      const geometry = j.features?.[0]?.geometry;
+      if(!geometry) return res.status(500).json({error:'No route'});
+      return res.json({ geometry });
+    }
+  } catch(e){
+    res.status(500).json({error:e.message});
+  }
+});
+
+app.get('/api/places', async (req,res) => {
+  const { provider='geoapify' } = req.query;
+  try {
+    if(provider === 'google'){
+      const { lat, lon, radius='5000' } = req.query;
+      const u = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
+      u.searchParams.set('location', `${lat},${lon}`);
+      u.searchParams.set('radius', radius);
+      u.searchParams.set('keyword', 'truck stop');
+      u.searchParams.set('type', 'gas_station');
+      u.searchParams.set('key', GOOGLE_KEY);
+      const r = await fetch(u);
+      if(!r.ok) return res.status(r.status).end();
+      const j = await r.json();
+      return res.json(j);
+    } else {
+      const { minLon, minLat, maxLon, maxLat } = req.query;
+      const u = new URL('https://api.geoapify.com/v2/places');
+      u.searchParams.set('categories','service.vehicle.fuel,transport.truck_stop');
+      u.searchParams.set('filter', `rect:${minLon},${minLat},${maxLon},${maxLat}`);
+      u.searchParams.set('limit','500');
+      u.searchParams.set('apiKey', GEOAPIFY_KEY);
+      const r = await fetch(u);
+      if(!r.ok) return res.status(r.status).end();
+      const j = await r.json();
+      return res.json(j);
+    }
+  } catch(e){
+    res.status(500).json({error:e.message});
+  }
+});
+
+const PORT = process.env.PORT || 3000;
+app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
+
