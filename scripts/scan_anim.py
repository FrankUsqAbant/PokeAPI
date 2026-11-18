import struct,json,glob,os
rows=[]
for i in range(1,152):
    b=open(f'models/{i}.glb','rb').read()
    n=struct.unpack('<I',b[12:16])[0]; j=json.loads(b[20:20+n])
    an=j.get('animations',[])
    rows.append((i,len(b),len(an),[a.get('name') for a in an][:3],len(j.get('skins',[]))))
sin=[r[0] for r in rows if r[2]==0]
print('con animacion:',151-len(sin),'| sin animacion:',len(sin),sin)
print('con skin:',sum(1 for r in rows if r[4]))
print('multi-clip:',[(r[0],r[2]) for r in rows if r[2]>1][:15])
