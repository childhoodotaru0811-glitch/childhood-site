(function(){
  var D=window.WORKS,G=window.GROUPS;
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  var root=document.getElementById('groups'),grids={},idx={};
  Object.keys(G).forEach(function(k){
    var s=document.createElement('div');s.className='grp';s.dataset.g=k;
    s.innerHTML='<h3 class="gh">'+G[k][0]+' <small>'+G[k][1]+'</small></h3><div class="grid"></div>';
    root.appendChild(s);grids[k]=s.querySelector('.grid');idx[k]=0;
  });
  D.forEach(function(d){
    var soon=!d[1],t=document.createElement(soon?'div':'button');
    t.className='tile'+(soon?' soon':'');
    if(!soon){t.type='button';t.dataset.id=d[1];t.dataset.t=d[2];t.setAttribute('aria-label',d[2]+' を再生')}
    var th=document.createElement('div');th.className='thumb';
    th.style.setProperty('--h',G[d[0]][2]+(idx[d[0]]++*9)%40);
    if(soon){th.innerHTML='<b>COMING SOON</b>'}
    else{var im=new Image();im.alt='';im.loading='lazy';im.onerror=function(){im.remove()};
      im.src='https://img.youtube.com/vi/'+d[1]+'/hqdefault.jpg';th.appendChild(im)}
    t.appendChild(th);
    var x=document.createElement('div');
    x.innerHTML='<h4 title="'+esc(d[2])+'">'+esc(d[2])+'</h4>'+(d[3]?'<p class="cl">'+esc(d[3])+'</p>':'')
      +(d[4]?'<div class="roles">'+d[4].split('・').map(function(r){return '<span>'+esc(r)+'</span>'}).join('')+'</div>':'');
    t.appendChild(x);grids[d[0]].appendChild(t);
  });
  var dlg=document.getElementById('dlg'),mv=document.getElementById('mv');
  function stop(){mv.innerHTML=''}
  root.addEventListener('click',function(e){
    var b=e.target.closest('.tile');if(!b||!b.dataset.id)return;
    var id=b.dataset.id;
    mv.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+esc(b.dataset.t)+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    document.getElementById('mt').textContent=b.dataset.t;
    document.getElementById('yl').href='https://www.youtube.com/watch?v='+id;
    dlg.showModal();
  });
  document.getElementById('cls').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  dlg.addEventListener('close',stop);
  var btns=document.querySelectorAll('.tabs button');
  function setF(f){
    btns.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.f===f))});
    document.querySelectorAll('.grp').forEach(function(g){g.hidden=!(f==='all'||g.dataset.g===f)});
  }
  btns.forEach(function(b){b.addEventListener('click',function(){setF(b.dataset.f)})});
  document.querySelectorAll('.gate button').forEach(function(g){g.addEventListener('click',function(){
    setF(g.dataset.go);document.getElementById('works').scrollIntoView({behavior:'smooth'})})});
})();

(function(){
  var d=document.getElementById('fdlg'),f=document.getElementById('cf'),th=document.getElementById('fth'),er=document.getElementById('ferr');
  var chips=f.querySelectorAll('input[name="type"]'),btn=f.querySelector('button[type="submit"]');
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-form]');if(!a)return;
    e.preventDefault();f.hidden=false;th.hidden=true;er.hidden=true;d.showModal();
  });
  d.addEventListener('click',function(e){if(e.target===d||e.target.closest('[data-close]'))d.close()});
  d.addEventListener('close',function(){f.reset()});
  chips.forEach(function(c){c.addEventListener('change',function(){chips[0].setCustomValidity('')})});
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(![].some.call(chips,function(c){return c.checked})){
      chips[0].setCustomValidity('ご相談の内容を1つ以上お選びください');chips[0].reportValidity();return}
    var fd=new FormData(f),url=(window.SITE||{}).formEndpoint;
    var body={type:fd.getAll('type'),name:fd.get('name'),org:fd.get('org'),email:fd.get('email'),tel:fd.get('tel'),
      when:fd.get('when'),budget:fd.get('budget'),message:fd.get('message'),consent:!!fd.get('consent'),website:fd.get('website')};
    er.hidden=true;
    if(!url){er.hidden=false;return}
    var label=btn.textContent;btn.disabled=true;btn.textContent='送信中…';
    fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
      .then(function(r){return r.json().then(function(j){return r.ok&&j.ok})})
      .then(function(ok){if(!ok)throw new Error('send failed');f.hidden=true;th.hidden=false;d.scrollTop=0})
      .catch(function(){er.hidden=false})
      .then(function(){btn.disabled=false;btn.textContent=label});
  });
})();
