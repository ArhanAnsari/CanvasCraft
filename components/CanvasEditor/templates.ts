export type Block = { id: string; type: 'hero'|'features'|'gallery'|'cta'|'footer'|'text'|'image'|'button'; props: any };

export const Templates = {
  hero: ():Block => ({ id: crypto.randomUUID(), type: 'hero', props: { heading: 'Your product', subheading: 'Short value proposition', buttonLabel:'Get started', buttonHref:'#' } }),
  features: ():Block => ({ id: crypto.randomUUID(), type: 'features', props: { title: 'Features', items: [{title:'Fast', desc:'Instant realtime edits'},{title:'Simple', desc:'No-code blocks'},{title:'Collaborative', desc:'See live cursors'}] } }),
  gallery: ():Block => ({ id: crypto.randomUUID(), type: 'gallery', props: { title:'Gallery', images:[] } }),
  cta: ():Block => ({ id: crypto.randomUUID(), type: 'cta', props: { text:'Ready to launch?' } }),
  footer: ():Block => ({ id: crypto.randomUUID(), type: 'footer', props: { text:'© Your brand' } }),
  text: (text='Edit me'):Block => ({ id: crypto.randomUUID(), type:'text', props: { text } })
};
