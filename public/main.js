document.addEventListener('DOMContentLoaded', () => {
  const nodes = [
    {id: 'Me', group: 'You', size: 24, icon: 'public/icons/avatar.png'},
    // OS & Environment
    {id: 'macOS', group: 'OS', icon: 'public/icons/app-window-mac.svg'},
    {id: 'Terminal (macOS)', group: 'OS', icon: 'public/icons/square-code.svg'},

    // Editors & Languages
    {id: 'Visual Studio Code', group: 'Editor', icon: 'public/icons/atom.svg'},
    {id: 'Typescript', group: 'Languages', icon: 'public/icons/package.svg'},
    {id: 'Markdown', group: 'Languages', icon: 'public/icons/file-text.svg'},

    // Frontend
    {id: 'React / Next.js', group: 'Frontend', icon: 'public/icons/rocket.svg'},
    {id: 'Astro Js', group: 'Frontend', icon: 'public/icons/presentation.svg'},
    {id: 'TailwindCss', group: 'Frontend', icon: 'public/icons/equal-approximately.svg'},
    {id: 'D3.js', group: 'Frontend', icon: 'public/icons/square-code.svg'},

    // Package managers & Build
    {id: 'pnpm', group: 'Tooling', icon: 'public/icons/package.svg'},
    {id: 'npm', group: 'Tooling', icon: 'public/icons/package.svg'},

    // Version Control / Hosting
    {id: 'GitHub', group: 'VCS', icon: 'public/icons/message-circle-more.svg'},
    {id: 'GitLab', group: 'VCS', icon: 'public/icons/mail.svg'},

    // Containers & DevOps
    {id: 'Docker', group: 'DevOps', icon: 'public/icons/database.svg'},
    {id: 'Rancher Desktop', group: 'DevOps', icon: 'public/icons/rocket.svg'},

    // Databases & Browsers
    {id: 'MongoDB', group: 'Databases', icon: 'public/icons/database.svg'},
    {id: 'DBeaver', group: 'Databases', icon: 'public/icons/notebook-pen.svg'},

    // Testing & CI
    {id: 'Vitest', group: 'Testing', icon: 'public/icons/test-tube.svg'},

    // Productivity & Communication
    {id: 'Slack', group: 'Communication', icon: 'public/icons/message-circle-more.svg'},
    {id: 'Discord', group: 'Communication', icon: 'public/icons/message-circle-more.svg'},
    {id: 'Outlook', group: 'Communication', icon: 'public/icons/mail.svg'},
    {id: 'Microsoft Teams', group: 'Communication', icon: 'public/icons/mail.svg'},

    // Design / Media
    {id: 'YouTube Music', group: 'Media', icon: 'public/icons/music-4.svg'},
    {id: 'OBS', group: 'Media', icon: 'public/icons/rocket.svg'},

    // Utilities
    {id: 'Github Copilot', group: 'AI', icon: 'public/icons/atom.svg'},
    {id: 'Gemini', group: 'AI', icon: 'public/icons/brain.svg'},
    {id: 'Bruno (API tester)', group: 'Tools', icon: 'public/icons/package.svg'},
    {id: 'Slidev', group: 'Presentation', icon: 'public/icons/presentation.svg'},
    {id: 'Calculator', group: 'Utilities', icon: 'public/icons/package.svg'},
    {id: 'Notes (macOS)', group: 'Utilities', icon: 'public/icons/notebook-pen.svg'},
    {id: 'Dbeaver', group: 'Databases', icon: 'public/icons/notebook-pen.svg'}
  ];

  // Build links connecting 'Me' to each tool for a clear personal ecosystem map
  const links = nodes.filter(n=>n.id!=='Me').map(n=>({source:'Me', target:n.id}));

  const colorByGroup = {
    'You':'#0f172a','OS':'#ef4444','Editor':'#2563eb','Languages':'#06b6d4','Frontend':'#7c3aed','Tooling':'#f59e0b','VCS':'#10b981','DevOps':'#ef6c00','Databases':'#8b5cf6','Testing':'#e11d48','Communication':'#64748b','Media':'#334155','AI':'#0ea5a4','Tools':'#64748b','Presentation':'#06b6d4','Utilities':'#94a3b8'
  };

  const width = document.getElementById('network').clientWidth;
  const height = 680;

  const svg = d3.select('#network').attr('viewBox', [0,0,width,height]);

  const defs = svg.append('defs');
  // Clip path for circular avatar image (uses objectBoundingBox so it fits any image box)
  defs.append('clipPath').attr('id', 'clip-avatar').attr('clipPathUnits', 'objectBoundingBox')
    .append('circle').attr('cx', 0.5).attr('cy', 0.5).attr('r', 0.5);

  // Create a container group that will be transformed by zoom. This preserves per-node translate transforms.
  const container = svg.append('g').attr('class','graph-container');
  const linkGroup = container.append('g').attr('stroke','#cbd5e1').attr('stroke-opacity',0.8);
  const nodeGroup = container.append('g');

  const link = linkGroup.selectAll('line').data(links).enter().append('line').attr('class','link').attr('stroke-width',1.2);

  const node = nodeGroup.selectAll('g').data(nodes).enter().append('g').attr('class','node')
    .on('mouseenter', (event,d)=>showTooltip(event,d))
    .on('mousemove', (event,d)=>moveTooltip(event))
    .on('mouseleave', hideTooltip)
    .call(drag());

  // Render each node with a background circle + icon image + label
  node.each(function(d){
    const g = d3.select(this);
    const iconSize = Math.max((d.size || 10) * 1.6, 22);
    const bgRadius = iconSize/2 + 4;
    g.append('circle').attr('r', bgRadius).attr('fill', colorByGroup[d.group]||'#94a3b8').attr('stroke','#fff').attr('stroke-width',1.5);
    if(d.icon){
      const img = g.append('image').attr('href', d.icon).attr('width', iconSize).attr('height', iconSize).attr('x', -iconSize/2).attr('y', -iconSize/2).attr('preserveAspectRatio','xMidYMid slice');
      if(d.id === 'Me') img.attr('clip-path', 'url(#clip-avatar)');
    } else {
      g.append('circle').attr('r', Math.max(d.size || 8, 8)).attr('fill', '#fff');
    }
    g.append('text').text(d.id).attr('x', bgRadius + 10).attr('y', 4).style('font-size','12px').style('fill','#0f172a');
  });

  // Increase spacing: larger link distance, stronger repulsion and collision radius
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d=>d.id).distance(160).strength(0.9))
    .force('charge', d3.forceManyBody().strength(-900))
    .force('center', d3.forceCenter(width/2, height/2))
    .force('collide', d3.forceCollide().radius(d=> (d.size||10)+18));

  simulation.on('tick', ()=>{
    link.attr('x1', d=>d.source.x).attr('y1', d=>d.source.y).attr('x2', d=>d.target.x).attr('y2', d=>d.target.y);
    node.attr('transform', d=>`translate(${d.x},${d.y})`);
  });

  function drag(){
    function started(event,d){ if(!event.active) simulation.alphaTarget(0.2).restart(); d.fx = d.x; d.fy = d.y; }
    function dragged(event,d){ d.fx = event.x; d.fy = event.y; }
    function ended(event,d){ if(!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }
    return d3.drag().on('start', started).on('drag', dragged).on('end', ended);
  }

  // Zoom: transform only the container so per-node transforms remain intact
  svg.call(d3.zoom().scaleExtent([0.5,3]).on('zoom', (event)=>{ container.attr('transform', event.transform); }));

  const tip = d3.select('#tooltip');
  function showTooltip(event,d){ tip.style('display','block').html(`<strong>${d.id}</strong><div style="opacity:0.9">${d.group}</div>`); moveTooltip(event); }
  function moveTooltip(event){ const x = event.clientX + 14, y = event.clientY + 14; tip.style('left', x + 'px').style('top', y + 'px'); }
  function hideTooltip(){ tip.style('display','none'); }

  const groups = Array.from(new Set(nodes.map(n=>n.group)));
  const legend = d3.select('#legend');
  groups.forEach(g=>{
    const item = legend.append('div').attr('class','legend-item');
    item.append('div').attr('class','dot').style('background', colorByGroup[g] || '#94a3b8');
    item.append('div').text(g);

    // highlight children/tools on legend hover (dim unrelated nodes/links)
    item.on('mouseenter', ()=>{
      node.classed('muted', d=> d.group !== g && d.id !== 'Me');
      link.classed('muted', l=>{
        const sGroup = (typeof l.source === 'object') ? l.source.group : (nodes.find(n=>n.id===l.source)||{}).group;
        const tGroup = (typeof l.target === 'object') ? l.target.group : (nodes.find(n=>n.id===l.target)||{}).group;
        return sGroup !== g && tGroup !== g;
      });
    });

    item.on('mouseleave', ()=>{
      node.classed('muted', false);
      link.classed('muted', false);
    });
  });

  window.addEventListener('resize', ()=>{
    const w = document.getElementById('network').clientWidth;
    svg.attr('viewBox', [0,0,w,height]);
    simulation.force('center', d3.forceCenter(w/2, height/2));
    simulation.alpha(0.5).restart();
  });
});
