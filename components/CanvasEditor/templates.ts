// components/CanvasEditor/templates.ts
export type Block = { id: string; type: 'hero'|'features'|'gallery'|'cta'|'footer'|'text'|'image'|'button'; props: any };

export const Templates = {
  hero: (): Block => ({ id: crypto.randomUUID(), type: 'hero', props: { heading: '<strong>Your product</strong>', subheading: 'Short value proposition', buttonLabel:'Get started', buttonHref:'#', bg: '', fontSize: 'base' } }),
  features: (): Block => ({ id: crypto.randomUUID(), type: 'features', props: { title: 'Features', items: [{title:'Fast', desc:'Instant realtime edits'},{title:'Simple', desc:'No-code blocks'},{title:'Collaborative', desc:'See live cursors'}], bg: '', fontSize: 'base' } }),
  gallery: (): Block => ({ id: crypto.randomUUID(), type: 'gallery', props: { title:'Gallery', images:[], bg: '', fontSize: 'base' } }),
  cta: (): Block => ({ id: crypto.randomUUID(), type: 'cta', props: { text:'Ready to launch?', buttonLabel: 'Get started', bg: '', fontSize: 'base' } }),
  footer: (): Block => ({ id: crypto.randomUUID(), type: 'footer', props: { text:'© Your brand', bg: '', fontSize: 'base' } }),
  text: (text='Edit me'): Block => ({ id: crypto.randomUUID(), type:'text', props: { text, bg: '', fontSize: 'base' } }),
};
