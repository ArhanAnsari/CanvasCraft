// components/CanvasEditor/templates.ts
export type Block = {
  id: string
  type:
    | 'hero'
    | 'features'
    | 'gallery'
    | 'cta'
    | 'footer'
    | 'text'
    | 'image'
    | 'button'
    | 'aiResponse'
  props: any
}

export const Templates = {
  hero: (
    heading = '<strong>Your product</strong>',
    subheading = 'Short value proposition',
    buttonLabel = 'Get started',
    buttonHref = '#'
  ): Block => ({
    id: crypto.randomUUID(),
    type: 'hero',
    props: {
      heading,
      subheading,
      buttonLabel,
      buttonHref,
      bg: '',
      fontSize: 'base',
    },
  }),

  features: (
    title = 'Features',
    items = [
      { title: 'Fast', desc: 'Instant realtime edits' },
      { title: 'Simple', desc: 'No-code blocks' },
      { title: 'Collaborative', desc: 'See live cursors' },
    ]
  ): Block => ({
    id: crypto.randomUUID(),
    type: 'features',
    props: { title, items, bg: '', fontSize: 'base' },
  }),

  gallery: (title = 'Gallery', images: string[] = []): Block => ({
    id: crypto.randomUUID(),
    type: 'gallery',
    props: { title, images, bg: '', fontSize: 'base' },
  }),

  cta: (
    text = 'Ready to launch?',
    buttonLabel = 'Get started',
    buttonHref = '#'
  ): Block => ({
    id: crypto.randomUUID(),
    type: 'cta',
    props: { text, buttonLabel, buttonHref, bg: '', fontSize: 'base' },
  }),

  footer: (text = '© Your brand'): Block => ({
    id: crypto.randomUUID(),
    type: 'footer',
    props: { text, bg: '', fontSize: 'base' },
  }),

  text: (text = 'Edit me'): Block => ({
    id: crypto.randomUUID(),
    type: 'text',
    props: { text, bg: '', fontSize: 'base' },
  }),

  image: (src = '', alt = 'Image'): Block => ({
    id: crypto.randomUUID(),
    type: 'image',
    props: { src, alt, width: '100%', height: 'auto', rounded: false },
  }),

  button: (label = 'Click me', href = '#'): Block => ({
    id: crypto.randomUUID(),
    type: 'button',
    props: { label, href, variant: 'primary', size: 'md' },
  }),

  aiResponse: (prompt = '', response = ''): Block => ({
    id: crypto.randomUUID(),
    type: 'aiResponse',
    props: { prompt, response, createdAt: new Date().toISOString() },
  }),
}
